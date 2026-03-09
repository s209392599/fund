/*
日周月排行榜交叉 筛选
*/
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码

const os = require('os');
const { default: pLimit } = require('p-limit');
// const limit = pLimit(5); // 设置并发数为5
// const limit = pLimit(os.cpus().length * 2); // CPU核心数
const limit = pLimit(os.cpus().length); // CPU核心数
const limit_2 = pLimit(2);
const limit_5 = pLimit(5);

const {
  queryResilienceInfo,// 获取所有基金
  filter_keywords,// 过滤关键词
  getFundGz, // 获取基金实时涨幅
  getJingdongBaseInfo, // 获取京东金融基本信息
  getFundDetailChartPageInfo, // 获取京东金融回撤修复
  getFundTradeRulesPageInfo, // 获取基金买卖费率
} = require('./mehods/index.js');

// 过滤条件
const filterObj = {
  nian_hua: 10, // 年化收益不低于10
  mai_chu_gui_ze: 3, // 卖出规则只有两条，三条则可能是要求30天之后
  xiu_fu_tian_shu: 150,// 回撤修复天数要小于120
  zui_da_hui_che: -30,// 最大回撤要小于10%
};
const params_keywords = {
  keyword_arr: [],
  noFundType: ['债券', '货币'],
  noEndWith: ['A', 'ETF', '(后端)'],// 不以什么结尾
  // 额外去除的关键词或者基金名称
  extraFundNameArr: [
    // '混合',
  ],
  // 额外去除的基金代码
  extraFundCodeArr: [
    // '000001',// 华夏成长混合
  ],
  // 额外添加的基金
  extraAddFundArr: [
    // {
    //   fund_code: '000001',
    //   fund_name: '华夏成长混合',
    //   fund_type: '混合型-灵活',
    // }
  ],
}

const info = {
  filter_data: [], // 过滤后的数据
  err_data: {
    feilv: [],// 费率错误的
    baseinfo: [],// 基本信息错误的
    zhang_fu: [],// 预测涨幅错误的
    hui_che: [],// 回撤修复错误的
  },
};


// console.log('noText', noText);
// console.log('noFundCode', noFundCode);
/*
https://fund.eastmoney.com/data/fundranking.html
pn: 请求多少条数据，应该是page number
pi: 页码
sd: start date  后面的自定义搜索
ed: end date
*/

