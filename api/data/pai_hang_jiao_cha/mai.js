const fetch = require('node-fetch');

const no_hege = [];// 不合格的基金

// 删除基本信息
const getFundDetailPageInfoWithNoPin = async (fund_code, item) => {
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fund_code}","itemId":"","clientVersion":"","channel":"9"}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};

    if (!datas.isForSale) {// 不可买
      no_hege.push({
        ...item,
        reason: '不是可定投基金'
      })
      console.log(`${fund_code} 不是可定投基金`);
      return false;
    }

    // 删除小于1亿
    if (!(datas.fundProfileOfItem?.fundScale || '').includes('亿元')) {
      no_hege.push({
        ...item,
        reason: '小于1亿'
      })
      console.log(`${fund_code} 小于1亿`);
      return false;
    }

    // 删除1-3-6月排名靠后
    const perfObj = datas?.performanceOfItem || {};
    const perfMap = perfObj.historyPerformanceMap || {};
    const perfList = perfMap.historyPerformanceList || [];
    const rank1 = perfList.find(v1 => v1.name === '近1月')?.rank || '';
    const rank3 = perfList.find(v1 => v1.name === '近3月')?.rank || '';
    const rank6 = perfList.find(v1 => v1.name === '近6月')?.rank || '';
    if (!rank1 || !rank3 || !rank6) {
      console.log(`${fund_code} 1-3-6月排名靠后`);
      return false;
    }
    let flag_1 = parseInt(rank1.split('/')[0]) / parseInt(rank1.split('/')[1]) > 0.5;
    let flag_3 = parseInt(rank3.split('/')[0]) / parseInt(rank3.split('/')[1]) > 0.5;
    let flag_6 = parseInt(rank6.split('/')[0]) / parseInt(rank6.split('/')[1]) > 0.5;

    if (flag_1 && flag_3 && flag_6) {
      no_hege.push({
        ...item,
        reason: '1-3-6月排名靠后'
      })
      console.log(`${fund_code} 1-3-6月排名靠后`);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Error in getFundDetailPageInfoWithNoPin for ${fund_code}:`, err);
    return false;
  }
}

// 买卖费率
const getFundTradeRulesPageInfo = async (fund_code, item) => {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};

    let purchaseRule = datas.purchaseRule || {};
    let flag_1 = purchaseRule.aipStatus === '可定投';
    if (!flag_1) {
      no_hege.push({
        ...item,
        reason: '不是可定投基金'
      })
      console.log(`${fund_code} 不是可定投基金`);
      return false;
    }

    let depositFeeRatio = parseFloat(purchaseRule.depositFeeRatio || 0) * 100;
    let manageFeeRatio = parseFloat(purchaseRule.manageFeeRatio || 0) * 100;
    let saleServiceFeeRatio = parseFloat(purchaseRule.saleServiceFeeRatio || 0) * 100;
    let flag_2 = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio <= 200;
    if (!flag_2) {
      no_hege.push({
        ...item,
        reason: '买卖费率总和超过2'
      })
      console.log(`${fund_code} 买卖费率总和超过2`);
      return false;
    }

    let purchaseFeeRatio = purchaseRule.purchaseFeeRatio || [];
    let flag_3 = purchaseFeeRatio.length < 2;// 买入规则只有1条
    if (!flag_3) {
      no_hege.push({
        ...item,
        reason: '买入规则超过1条'
      })
      console.log(`${fund_code} 买入规则超过1条`);
      return false;
    }

    let redeemRule = datas.redeemRule || {};
    let redeemFeeRatio = redeemRule.redeemFeeRatio || [];
    let flag_4 = redeemFeeRatio.length < 4;// 卖出规则顶多只有3条
    if (flag_4) {
      let no_text = ['90', '180', '360', '365', '730', '731'];
      redeemFeeRatio.forEach(v_2 => {
        no_text.forEach(v_3 => {
          if (v_2.divideIntervalDesc.includes(v_3)) {
            flag_4 = false;
          }
        });
      });
    }
    if (!flag_4) {
      no_hege.push({
        ...item,
        reason: '卖出规则超过3条'
      })
      console.log(`${fund_code} 卖出规则超过3条`);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Error in getFundTradeRulesPageInfo for ${fund_code}:`, err);
    return false;
  }
}

const isFundGz = async (fund_code, item) => {
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fund_code}.js?rt=${+new Date()}`;
    const response = await fetch(u);
    const data = await response.text();
    
    if (data.length > 250) {
      no_hege.push({
        ...item,
        reason: '获取基金预测涨幅数据失败，大于250'
      })
      return false;
    } else {
      return true;
    }
  } catch (err) {
    no_hege.push({
      ...item,
      reason: '获取基金预测涨幅数据失败，接口失败'
    })
    console.error(`Error in isFundGz for ${fund_code}:`, err);
    return false;
  }
};

// 修复数据
const getFundDetailChartPageInfo = async (fund_code, item) => {
  try {
    let base_url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?`;
    let u = `${base_url}reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
    const response = await fetch(u);
    const data = await response.json();
    
    if (data.success) {
      let resultData = data.resultData || {};
      let datas = resultData.datas || {};
      let chartTitleList = datas.chartTitleList || [];

      let f_1, f_2;
      chartTitleList.forEach((item) => {
        if (item.name === '最大回撤') {
          f_1 = parseFloat(item.value);
        } else if (item.name === '修复天数') {
          f_2 = parseFloat(item.value);
        }
      });
      
      if (f_1 > -25 && f_2 < 120) {
        return true;
      }else{
        no_hege.push({
          ...item,
          reason: `最大回撤${f_1}%，修复天数${f_2}天`
        })
      }
    }
    
    return false;
  } catch (err) {
    no_hege.push({
      ...item,
      reason: '获取基金修复数据失败'
    })
    console.error(`Error in getFundDetailChartPageInfo for ${fund_code}:`, err);
    return false;
  }
};

const filterBuyableFunds = async (funds) => {
  if (funds.length === 0) {
    return [];
  }
  
  const result = [];
  for (let i = 0; i < funds.length; i++) {
    let item = funds[i];
    let fund_code = item.fund_code;
    console.log(`正在处理第 ${i + 1} 个基金：${fund_code} - ${item.fund_name}`);

    // 获取基本信息，删除不可买、删除小于1亿、删除1-3-6月排名靠后
    let isBuyable = await getFundDetailPageInfoWithNoPin(fund_code,item);
    if (!isBuyable) {
      continue;
    }

    // 获取买卖费率，删除不可定投、删除卖出限制超过30天、删除综合费率大于2、删除买入费率是多段的
    let isTrade = await getFundTradeRulesPageInfo(fund_code,item);
    if (!isTrade) {
      continue;
    }

    // 获取修复数据，删除最大回撤超过25%的、删除修复天数超过120天的
    let isFix = await getFundDetailChartPageInfo(fund_code,item);
    if (!isFix) {
      continue;
    }

    // 获取预测涨幅的，删除没有预测涨幅数据的
    let isGz = await isFundGz(fund_code,item);
    if (!isGz) {
      continue;
    }

    // 最终通过验证的
    result.push(item);
  }
  return {
    result: result,
    no_hege: no_hege,
  };
};

module.exports = { filterBuyableFunds };
