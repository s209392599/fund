// 过滤基金
const fetch = require('node-fetch');
const fs = require('fs');
const { fangqi } = require('./data.js');

let EligibleList = []; // 符合条件的基金列表

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
条件一：年收益情况
https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryPerformancePageInfo?reqData={"fundCode":"400030","channel":"9"}
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
      `正在处理第${index + 1}个基金--${arr[index].productCode
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
        (nowValue_000 - nowValue_100) / nowValue_100 > 0.015;
      const flag_2 =
        nowValue_100 > nowValue_200 &&
        (nowValue_100 - nowValue_200) / nowValue_200 > 0.015;
      const flag_3 =
        nowValue_200 > nowValue_300 &&
        (nowValue_200 - nowValue_300) / nowValue_300 > 0.015;
      if (flag_1 && flag_2 && flag_3) {
        EligibleList.push(arr[index]);

        // 将 JSON 字符串写入文件
        fs.writeFile(`./fundData/${arr[index].productCode}.json`, JSON.stringify(netValueList), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('数据已存入本地');
        });
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

  // 放弃的基金
  productList = productList.filter((item) => {
    return !fangqi.some((e) => e.productCode === item.productCode);
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
