const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const pLimit = require('p-limit');
const limit = pLimit(5);// 设置并发数为5

// 包含的关键词
var keyword_arr = [
  '量化',
  '策略',
  '灵活',
  '因子',
  '增强',
  '绝对收益',
  '动量',
  '成长',
  '趋势',
  '绩优',
  '智选',
  '优选',
];
// 不要的基金类型关键词
var noFundType = ['债券', '货币', '指数', 'QDII'];
// 不以什么结尾
var noEndWith = ['A', 'ETF', '(后端)'];

const info = {
  search_data: [],
  filter_data: [], // 过滤后的数据
};

async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);
    info.search_data = fundArray;
    console.log(`一共有${fundArray.length}个基金需要过滤`);
  } catch (err) {
    console.log('err => ', err);
  }
}

async function filter_fn() {
  // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  let all_fund_len = info.search_data.length;
  for (let i = 0; i < all_fund_len; i++) {
    let item = info.search_data[i];
    let fund_code = item[0]; // 基金代码
    let fund_name = item[2]; // 基金名称
    let fund_type = item[3]; // 基金类型
    // 需要包含 量化、策略、灵活、因子、增强、绝对收益、动量、成长、趋势、绩优、智选、优选、精选
    if (!keyword_arr.some((v) => fund_name.includes(v))) {
      continue;
    }
    // 基金类型中不能有货币、债券
    if (noFundType.some((v) => fund_type.includes(v))) {
      continue;
    }
    // 不能以 A、ETF、(后端) 结尾
    if (noEndWith.some((v) => fund_name.endsWith(v))) {
      continue;
    }
    // 不能包含 noText 中的关键词
    if (noText.some((v) => fund_name.includes(v))) {
      continue;
    }
    // 不能包含 noFundCode 中的基金代码
    if (noFundCode.includes(fund_code)) {
      continue;
    }
    info.filter_data.push({
      fund_code: item[0],
      fund_name: item[2],
      fund_type: item[3],
    });
  }
  delete info.search_data;// 删除中间变量，释放内存
  console.log(`过滤后一共有${info.filter_data.length}个基金`);
}


function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str;
}
async function getFundGz(fundCode) {
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fundCode}.js?rt=${+new Date()}`;
    let response = await fetch(u);
    const res = (await response.text()) || {};
    let str = realTimeInformation(res);
    let obsData = JSON.parse(str || '{}');
    return obsData.hasOwnProperty('gszzl');
  } catch (err) {
    return false;
  }
}
// 天天基金能读取到预测涨幅
async function getPredictedRise(fundCode) {
  let new_data = [];
  for (let i = 0; i < info.filter_data.length; i++) {
    let item = info.filter_data[i];
    console.log(`第 ${i + 1} 个 ${item.fund_code}-${item.fund_name} 的预测涨幅...`);
    try {
      let predictedRise = await getFundGz(item.fund_code);
      if (predictedRise) {
        new_data.push(item);
      }
    } catch (err) {
      new_data.push(item);
    }
  }
  info.filter_data = new_data;
  console.log(`天天基金能读取到预测涨幅的基金有 ${info.filter_data.length} 个`);
}

async function getHisData(fundCode) {
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fundCode}","itemId":"","clientVersion":"","channel":"9"}`;
    let response = await fetch(u);
    const res = (await response.json()) || {};
    let resultData = res.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}

async function jingdongBaseInfo() {
  let new_data = [];
  for (let i = 0; i < info.filter_data.length; i++) {
    let item = info.filter_data[i];
    console.log(`第 ${i + 1} 个 ${item.fund_code}-${item.fund_name} 的基本信息...`);
    try {
      let datas = await getHisData(item.fund_code);
      if (datas) {
        // 跳过不可买
        if (!datas.isForSale) {
          continue;
        }

        // 跳过成立不到1年的基金
        const fundProfileOfItem = datas.fundProfileOfItem || {};
        const establishedDate = fundProfileOfItem.establishedDate || '';
        if (establishedDate && Date.now() - new Date(establishedDate).getTime() < 365 * 24 * 60 * 60 * 1000) {
          continue;
        }
        // 跳过规模不到一亿
        const fundScale = fundProfileOfItem.fundScale || '';
        if (!fundScale.includes('亿元')) {
          continue;
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
            continue;
          }
        }

        // 近1年年化大于20
        const rate_12 = (obj_3[4] || {}).rate || 0;
        if (parseFloat(rate_12) < 20) {
          continue;
        }

        new_data.push(item);
      } else {
        new_data.push(item);
      }
    } catch (err) {
      new_data.push(item);
    }
  }
  info.filter_data = new_data;
  console.log(`符合京东金融能读取基本信息的基金有 ${info.filter_data.length} 个`);
}

