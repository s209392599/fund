// b站推荐
const fetch = require('node-fetch');
const fs = require('fs');
const { yimai, guancha, fangqi } = require('./data.js');

// 过滤掉废除的基金
const eliminate = [
  // { productCode: '014258', name: '' }
];
// 过滤掉不能在京东、支付宝买的
const eliminateBuy = [
  // { productCode: '003384', name: '金鹰添盈纯债债券' }
];
// 过滤掉已经买过的基金
const prevBuy = [
  { productCode: '400030', name: '东方添益债券' },
  { productCode: '485119', name: '工银信用纯债债券A' },
  { productCode: '485019', name: '工银信用纯债债券B' },
];
// 筛选:符合条件的基金列表
let EligibleList = [];
// 筛选:可购买的基金列表
let PurchaseList = [];
// 筛选:定开的基金列表
let FixedList = [];
// 筛选:不可在京东、支付宝购买的基金列表
let AvailableList = [];

// async function queryResilienceInfo() {
//   try {
//     let u = `https://api.bilibili.com/x/web-interface/index/top/rcmd`;

//     let response = await fetch(u);
//     const res = await response.json() || {};
//     console.log(res?.data?.item);
//   } catch (err) {
//     console.log('err => ', err);
//   }
// }
// queryResilienceInfo();

/*
完全屏蔽的基金有
003384 金鹰添盈纯债债券

屏蔽观察区

*/

/*
债券的同类型基金的前200个
https://lc.jr.jd.com/finance/fund/latestdetail/peerFund/?fundCode=400030

{
  "nav": {
    "value": "1.3145",
    "valueColor": "#333333"
  },
  "productCode": "400030",
  "productId": 106545,
  "rate": {
    "value": "6.36%",
    "valueColor": "#EF4034"
  },
  "index": 33,
  "productName": "东方添益债券"
}
*/
async function getPageMutilDataNotLogin(u, reqData) {
  let productList = [];
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/jj/h5/m/getFundSimilarRank`;

    let response = await fetch(u, {
      "body": 'reqData={"fundCode":"400030","secondCategoryCode":"","fundStatus":"0","orderField":"single_year_rate","pageSize":200,"pageNum":1,"channel":"9"}',
      // 006980为基准 2024年09月29日13:59:44
      // "body": 'reqData={"fundCode":"006980","secondCategoryCode":"","fundStatus":"0","orderField":"single_year_rate","pageSize":200,"pageNum":1,"channel":"9"}',
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded",
      },
      "method": "POST",
    });
    const res = await response.json() || {};
    productList = res?.resultData?.productList || [];
  } catch (err) {
    console.log('err => ', err);
  } finally {
    return productList;
  }
}

/*
条件一：年收益情况
*/
async function AnnualIncome(fundCode) {
  let rate = '';
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryPerformancePageInfo`;

    let response = await fetch(u, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
      },
      "referrer": "https://lc.jr.jd.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": 'reqData={"fundCode":"' + fundCode + '","channel":"9"}',
      "method": "POST",
    });
    const res = await response.json() || {};
    performanceList = res?.resultData?.datas?.performanceList || [];
    performanceList.forEach(item => {
      if (item.name === '近1年') {
        rate = item.rate;
      }
    })
  } catch (err) {
    console.log(`年收益--{${fundCode}}--err => `);
  }
  console.log(`年收益--{${fundCode}}--${rate}`);
  return rate;
}

/*
条件二：累计净值：现在>120天>240天>360天，且两个阶段之间要>1%
*/
async function NetValue(fundCode) {
  let netValueList = '';
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo`;

    let response = await fetch(u, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": 'reqData={"fundCode":"' + fundCode + '","pageNum":1,"pageSize":380,"channel":"9"}',
      "method": "POST",
    });
    const res = await response.json() || {};
    netValueList = res?.resultData?.datas?.netValueList || [];
  } catch (err) {
    console.log(`累计净值--{${fundCode}}--err => `);
  }
  return netValueList;
}

// 是否满足综合条件
async function isEligible(arr) {
  if (!arr.length) {
    return false;
  }

  for (let index = 0; index < arr.length; index++) {
    console.log(`正在处理第${index + 1}个基金，已完成的基金数--${EligibleList.length}`);
    if (EligibleList.length >= 15) {
      break;
    }
    const productCode = arr[index].productCode;
    console.log(`正在处理第${index + 1}个基金,${productCode}`);

    // 等待计算年收益
    const rate = await AnnualIncome(productCode);
    console.log('rate', rate)
    if (rate === '' || Number(rate) < 6) {
      return false;
      continue;
    }

    // 等待计算累计净值
    const netValueList = await NetValue(productCode);
    if (netValueList.length >= 300) {
      const nowValue_000 = Number(netValueList[0].totalNetValue) || 0;
      const nowValue_100 = Number(netValueList[99].totalNetValue) || 0;
      const nowValue_200 = Number(netValueList[199].totalNetValue) || 0;
      const nowValue_300 = Number(netValueList[299].totalNetValue) || 0;

      const flag_1 = nowValue_000 > nowValue_100 && (nowValue_000 - nowValue_100) / nowValue_100 > 0.01;
      const flag_2 = nowValue_100 > nowValue_200 && (nowValue_100 - nowValue_200) / nowValue_200 > 0.01;
      const flag_3 = nowValue_200 > nowValue_300 && (nowValue_200 - nowValue_300) / nowValue_300 > 0.01;
      if (flag_1 && flag_2 && flag_3) {
        EligibleList.push(arr[index]);
      }
    }
  }
}

// 开始任务
async function startTask() {
  // 先获取基金列表
  let productList = await getPageMutilDataNotLogin();
  if (!productList.length) {
    console.log('未能正确获取到同类型基金数据');
    return false;
  }

  // 过滤掉废除的基金
  productList = productList.filter(item => {
    return !eliminate.some(e => e.productCode === item.productCode);
  });
  // 过滤掉不能在京东、支付宝买的
  productList = productList.filter(item => {
    return !eliminateBuy.some(e => e.productCode === item.productCode);
  });
  // 过滤掉已经买过的基金
  productList = productList.filter(item => {
    return !prevBuy.some(e => e.productCode === item.productCode);
  });
  console.log(productList.length);
  // 初步过滤后的数组
  filteredList = new Array(productList.length).fill({});
  // 筛选:符合条件的基金列表
  EligibleList = []
  await isEligible(productList);


  var writeArr = EligibleList.map(item => {
    return {
      productCode: item.productCode,
      productId: item.productId,
      productName: item.productName,
      rate: item.rate.value,
    }
  })

  let writeData = JSON.stringify(writeArr, null, 2);
  let filePath = 'fund_filter.json';

  try {
    fs.writeFileSync(filePath, writeData);
    console.log('数据成功写入文件');
  } catch (err) {
    console.error('写入文件时发生错误:', err);
  }
}
startTask();




