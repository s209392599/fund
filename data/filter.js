// b站推荐
const fetch = require('node-fetch');
const fs = require('fs');
const { yimai, guancha, fangqi } = require('./data.js');

// 过滤掉废除的基金
const eliminate = [
  { productCode: '016951', name: '鹏华丰顺债券' }, // 突然上涨的 2024年11月7日21:45:41
  {
    productCode: '008883',
    productName: '国联安增祺纯债C',
    rate: '38.68%',
  },
  {
    productCode: '017556',
    productName: '招商安凯债券', // 不可购买
    rate: '11.08%',
  },
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
  {
    productCode: '007540',
    productName: '华泰保兴安悦债券A',
    rate: '12.52%',
  },

  {
    productCode: '900018',
    productName: '中信证券增利一年A',
    rate: '9.60%',
  },
  {
    productCode: '007214',
    productName: '国泰惠丰纯债债券A',
    rate: '9.43%',
  },
  {
    productCode: '017045',
    productName: '达诚腾益债券A',
    rate: '9.29%',
  },
  {
    productCode: '004564',
    productName: '北信瑞丰鼎利债券A',
    rate: '9.26%',
  },
  {
    productCode: '016658',
    productName: '兴华安裕利率债A',
    rate: '9.18%',
  },
  {
    productCode: '005193',
    productName: '北信瑞丰鼎利债券C',
    rate: '9.03%',
  },
  {
    productCode: '650001',
    productName: '英大纯债债券A',
    rate: '8.95%',
  },
  {
    productCode: '217024',
    productName: '招商安盈债券A',
    rate: '8.87%',
  },
  {
    productCode: '017046',
    productName: '达诚腾益债券C',
    rate: '8.77%',
  },
  {
    productCode: '016659',
    productName: '兴华安裕利率债C',
    rate: '8.74%',
  },
  {
    productCode: '012233',
    productName: '招商安盈债券C',
    rate: '8.65%',
  },
  {
    productCode: '002569',
    productName: '博时裕弘纯债债券A',
    rate: '8.02%',
  },
  {
    productCode: '000606',
    productName: '天弘优选债券A',
    rate: '7.88%',
  },
  {
    productCode: '006475',
    productName: '国泰嘉睿纯债债券A',
    rate: '7.79%',
  },
];

// 筛选:符合条件的基金列表
let EligibleList = [];
// 筛选:可购买的基金列表
let PurchaseList = [];
// 筛选:定开的基金列表
let FixedList = [];
// 筛选:不可在京东、支付宝购买的基金列表
let AvailableList = [];