// 获取买卖费率
async function getFundTradeRulesPageInfo(fundCode) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}
// 过滤买卖费率
async function filterBuyAndSellFee(fundCode) {
  let new_data = [];
  for (let i = 0; i < info.filter_data.length; i++) {
    let item = info.filter_data[i];
    console.log(`第 ${i + 1} 个 ${item.fund_code}-${item.fund_name} 的买卖费率...`);
    try {
      let datas = await getFundTradeRulesPageInfo(item.fund_code);
      if (datas) {
        // 可定投
        let purchaseRule = datas.purchaseRule || {};
        if (purchaseRule.aipStatus !== '可定投') {
          continue;
        }

        // 综合费率超过2
        let depositFeeRatio = parseFloat(purchaseRule.depositFeeRatio || 0) * 100;
        let manageFeeRatio = parseFloat(purchaseRule.manageFeeRatio || 0) * 100;
        let saleServiceFeeRatio = parseFloat(purchaseRule.saleServiceFeeRatio || 0) * 100;
        let flag_2 = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio > 200;
        if (flag_2) {
          continue;
        }

        // 买入费率超过1条规则
        if((purchaseRule.purchaseFeeRatio || []).length > 1) continue;

        // 卖出费率超过3条规则
        const redeemRule = datas.redeemRule || {};
        const redeemFeeRatio = redeemRule.redeemFeeRatio || [];
        if(redeemFeeRatio.length > 3){
          continue;
        }

        // 开放赎回
        const redeemStatus = redeemRule.redeemStatus || '';
        if (redeemStatus !== '开放赎回') {
          continue;
        }

        new_data.push(item);
      }else{
        new_data.push(item);
      }
    } catch (err) {
      new_data.push(item);
    }
  }
  info.filter_data = new_data;
  console.log(`符合京东金融能读取买卖费率的基金有 ${info.filter_data.length} 个`);
}


// 获取回撤修复
async function getFundDetailChartPageInfo(fundCode) {
   try {
      let base_url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?`;
      let u = `${base_url}reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
      const response = await fetch(u);
      const data = await response.json();
      let resultData = data.resultData || {};
      let datas = resultData.datas || {};
      return datas;
    } catch (err) {
      return null;
    }
}

// 过滤回撤修复
async function filterWithdrawalRecovery(fundCode) {
  let new_data = [];
  for (let i = 0; i < info.filter_data.length; i++) {
    let item = info.filter_data[i];
    console.log(`第 ${i + 1} 个 ${item.fund_code}-${item.fund_name} 的回撤修复...`);
    try {
      let datas = await getFundDetailChartPageInfo(item.fund_code);
      if (datas) {
        // 修复天数大于150天
        const restoreDay = datas.restoreDay || 0;
        if (restoreDay > 150) {
          continue;
        }

        // 最大回撤高于30%
        const maxRetracementValue = datas.maxRetracementValue || 0;
        if (maxRetracementValue < -30) {
          continue;
        }

        new_data.push(item);
      }else{
        new_data.push(item);
      }
    } catch (err) {
      new_data.push(item);
    }
  }
  info.filter_data = new_data;
  console.log(`符合京东金融能读取回撤修复的基金有 ${info.filter_data.length} 个`);
}

async function main() {
  try {
    // 请求基金数据
    await queryResilienceInfo();

    // 过滤出来包含关键词的基金
    await filter_fn();

    // 京东金融基本信息
    await jingdongBaseInfo();

    // 天天基金预测涨幅
    await getPredictedRise();

    // 买卖费率
    await filterBuyAndSellFee();

    // 回撤修复
    await filterWithdrawalRecovery();

    // filter_data写入到data/filter.json
    fs.writeFileSync('./data/filter.json', JSON.stringify(info.filter_data));
  } catch (err) {
    console.log('err => ', err);
  }
}
main();
