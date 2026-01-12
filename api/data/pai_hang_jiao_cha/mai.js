const fetch = require('node-fetch');

// 过滤可买的基金
const info = {
  tableList: [],
};

// 删除基本信息
const getFundDetailPageInfoWithNoPin = async (fund_code) => {
  let flag = false;
  try {
      let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fund_code}","itemId":"","clientVersion":"","channel":"9"}`;
      fetch(u, {})
        .then((data) => data.json())
        .then((data) => {
          let resultData = data.resultData || {};
          let datas = resultData.datas || {};

          if(!datas.isForSale){// 不可买
            throw new Error(`${fund_code} 不是可定投基金`);
          }

          // 删除小于1亿
          if(!(datas.fundProfileOfItem?.fundScale || '').includes('亿元')){
            throw new Error(`${fund_code} 小于1亿`);
          }

          // 删除1-3-6月排名靠后
          const perfObj = datas?.performanceOfItem || {};
          const perfMap = perfObj.historyPerformanceMap || {};
          const perfList = perfMap.historyPerformanceList || [];
          const rank1 = perfList.find(v1 => v1.name === '近1月')?.rank || '';
          const rank3 = perfList.find(v1 => v1.name === '近3月')?.rank || '';
          const rank6 = perfList.find(v1 => v1.name === '近6月')?.rank || '';
          if (!rank1 || !rank3 || !rank6) {
            throw new Error(`${fund_code} 1-3-6月排名靠后`);
          }
          let flag_1 = parseInt(rank1.split('/')[0]) / parseInt(rank1.split('/')[1]) > 0.5;
          let flag_3 = parseInt(rank3.split('/')[0]) / parseInt(rank3.split('/')[1]) > 0.5;
          let flag_6 = parseInt(rank6.split('/')[0]) / parseInt(rank6.split('/')[1]) > 0.5;

          if(flag_1 && flag_3 && flag_6){
            throw new Error(`${fund_code} 1-3-6月排名靠后`);
          }

          flag = true;
        });
    } catch (err) {
    }finally {
    return true;
  }
}

// 买卖费率
const getFundTradeRulesPageInfo = async (fund_code) => {
  let flag = false;
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};

        let purchaseRule = datas.purchaseRule || {};
        let flag_1 = purchaseRule.aipStatus === '可定投';
        if(!flag_1){
          throw new Error(`${fund_code} 不是可定投基金`);
        }

        let depositFeeRatio = parseFloat(purchaseRule.depositFeeRatio || 0) * 100;
        let manageFeeRatio = parseFloat(purchaseRule.manageFeeRatio || 0) * 100;
        let saleServiceFeeRatio = parseFloat(purchaseRule.saleServiceFeeRatio || 0) * 100;
        let flag_2 = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio <= 200;
        if(!flag_2){
          throw new Error(`${fund_code} 买卖费率总和超过2`);
        }

        let purchaseFeeRatio = purchaseRule.purchaseFeeRatio || [];
        let flag_3 = purchaseFeeRatio.length < 2;// 买入规则只有1条
        if(!flag_3){
          throw new Error(`${fund_code} 买入规则超过1条`);
        }

        let redeemRule = datas.redeemRule || {};
        let redeemFeeRatio = redeemRule.redeemFeeRatio || [];
        let flag_4 = redeemFeeRatio.length < 4;// 卖出规则顶多只有3条
        if(flag_4){
          let no_text = ['90', '180', '360', '365', '730', '731'];
          redeemFeeRatio.forEach(v_2 => {
            no_text.forEach(v_3 => {
              if (v_2.divideIntervalDesc.includes(v_3)) {
                flag_4 = false;
              }
            });
          });
        }
        if(!flag_4){
          throw new Error(`${fund_code} 卖出规则超过3条`);
        }

        flag = true;
      });
  } catch (err) {
  }finally {
    return true;
  }
}

const isFundGz = (fund_code) => {
  let flag = false;
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fund_code}.js?rt=${+new Date()}`;
    fetch(u, {})
      .then((data) => data.text())
      .then((data) => {
        if (data.length > 250) {
          flag = false;
        } else {
          flag = true;
        }
      });
  } catch (err) {
  }finally {
    return flag;
  }
}

// 修复数据
const getFundDetailChartPageInfo = async (fund_code) => {
  let flag = false;
  try {
      let base_url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?`;
      let u = `${base_url}reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
      fetch(u, {})
        .then((data) => data.json())
        .then((data) => {
          if (data.success) {
            let resultData = data.resultData || {};
            let datas = resultData.datas || {};
            let chartTitleList = datas.chartTitleList || [];

            chartTitleList.forEach((item) => {
              if(item.name === '最大回撤'){
                f_1 = parseFloat(item.value);
              }else if(item.name === '修复天数'){
                f_2 = parseFloat(item.value);
              }
            });
            if(f_1 < -20 && f_2 < 100){
              flag = true;
            }
          }
        });
    } catch (err) {

    }finally {
      return flag;
    }

}

const filterBuyableFunds = async (funds) => {
  if(funds.length === 0) {
    return [];
  }
  for(let i=0; i<funds.length; i++) {
    let item = funds[i];
    let fund_code = item.fund_code;

    // 获取基本信息，删除不可买、删除小于1亿、删除1-3-6月排名靠后
    let isBuyable = await getFundDetailPageInfoWithNoPin(fund_code);
    if(!isBuyable) {
      continue;
    }

    // 获取买卖费率，删除不可定投、删除卖出限制超过30天、删除综合费率大于2、删除买入费率是多段的
    let isTrade = await getFundTradeRulesPageInfo(fund_code);
    if(!isTrade) {
      continue;
    }

    // 获取修复数据，删除最大回撤超过25%的、删除修复天数超过120天的
    let isFix = await getFundDetailChartPageInfo(fund_code);
    if(!isFix) {
      continue;
    }

    // 获取预测涨幅的，删除没有预测涨幅数据的
    let isGz = await isFundGz(fund_code);
    if(!isGz) {
      continue;
    }

    // 最终通过验证的
    info.tableList.push(item);
  }
  return info.tableList;
};

module.exports = { filterBuyableFunds };