/* 获取天天基金 近1年 收益排行榜前300个
https://fund.eastmoney.com/trade/zq.html
*/
async function getPageMutilDataNotLogin() {
  let productList = [];
  try {
    let u = `https://fund.eastmoney.com/data/fundtradenewapi.aspx?ft=zq&sc=1n&st=desc&pi=1&pn=300&cp=&ct=&cd=&ms=&fr=&plevel=&fst=&ftype=&fr1=&fl=0&isab=1`;

    let response = await fetch(u, {
      headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'sec-ch-ua':
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
      },
      referrer: 'https://fund.eastmoney.com/trade/zq.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    const str_1 = (await response.text()) || {};
    const str_2 = str_1.slice(15);
    const str_3 = str_2.slice(0, str_2.length - 1);

    const formattedStr = str_3
      .replace(/(\w+):/g, '"$1":') // 将键用双引号包裹
      .replace(/'/g, '"') // 将单引号替换为双引号
      .replace(/([a-zA-Z_]\w*)\s*:\s*\[/g, '"$1":[') // 确保数组键正确
      .replace(/;/g, ','); // 替换分号为逗号（如果有的话）

    // 解析为对象
    let obj;
    try {
      obj = JSON.parse(formattedStr);
    } catch (error) {
      obj = { datas: [] };
      console.error('JSON解析错误:', error);
    }
    productList = obj.datas.map((v) => {
      const itemArr = v.split('|');

      return {
        productCode: itemArr[0],
        productName: itemArr[1],
        rate: {
          value: (itemArr[10] || 0) + '%',
        },
      };
    });
  } catch (err) {
    console.log('err => ', err);
  } finally {
    return productList;
  }
}

/*
{
    nav: { value: '1.0613', valueColor: '#333333' },
    productCode: '012692',
    productId: 1012692,
    rate: { value: '4.70%', valueColor: '#EF4034' },
    isSelected: false,
    jumpData: {
      jumpType: 2,
      jumpUrl: 'https://lc.jr.jd.com/finance/fund/latestdetail/index/?fundCode=012692&fundUtmSource=1336&fundUtmParam=detail'
    },
    index: 77,
    productName: '博时中债0-3年国开行债券ETF联接A'
  },

*/

/*
条件一：年收益情况
*/
async function AnnualIncome(fundCode) {
  let rate = '';
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryPerformancePageInfo`;

    let response = await fetch(u, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      referrer: 'https://lc.jr.jd.com/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: 'reqData={"fundCode":"' + fundCode + '","channel":"9"}',
      method: 'POST',
    });
    const res = (await response.json()) || {};
    performanceList = res?.resultData?.datas?.performanceList || [];
    performanceList.forEach((item) => {
      if (item.name === '近1年') {
        rate = item.rate;
      }
    });
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
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body:
        'reqData={"fundCode":"' +
        fundCode +
        '","pageNum":1,"pageSize":380,"channel":"9"}',
      method: 'POST',
    });
    const res = (await response.json()) || {};
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
    console.log(
      `正在处理第${index + 1}个基金--${
        arr[index].productCode
      }--已完成的基金数--${EligibleList.length}`
    );
    if (EligibleList.length >= 15) {
      break;
    }
    const productCode = arr[index].productCode;

    // 等待计算年收益
    const rate = await AnnualIncome(productCode);
    console.log('rate', rate);
    if (rate === '' || Number(rate) < 6) {
      return false;
    }

    // 等待计算累计净值
    const netValueList = await NetValue(productCode);
    if (netValueList.length >= 300) {
      const nowValue_000 = Number(netValueList[0].totalNetValue) || 0;
      const nowValue_100 = Number(netValueList[99].totalNetValue) || 0;
      const nowValue_200 = Number(netValueList[199].totalNetValue) || 0;
      const nowValue_300 = Number(netValueList[299].totalNetValue) || 0;

      const flag_1 =
        nowValue_000 > nowValue_100 &&
        (nowValue_000 - nowValue_100) / nowValue_100 > 0.01;
      const flag_2 =
        nowValue_100 > nowValue_200 &&
        (nowValue_100 - nowValue_200) / nowValue_200 > 0.01;
      const flag_3 =
        nowValue_200 > nowValue_300 &&
        (nowValue_200 - nowValue_300) / nowValue_300 > 0.01;
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
  productList = productList.filter((item) => {
    return !eliminate.some((e) => e.productCode === item.productCode);
  });
  // 过滤掉不能在京东、支付宝买的
  productList = productList.filter((item) => {
    return !eliminateBuy.some((e) => e.productCode === item.productCode);
  });
  // 过滤掉已经买过的基金
  productList = productList.filter((item) => {
    return !prevBuy.some((e) => e.productCode === item.productCode);
  });
  console.log(productList.length);
  // 初步过滤后的数组
  filteredList = new Array(productList.length).fill({});
  // 筛选:符合条件的基金列表
  EligibleList = [];

  await isEligible(productList);

  var writeArr = EligibleList.map((item) => {
    if (item?.rate?.value) {
    } else {
      console.log('获取失败', item);
    }
    return {
      productCode: item.productCode,
      productId: item.productId,
      productName: item.productName,
      rate: item?.rate?.value || 0,
    };
  });

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
