// 涨跌天数、涨的比率；最高一点涨多少，最高一天跌多少？连涨连跌天数；分红也算上？
const fetch = require('node-fetch');

const { yimai, guancha, fangqi } = require('./data.js');

var arr = [...yimai];

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":300,"channel":"9"}`;
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

// arr:基金的数据，
function getInfoObj(arr) {
  let obj = {};
  obj.code = arr[0].number;
  obj.name = arr[0].name;
  obj.increaseDays = 0; // 涨的天数
  obj.increaseRate = 0; // 涨的比率
  obj.highestIncrease = 0; // 最高一天涨多少
  obj.highestDecrease = 0; // 最高一天跌多少
  obj.continuousIncreaseDays = 0; // 连涨天数
  obj.continuousDecreaseDays = 0; // 连跌天数
  // obj.dividend = 0;// 分红

  const cur_year = new Date().getFullYear();
  let cur_month = new Date().getMonth() + 1;
  cur_month = cur_month < 10 ? `0${cur_month}` : cur_month;
  let cur_day = new Date().getDate();
  if (cur_day < 10) cur_day = `0${cur_day}`;
  const cur_date = `${cur_year}-${cur_month}-${cur_day}`;
  const stamp_cur_date = new Date(cur_date).getTime();

  arr.reverse().forEach((item, index) => {
    // {
    //   "date": "2024-11-12",
    //   "netValue": "1.3470",
    //   "dailyProfit": "0.05",
    //   "totalNetValue": "1.5750"
    // },
    const stamp_cur_date = new Date(item.date).getTime();
    if (stamp_cur_date > stamp_cur_date) {
    }
  });

  return obj;
}

var IncreaseArr = [];
// Number((Number("-0.07") * 100).toFixed(0))

async function fetchFundData() {
  for (let i = 0; i < arr.length; i++) {
    let arr = await getFund(arr[i].number, i);
    let obj = getInfoObj(arr);
    IncreaseArr.push({
      代号: arr[i].number,
      名称: arr[i].name,
      涨的天数: obj.increaseDays,
      涨的天数比率: obj.increaseRate,
      最高一天收益: obj.highestIncrease,
      最高一天下跌: obj.highestDecrease,
      连涨天数: obj.continuousIncreaseDays,
      连跌天数: obj.continuousDecreaseDays,
    });
  }
}

fetchFundData().then(() => {
  // const count = IncreaseArr.reduce(
  //   (pre, cur) => pre + Number(cur['万元收入']),
  //   0
  // );
  // console.log('今日累计收益: ' + count + '元');
  console.table(IncreaseArr);
});
