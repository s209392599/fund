const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const os = require('os');
const { default: pLimit } = require('p-limit');
// const limit = pLimit(5); // 设置并发数为5
const limit = pLimit(os.cpus().length * 2); // CPU核心数
// const limit = pLimit(os.cpus().length); // CPU核心数
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
  nian_hua: 50, // 年化收益不低于10
  mai_chu_gui_ze: 3, // 卖出规则只有两条，三条则可能是要求30天之后
  xiu_fu_tian_shu: 80,// 回撤修复天数要小于120
  zui_da_hui_che: -20,// 最大回撤要小于10%
  zong_he_fei_lv: 2,// 综合费率不能大于1.5%
};
const params_keywords = {
  keyword_arr: [
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
  ],
  noFundType: ['债券', '货币', '指数', 'QDII'],
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
          const rank_z_1 = (obj_3[0] || {}).rank || '';// 近1周
          const rank_1 = (obj_3[1] || {}).rank || '';// 近1月
          const rank_3 = (obj_3[2] || {}).rank || '';// 近3月
          const rank_6 = (obj_3[3] || {}).rank || '';// 近6月
          const rank_y_1 = (obj_3[4] || {}).rank || '';// 近1年
          if (rank_1.includes('/') && rank_3.includes('/') && rank_6.includes('/')) {
            let rank_z_1_num = Number(rank_z_1.split('/')[0]) / Number(rank_z_1.split('/')[1]);
            let rank_1_num = Number(rank_1.split('/')[0]) / Number(rank_1.split('/')[1]);
            let rank_3_num = Number(rank_3.split('/')[0]) / Number(rank_3.split('/')[1]);
            let rank_6_num = Number(rank_6.split('/')[0]) / Number(rank_6.split('/')[1]);
            let rank_y_1_num = Number(rank_y_1.split('/')[0]) / Number(rank_y_1.split('/')[1]);
            // if (rank_1_num > 0.5 && rank_3_num > 0.5 && rank_6_num > 0.5) {
            //   return null;
            // }
            let falg_rabk_1 = rank_z_1_num > 0.5;
            let falg_rabk_2 = rank_1_num > 0.5;
            let falg_rabk_3 = rank_3_num > 0.5;
            let falg_rabk_4 = rank_6_num > 0.5;
            let falg_rabk_5 = rank_y_1_num > 0.5;

            if (falg_rabk_1 || falg_rabk_2 || falg_rabk_3 || falg_rabk_4 || falg_rabk_5) {
              return null;
            }
          }

          // 近1年年化
          const rate_12 = (obj_3[4] || {}).rate || 0;
          if (parseFloat(rate_12) < filterObj.nian_hua) {
            return null;
          }
          const rate_1 = (obj_3[0] || {}).rate || 0;// 近1月收益
          const rate_3 = (obj_3[2] || {}).rate || 0;// 近3月收益
          const rate_6 = (obj_3[3] || {}).rate || 0;// 近6月收益
          const rate_y_1 = (obj_3[4] || {}).rate || 0;// 近1年收益

          if(rate_1 < filterObj.nian_hua/12){
            return null;// 近1月收益要大于0
          }
          // 近3月收益要大于0 并且近3月收益要大于近1月收益
          if(rate_3 < filterObj.nian_hua/4 && rate_3 >= rate_1){
            return null;
          }
          // 近6月收益要大于0 并且近6月收益要大于近3月收益
          if(rate_6 < filterObj.nian_hua/2 && rate_6 >= rate_3){
            return null;
          }
          // 近1年收益要大于0 并且近1年收益要大于近6月收益
          if(rate_y_1 <= 0 && rate_y_1 >= rate_6){
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
          let flag_2 = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio > filterObj.zong_he_fei_lv * 100;
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
    await queryResilienceInfo(info.filter_data);

    // 过滤出来包含关键词的基金
    await filter_keywords({
      filter_data: info.filter_data,
      ...params_keywords,
    });

    // 京东金融基本信息
    await jingdongBaseInfo();

    // 买卖费率
    await filterBuyAndSellFee();

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