const pn = 500; // 请求500条数据
// 日增长率
const url_1 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=rzdf&st=desc&sd=2024-09-28&ed=2025-09-28&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=0.1487653330314005`;
// 周
const url_2 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&sd=2024-07-28&ed=2025-09-28&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=0.905523524272557`;
// 月
const url_3 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=1yzf&st=desc&sd=2024-07-28&ed=2025-09-28&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=0.8641197374389376`;

const pageObj = {
  data_1: [], // 日增长率
  data_2: [], // 周增长率
  data_3: [], // 月数据
};

async function getData(url, key) {
  try {
    const res = await fetch(url, {
      headers: {
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        referer: 'https://fund.eastmoney.com/data/fundranking.html',
      },
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    const cur_text = await res.text();
    const match = cur_text.match(/var\s+rankData\s*=\s*(\{[\s\S]*?\});/);
    if (match) {
      const rankData = eval('(' + match[1] + ')');
      let arr_1 = (rankData.datas || []).filter((item) => {
        const [code, name] = item.split(',');
        if (name.endsWith('A')) return false;
        if (noText.some((kw) => name.includes(kw))) return false;
        if (noFundCode.some((kw) => code.includes(kw))) return false;
        return true;
      });
      pageObj[key] = arr_1.map((item) => {
        const [code, name] = item.split(',');
        return [code, name];
        // return [item[0], item[1]];
      });

      // fs.writeFileSync(`./data/rankData_${key}.json`, JSON.stringify(arr_1, null, 2));

      rankData.datas = arr_1;
    }
  } catch (err) {
    console.log('err', err);
  }
}

function getIntersection(...arrays) {
  if (arrays.length === 0) return [];
  let result = arrays[0];
  for (let i = 1; i < arrays.length; i++) {
    const codes = new Set(arrays[i].map((item) => item[0]));
    result = result.filter((item) => codes.has(item[0]));
  }
  return result;
}

async function init() {
  console.log('开始获取 日排行榜');
  await getData(url_1, 'data_1'); // 日
  console.log('开始获取 周排行榜');
  await getData(url_2, 'data_2'); // 周
  console.log('开始获取 月排行榜');
  await getData(url_3, 'data_3'); // 月

  const sameItems = getIntersection(
    pageObj.data_1,
    pageObj.data_2,
    pageObj.data_3
  );

  const json_data = sameItems.map((v) => {
    return { fund_code: v[0], fund_name: v[1] };
  });

  info.filter_data = json_data;
}

// 天天基金能读取到预测涨幅
async function getPredictedRise() {
  info.err_data.zhang_fu = [];
  const promises = info.filter_data.map((item, index) => {
    return limit_2(async () => {
      // 进度
      let progress = Math.floor((index + 1) / info.filter_data.length * 100);
      console.log(`第 ${index + 1} 个  进度: ${progress}% ${item.fund_code}-${item.fund_name} 的预测涨幅...`);
      try {
        let predictedRise = await getFundGz(item.fund_code);
        if (predictedRise) {
          return item;
        } else {
          info.err_data.zhang_fu.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: '无数据',
          });
          console.log(`${item.fund_code}-${item.fund_name}  无数据`);
          return null;
        }
      } catch (err) {
        info.err_data.zhang_fu.push({
          fund_code: item.fund_code,
          fund_name: item.fund_name,
          reason: '请求出错',
        });
        console.log('err => ', err);
        return item;
      }
    });
  });

  const results = await Promise.all(promises);
  const new_data = results.filter(result => result !== null);
  info.filter_data = new_data;
  console.log(`天天基金能读取到预测涨幅的基金有 ${info.filter_data.length} 个`);
}

// 过滤京东金融基本信息
async function jingdongBaseInfo() {
  info.err_data.baseinfo = [];
  const promises = info.filter_data.map((item, index) => {
    return limit(async () => {
      // 进度
      let progress = Math.floor((index + 1) / info.filter_data.length * 100);
      console.log(`第 ${index + 1} 个  进度: ${progress}% ${item.fund_code}-${item.fund_name} 的基本信息...`);
      try {
        let datas = await getJingdongBaseInfo(item.fund_code);
        if (datas) {
          // 跳过不可买
          if (!datas.isForSale) {
            return null;
          }

          // 跳过成立不到1年的基金
          const fundProfileOfItem = datas.fundProfileOfItem || {};
          const establishedDate = fundProfileOfItem.establishedDate || '';
          if (establishedDate && Date.now() - new Date(establishedDate).getTime() < 365 * 24 * 60 * 60 * 1000) {
            return null;
          }
          // 跳过规模不到一亿
          const fundScale = fundProfileOfItem.fundScale || '';
          if (!fundScale.includes('亿元')) {
            return null;
          }

          // 跳过近 1月、3月、6月排名靠后的
          const obj_1 = datas.performanceOfItem || {};
          const obj_2 = obj_1.historyPerformanceMap || {};
          const obj_3 = obj_2.historyPerformanceList || [];
          const rank_1 = (obj_3[1] || {}).rank || '';
          const rank_3 = (obj_3[2] || {}).rank || '';
          const rank_6 = (obj_3[3] || {}).rank || '';
          if (rank_1.includes('/') && rank_3.includes('/') && rank_6.includes('/')) {
            let rank_1_num = Number(rank_1.split('/')[0]) / Number(rank_1.split('/')[1]);
            let rank_3_num = Number(rank_3.split('/')[0]) / Number(rank_3.split('/')[1]);
            let rank_6_num = Number(rank_6.split('/')[0]) / Number(rank_6.split('/')[1]);
            if (rank_1_num > 0.5 && rank_3_num > 0.5 && rank_6_num > 0.5) {
              return null;
            }
          }

          // 近1年年化大于20
          const rate_12 = (obj_3[4] || {}).rate || 0;
          if (parseFloat(rate_12) < filterObj.nian_hua) {
            return null;
          }

          return item;
        } else {
          info.err_data.baseinfo.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: '无数据',
          });
          console.log(`${item.fund_code}-${item.fund_name}  无数据`);
          return item;
        }
      } catch (err) {
        info.err_data.baseinfo.push({
          fund_code: item.fund_code,
          fund_name: item.fund_name,
          reason: '请求出错',
        });
        console.log('err => ', err);
        return item;
      }
    });
  });

  const results = await Promise.all(promises);
  const new_data = results.filter(result => result !== null);
  info.filter_data = new_data;
  console.log(`符合京东金融能读取基本信息的基金有 ${info.filter_data.length} 个`);
}

// 过滤买卖费率
async function filterBuyAndSellFee() {
  info.err_data.feilv = [];
  const promises = info.filter_data.map((item, index) => {
    return limit(async () => {
      // 进度
      let progress = Math.floor((index + 1) / info.filter_data.length * 100);
      console.log(`第 ${index + 1} 个  进度: ${progress}% ${item.fund_code}-${item.fund_name} 的买卖费率...`);
      try {
        let datas = await getFundTradeRulesPageInfo(item.fund_code);
        if (datas) {
          // 可定投
          let purchaseRule = datas.purchaseRule || {};
          if (purchaseRule.aipStatus !== '可定投') {
            return null;
          }

          // 综合费率超过2
          let depositFeeRatio = parseFloat(purchaseRule.depositFeeRatio || 0) * 100;
          let manageFeeRatio = parseFloat(purchaseRule.manageFeeRatio || 0) * 100;
          let saleServiceFeeRatio = parseFloat(purchaseRule.saleServiceFeeRatio || 0) * 100;
          let flag_2 = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio > 200;
          if (flag_2) {
            return null;
          }

          // 买入费率超过1条规则
          if ((purchaseRule.purchaseFeeRatio || []).length > 1) return null;

          // 卖出费率超过3条规则
          const redeemRule = datas.redeemRule || {};
          const redeemFeeRatio = redeemRule.redeemFeeRatio || [];
          if (redeemFeeRatio.length > filterObj.mai_chu_gui_ze) {
            return null;
          }

          // 开放赎回
          const redeemStatus = redeemRule.redeemStatus || '';
          if (redeemStatus !== '开放赎回') {
            return null;
          }

          return item;
        } else {
          info.err_data.feilv.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: '无数据',
          });
          console.log(`${item.fund_code}-${item.fund_name}  无数据`);
          return item;
        }
      } catch (err) {
        info.err_data.feilv.push({
          fund_code: item.fund_code,
          fund_name: item.fund_name,
          reason: '请求出错',
        });
        console.log('err => ', err.message);
        return item;
      }
    });
  });

  const results = await Promise.all(promises);
  const new_data = results.filter(result => result !== null);
  info.filter_data = new_data;
  console.log(`符合费率要求的有 ${info.filter_data.length} 个`);
}

// 过滤回撤修复
async function filterWithdrawalRecovery() {
  info.err_data.hui_che = [];
  const promises = info.filter_data.map((item, index) => {
    return limit(async () => {
      // 进度
      let progress = Math.floor((index + 1) / info.filter_data.length * 100);
      console.log(`第 ${index + 1} 个  进度: ${progress}% ${item.fund_code}-${item.fund_name} 的回撤修复...`);
      try {
        let datas = await getFundDetailChartPageInfo(item.fund_code);
        if (datas) {
          // 修复天数大于150天
          const restoreDay = datas.restoreDay || 0;
          if (restoreDay > filterObj.xiu_fu_tian_shu) {
            return null;
          }

          // 最大回撤高于30%
          const maxRetracementValue = datas.maxRetracementValue || 0;
          if (maxRetracementValue < filterObj.zui_da_hui_che) {
            return null;
          }

          return item;
        } else {
          info.err_data.hui_che.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: '无数据',
          });
          console.log(`${item.fund_code}-${item.fund_name}  无数据`);
          return item;
        }
      } catch (err) {
        info.err_data.hui_che.push({
          fund_code: item.fund_code,
          fund_name: item.fund_name,
          reason: '请求出错',
        });
        console.log('err => ', err.message);
        return item;
      }
    });
  });

  const results = await Promise.all(promises);
  const new_data = results.filter(result => result !== null);
  info.filter_data = new_data;
  console.log(`符合京东金融能读取回撤修复的基金有 ${info.filter_data.length} 个`);
}

async function main() {
  const startTime = Date.now();
  try {
    // 请求基金数据
    await init();

    // 过滤出来包含关键词的基金
    await filter_keywords({
      filter_data: info.filter_data,
      ...params_keywords,
    });

    // 买卖费率
    await filterBuyAndSellFee();

    // 京东金融基本信息
    await jingdongBaseInfo();

    // 天天基金预测涨幅
    await getPredictedRise();

    // 回撤修复
    await filterWithdrawalRecovery();

    // 写入筛选后的数据
    fs.writeFileSync('./data/filter.json', JSON.stringify(info.filter_data, null, 2));
    // 写入错误数据
    fs.writeFileSync('./data/error_arr.json', JSON.stringify(info.err_data, null, 2));
    if (info.err_data.baseinfo.length > 0) {
      console.log('基础信息错误数据长度:', info.err_data.baseinfo.length);
    }
    if (info.err_data.feilv.length > 0) {
      console.log('费率错误数据长度:', info.err_data.feilv.length);
    }
    if (info.err_data.zhang_fu.length > 0) {
      console.log('预测涨幅错误数据长度:', info.err_data.zhang_fu.length);
    }
    if (info.err_data.hui_che.length > 0) {
      console.log('回撤修复错误数据长度:', info.err_data.hui_che.length);
    }
  } catch (err) {
    console.log('err => ', err);
  } finally {
    const endTime = Date.now();
    const diffTime = endTime - startTime;
    const minutes = Math.floor(diffTime / 60000);
    const seconds = Math.floor((diffTime % 60000) / 1000);
    const milliseconds = diffTime % 1000;
    console.log(`整体耗时: ${minutes} 分 ${seconds} 秒 ${milliseconds} 毫秒`);
  }
}
main();
