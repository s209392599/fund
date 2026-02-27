const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');
const { default: pLimit } = require('p-limit');
// const limit = pLimit(5); // 设置并发数为5
// const limit = pLimit(os.cpus().length * 2); // CPU核心数
const limit = pLimit(os.cpus().length); // CPU核心数
const limit_2 = pLimit(2);

const {
  queryResilienceInfo,// 获取所有基金
  filter_keywords,// 过滤关键词
  getFundGz, // 获取基金实时涨幅
  getJingdongBaseInfo, // 获取京东金融基本信息
  getFundDetailChartPageInfo, // 获取京东金融回撤修复
  getFundTradeRulesPageInfo, // 获取基金买卖费率
  getFundFeatureData, // 获取基金特色数据(波动率、夏普率、最大回撤等)
  getFundDiagnosisPageInfo, // 获取基金综合诊断
} = require('./mehods/index.js');

// 过滤条件
const filterObj = {
  nian_hua: 20, // 年化收益不低于10
  mai_chu_gui_ze: 3, // 卖出规则只有两条，三条则可能是要求30天之后
  xiu_fu_tian_shu: 100,// 回撤修复天数要小于120
  zui_da_hui_che: -20,// 最大回撤要小于10%
  zong_he_fei_lv: 2,// 综合费率不能大于1.5%
  qian_shi_cang: 40,// 前十仓位和不超过45%
  qian_er_cang: 15,// 前二仓位和不超过25%
  // 优秀稳健型基金：年化波动率 < 10%
  // 中等稳健型基金：10% < 年化波动率 < 15%
  // 高波动基金：年化波动率 > 15%
  volatility: 20,// 波动率,越小越好
  // 优秀稳健型基金：夏普比率 > 2
  // 中等稳健型基金：1 < 夏普比率 < 2
  // 低效率基金：夏普比率 < 1
  sharp_ratio: 2,// 夏普率,越大越好
  calmar_ratio: 2,// 卡玛比率,越大越好
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
    '周期驱动',
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
    // 不满足条件的
    not_meet_condition: [],
    tese: [],// 特色数据错误的基金
    zhenduan: [],// 综合诊断错误的基金
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
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: '不可买',
            });
            return null;
          }

          // 跳过成立不到1年的基金
          const fundProfileOfItem = datas.fundProfileOfItem || {};
          const establishedDate = fundProfileOfItem.establishedDate || '';
          if (establishedDate && Date.now() - new Date(establishedDate).getTime() < 365 * 24 * 60 * 60 * 1000) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: '成立不到1年',
            });
            return null;
          }
          // 跳过规模不到一亿
          const fundScale = fundProfileOfItem.fundScale || '';
          if (!fundScale.includes('亿元')) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: '规模不到一亿',
            });
            return null;
          }

          // 跳过前十仓位不超过45%
          const obj_cang_1 = datas.investmentDistributionNewOfItem || {};
          const obj_cang_2 = obj_cang_1.investmentDistribution || {};
          const str_cang_10 = obj_cang_2.stockNavRatio || '';// 前10大占比29.54%
          const num_cang_10 = parseFloat(str_cang_10.replace('前10大占比', '').replace(/%/g, '') || 0);
          if (num_cang_10 && num_cang_10 > filterObj.qian_shi_cang) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `前十仓位超过${filterObj.qian_shi_cang}%`,
            });
            return null;
          }
          // 跳过前二持仓不超过30%
          const str_cang_2 = obj_cang_2.bondNavRatio || '';// 前2大占比29.54%
          const num_cang_2 = parseFloat(str_cang_2.replace('前2大占比', '').replace(/%/g, '') || 0);
          if (num_cang_2 && num_cang_2 > filterObj.qian_er_cang) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `前二仓位超过${filterObj.qian_er_cang}%`,
            });
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
              info.err_data.not_meet_condition.push({
                fund_code: item.fund_code,
                fund_name: item.fund_name,
                reason: '近1月、3月、6月排名靠后',
              });
              return null;
            }
          }

          // 近1年年化
          const rate_12 = (obj_3[4] || {}).rate || 0;
          if (parseFloat(rate_12) < filterObj.nian_hua) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `近1年年化${filterObj.nian_hua}%`,
            });
            return null;
          }
          const rate_1 = Number((obj_3[1] || {}).rate || 0);// 近1月收益
          const rate_3 = Number((obj_3[2] || {}).rate || 0);// 近3月收益
          const rate_6 = Number((obj_3[3] || {}).rate || 0);// 近6月收益
          const rate_y_1 = Number((obj_3[4] || {}).rate || 0);// 近1年收益

          if (rate_1 < filterObj.nian_hua / 12) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `近1月收益小于${filterObj.nian_hua / 12}%`,
            });
            return null;// 近1月收益要大于0
          }
          // 近3月收益要大于0 并且近3月收益要大于近1月收益
          if (rate_3 < filterObj.nian_hua / 4 && rate_3 >= rate_1) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `近3月收益小于${filterObj.nian_hua / 4}%`,
            });
            return null;
          }
          // 近6月收益要大于0 并且近6月收益要大于近3月收益
          if (rate_6 < filterObj.nian_hua / 2 && rate_6 >= rate_3) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `近6月收益小于${filterObj.nian_hua / 2}%`,
            });
            return null;
          }
          // 近1年收益要大于0 并且近1年收益要大于近6月收益
          if (rate_y_1 <= 0 && rate_y_1 >= rate_6) {
            info.err_data.not_meet_condition.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `近1年收益小于${filterObj.nian_hua}%`,
            });
            return null;
          }

          item.itemId = datas?.headerOfItem?.itemId || '';
          item.rate_y_1 = rate_y_1;

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
            info.err_data.feilv.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: '不可定投',
            });
            return null;
          }

          // 综合费率超过2
          let depositFeeRatio = parseFloat(purchaseRule.depositFeeRatio || 0) * 100;
          let manageFeeRatio = parseFloat(purchaseRule.manageFeeRatio || 0) * 100;
          let saleServiceFeeRatio = parseFloat(purchaseRule.saleServiceFeeRatio || 0) * 100;
          let flag_2 = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio > filterObj.zong_he_fei_lv * 100;
          if (flag_2) {
            info.err_data.feilv.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `综合费率超过${filterObj.zong_he_fei_lv}%`,
            });
            return null;
          }

          // 买入费率超过1条规则
          if ((purchaseRule.purchaseFeeRatio || []).length > 1) {
            info.err_data.feilv.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: '买入费率超过1条规则',
            });
            return null;
          }

          // 卖出费率超过3条规则
          const redeemRule = datas.redeemRule || {};
          const redeemFeeRatio = redeemRule.redeemFeeRatio || [];
          if (redeemFeeRatio.length > filterObj.mai_chu_gui_ze) {
            info.err_data.feilv.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `卖出费率超过${filterObj.mai_chu_gui_ze}条规则`,
            });
            return null;
          }

          // 开放赎回
          const redeemStatus = redeemRule.redeemStatus || '';
          if (redeemStatus !== '开放赎回') {
            info.err_data.feilv.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: '不开放赎回',
            });
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
            info.err_data.hui_che.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `修复天数大于${filterObj.xiu_fu_tian_shu}天`,
            });
            return null;
          }

          // 最大回撤高于30%
          const maxRetracementValue = datas.maxRetracementValue || 0;
          if (maxRetracementValue < filterObj.zui_da_hui_che) {
            info.err_data.hui_che.push({
              fund_code: item.fund_code,
              fund_name: item.fund_name,
              reason: `最大回撤低于${filterObj.zui_da_hui_che}%`,
            });
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

// 特色数据
async function bodongFn() {
  info.err_data.tese = [];
  const promises = info.filter_data.map((item, index) => {
    return limit(async () => {
      // 进度
      let progress = Math.floor((index + 1) / info.filter_data.length * 100);
      console.log(`第 ${index + 1} 个  进度: ${progress}% ${item.fund_code}-${item.fund_name} 的特色数据...`);
      try {
        let datas = await getFundFeatureData(item.fund_code) || [];
        let isEmpty = (datas[0] || { isEmpty: true }).isEmpty;
        if (!isEmpty) {

          return item;
        } else {
          info.err_data.tese.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: '数据为空',
          });
          console.log(`${item.fund_code}-${item.fund_name}  数据为空`);
          return item;
        }
      } catch (err) {
        info.err_data.tese.push({
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
  console.log(`符合特色数据的有 ${info.filter_data.length} 个`);
}

// 综合诊断
async function zhenduanFn() {
  info.err_data.zhenduan = [];
  const promises = info.filter_data.map((item, index) => {
    return limit(async () => {
      // 进度
      let progress = Math.floor((index + 1) / info.filter_data.length * 100);
      console.log(`第 ${index + 1} 个  进度: ${progress}% ${item.fund_code}-${item.fund_name} 的综合诊断...`);
      try {
        let datas = await getFundDiagnosisPageInfo(item.itemId) || {};

        // 波动率
        let returnSd = datas.returnSd || {};
        let boDongVal = Number(returnSd.value || 0);
        if (boDongVal > filterObj.volatility) {
          info.err_data.zhenduan.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: `波动率高于${filterObj.volatility}%`,
          });
          return null;
        }
        // 夏普比率
        let sharpRatio = datas.sharpRatio || {};
        let sharpVal = Number(sharpRatio.value || 0);
        if (sharpVal < filterObj.sharp_ratio) {
          info.err_data.zhenduan.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: `夏普比率低于${filterObj.sharp_ratio}`,
          });
          return null;
        }
        // 卡玛比率
        let calmarRatioMap = datas.calmarRatioMap || {};
        let calmarVal = Number(calmarRatioMap.value || 0);
        if (calmarVal < filterObj.calmar_ratio) {
          info.err_data.zhenduan.push({
            fund_code: item.fund_code,
            fund_name: item.fund_name,
            reason: `卡玛比率低于${filterObj.calmar_ratio}`,
          });
          return null;
        }

        return item;
      } catch (err) {
        info.err_data.zhenduan.push({
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
  console.log(`符合综合诊断的有 ${info.filter_data.length} 个`);
}

async function main() {
  const startTime = Date.now();
  try {
    info.filter_data = [
      { fund_code: '016858', fund_name: '国金量化多因子股票C', reason: '保持' },
      { fund_code: '025416', fund_name: '新华优选分红混合C', reason: '保持' },
      { fund_code: '002233', fund_name: '工银丰收回报灵活配置混合C', reason: '保持' },
      { fund_code: '020726', fund_name: '建信灵活配置混合C', reason: '新增' },
      { fund_code: '018561', fund_name: '中信保诚多策略混合(LOF)C', reason: '新增' },
      { fund_code: '014521', fund_name: '诺安利鑫灵活配置混合C', reason: '新增' },
      // -------------------------
      { fund_code: '021991', fund_name: '中加专精特新量化选股混合C', reason: "2026年02月27日13:29:53 波动率高于20%" },
      { fund_code: '022004', fund_name: '博道大盘成长股票C', reason: '2026年02月27日13:29:31 排名靠后' },
      // -------------------------
      { fund_code: "015881", fund_name: "中欧小盘成长混合C", reason: '2026年02月27日13:33:02 不可定投' },
      { fund_code: "002943", fund_name: "广发多因子混合", reason: "前十仓位超过40%" },
      { fund_code: "003595", fund_name: "长盛盛崇灵活配置混合C", reason: "规模不到一亿" },
      { fund_code: "022270", fund_name: "中信保诚周期优选混合C", reason: "前十仓位超过40%" },
      { fund_code: "011068", fund_name: "华宝资源优选混合C", reason: "前十仓位超过40%" },
      { fund_code: "002872", fund_name: "华夏智胜价值成长股票C", reason: "近1月收益小于1.6667%" },
      { fund_code: '018147', fund_name: '建信新兴市场混合(QDII)C', reason: '2026年02月27日13:30:21 前十仓位超过40%' },
    ]

    // 京东金融基本信息
    await jingdongBaseInfo();

    // 买卖费率
    await filterBuyAndSellFee();

    // fs.writeFileSync('./data/filter_keywords.json', JSON.stringify(info.filter_data, null, 2));
    // return false;

    // 天天基金预测涨幅
    await getPredictedRise();

    // 回撤修复
    await filterWithdrawalRecovery();

    // 综合诊断
    await zhenduanFn();


    // fs.writeFileSync('./data/filter_keywords.json', JSON.stringify(info.filter_data, null, 2));
    // return false;

    // 写入筛选后的数据
    info.filter_data.forEach(item => {
      delete item.itemId;
    });
    // 按照rate_y_1 排序
    info.filter_data.sort((a, b) => b.rate_y_1 - a.rate_y_1);
    fs.writeFileSync('./data/filter.json', JSON.stringify(info.filter_data, null, 2));
    // 写入错误数据
    fs.writeFileSync('./data/error_arr.json', JSON.stringify(info.err_data, null, 2));
    if (info.err_data.baseinfo.length > 0) {
      console.log('基础信息错误数据长度:', info.err_data.baseinfo.length);
    }
    if (info.err_data.feilv.length > 0) {
      console.log('费率不满足:', info.err_data.feilv.length);
    }
    if (info.err_data.zhang_fu.length > 0) {
      console.log('预测涨幅读取不到:', info.err_data.zhang_fu.length);
    }
    if (info.err_data.hui_che.length > 0) {
      console.log('回撤不满足:', info.err_data.hui_che.length);
    }
    if (info.err_data.zhenduan.length > 0) {
      console.log('综合诊断 不满足:', info.err_data.zhenduan.length);
    }
    if (info.err_data.not_meet_condition.length > 0) {
      console.log('不符合条件错误数据长度:', info.err_data.not_meet_condition.length);
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
