const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const { default: pLimit } = require('p-limit');
const limit = pLimit(5); // 设置并发数为5

const filter_data = require('./data/filter.json');

const info  = {
  filter_data: filter_data
}


// 获取买卖费率
async function getFundTradeRulesPageInfo(fund_code) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};

    return datas;
  } catch (err) {
    console.log('error => ', err);
    return null;
  }
}
// 过滤买卖费率
async function filterBuyAndSellFee() {
  const promises = info.filter_data.map((item, index) => {
    return limit(async () => {
      console.log(`第 ${index + 1} 个 ${item.fund_code}-${item.fund_name} 的买卖费率...`);
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
          if((purchaseRule.purchaseFeeRatio || []).length > 1) return null;

          // 卖出费率超过3条规则
          const redeemRule = datas.redeemRule || {};
          const redeemFeeRatio = redeemRule.redeemFeeRatio || [];
          if(redeemFeeRatio.length > 3){
            return null;
          }

          // 开放赎回
          const redeemStatus = redeemRule.redeemStatus || '';
          if (redeemStatus !== '开放赎回') {
            return null;
          }

          return item;
        } else {
          console.log('  无数据');
          return item;
        }
      } catch (err) {
        console.log('err => ', err);
        return item;
      }
    });
  });

  const results = await Promise.all(promises);
  // 过滤掉 null 值，保留有效的基金项
  const new_data = results.filter(result => result !== null);

  info.filter_data = new_data;
  console.log(`符合京东金融能读取买卖费率的基金有 ${info.filter_data.length} 个`);
}


async function main() {
  try {

    // 京东金融基本信息
    await filterBuyAndSellFee();

    fs.writeFileSync('./data/filter_jingdong.json', JSON.stringify(info.filter_data));

  } catch (err) {
    console.log('err => ', err);
  }
}
main();
