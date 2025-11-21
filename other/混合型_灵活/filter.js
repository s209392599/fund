// 过滤基金
const fetch = require('node-fetch');
const fs = require('fs');
const { fangqi } = require('./fuzhu.js');

const endNum = 400; // 筛选多少个后终止
const minRate = 7; // 年收益最低要求

const JSON_DATA = require('./base.json');
const noText = [
  '个月',
  '60天',
  '90天',
  '180天',
  '封闭',
  '定期',
  '定开',
  '年持有', // 1年持有期 三年持有 等
  '60天持有',
  '90天持有',
  '120天持有',
  '180天持有',
  '一年',
  '两年',
  '三年',
  '五年',
  '1年',
  '套利',
  '后端',
  '房地产',
  '滚动',
  '不动产',
  '白银期货',
  '养老',
  'REIT',
  '货币',
  '(后端)',
  '人民币',
  '绝对收益',
  'A/B',
  'A',// 多增加一个，不要A类
];
const arr_1 = JSON_DATA.data || [];
const arr_2 = [];
arr_1.forEach(item => {
  const fund_name = item[1] || '';
  let flag = true;
  noText.forEach(text => {
    if (fund_name.includes(text)) {
      flag = false;
    }
  });
  if (flag) {
    arr_2.push({
      fund_code: item[0],
      fund_name: item[1],
      rate: 0
    });
  }
});
/*
{
    "fund_code": "006030",
    "fund_name": "南方昌元可转债债券A",
    "rate": "39.22%"
  },
*/

let EligibleList = []; // 符合条件的基金列表

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
    console.log(`年收益--{${fundCode}}--err =>`);
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
    let con_str = `正在处理第${index + 1}个基金--${arr[index].fund_code}--已完成的基金数--${EligibleList.length}`;
    console.log(con_str);
    // if (EligibleList.length >= endNum) {
    //   break;
    // }
    const fund_code = arr[index].fund_code;

    // 等待计算年收益
    const rate = await AnnualIncome(fund_code);
    console.log('rate', rate);

    if (rate === '' || Number(rate) < minRate) {
      continue;
    }

    // 等待计算累计净值, 至少要300天
    const netValueList = await NetValue(fund_code);
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
        fs.writeFile(`./fundData/${arr[index].fund_code}.json`, JSON.stringify(netValueList), (err) => {
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
  let productList = [...arr_2];
  if (!productList.length) {
    console.log('未能正确获取到同类型基金数据');
    return false;
  }

  // 放弃的基金
  productList = productList.filter((item) => {
    return !fangqi.some((e) => e.fund_code === item.fund_code);
  });
  // console.log(productList.length);

  // 筛选:符合条件的基金列表
  EligibleList = [];

  await isEligible(productList);
  console.log('符合条件的基金数量', EligibleList.length);

  var writeArr = EligibleList.map((item) => {
    if (item?.rate?.value) {
    } else {
      console.log('获取失败', item);
    }
    return {
      fund_code: item.fund_code,
      fund_name: item.fund_name,
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
