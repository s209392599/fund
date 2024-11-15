// 近一年平均每天的收益(未完成 看37行 2024年11月15日12:10:48)
const fetch = require('node-fetch');
const fs = require('fs');
const { yimai, guancha, fangqi } = require('./data.js');

var fund_data = [...yimai];

const cur_year = new Date().getFullYear() - 1;
let cur_month = new Date().getMonth() + 1;
cur_month = cur_month < 10 ? `0${cur_month}` : cur_month;
let cur_day = new Date().getDate();
if (cur_day < 10) cur_day = `0${cur_day}`;
const cur_date = `${cur_year}-${cur_month}-${cur_day}`;
const stamp_prev_year = new Date(cur_date).getTime(); // 前一年的日期

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":400,"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      // "netValue": "单位净值","totalNetValue": "累计净值","dailyProfit": "日涨跌幅"
      return netValueList;
    });
}

// arr:基金的数据
function getInfoObj(arr) {
  let obj = {};
  obj.shouyi = []; // 累计净值

  // 判断今天是星期天，不再写今天，否则从今天开始记录表格数据
  arr.forEach((item, index) => {
    const stamp_cur_date = new Date(item.date).getTime();
    if (stamp_cur_date > stamp_prev_year) {
      const cur_totalNetValue = Number(item.totalNetValue * 10000);
      const pre_totalNetValue = Number(
        daysArr[index - 1].totalNetValue * 10000
      );
      const increase = Number(
        Math.floor(cur_totalNetValue - pre_totalNetValue)
      );
      obj.shouyi.push(increase); // 累计净值
    }
  });
  return obj;
}

var IncreaseArr = [];
// Number((Number("-0.07") * 100).toFixed(0))

async function fetchFundData() {
  for (let i = 0; i < fund_data.length; i++) {
    // for (let i = 0; i < 1; i++) {
    let jingzhi_data = await getFund(fund_data[i].number, i);
    let obj = getInfoObj(jingzhi_data);
    obj.code = fund_data[i].number;
    obj.name = fund_data[i].name;
    IncreaseArr.push(obj);
  }
}

fetchFundData().then(() => {
  let writeData = JSON.stringify(IncreaseArr, null, 2);
  let filePath = 'fund_day_shouyi.json';

  try {
    fs.writeFileSync(filePath, writeData);
    console.log('数据成功写入文件');
  } catch (err) {
    console.error('写入文件时发生错误:', err);
  }
});
