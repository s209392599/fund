// 涨跌天数、涨的比率；最高一点涨多少，最高一天跌多少？连涨连跌天数；分红也算上？
const fetch = require('node-fetch');

const { yimai, guancha, fangqi } = require('./data.js');

var fund_data = [...yimai];
let day_jiaoyi = 0; // 交易天数

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
  obj.totalDays = 0; // 交易天数
  obj.totalGetValue = 0; // 累计收益
  obj.increaseDays = 0; // 涨的天数
  obj.increaseRate = 0; // 涨的比率
  obj.highestIncrease = 0; // 最高一天涨多少
  obj.highestDecrease = 0; // 最高一天跌多少
  obj.continuousIncreaseDays = 0; // 连涨天数
  obj.continuousDecreaseDays = 0; // 连跌天数
  // obj.dividend = 0;// 分红

  const cur_year = new Date().getFullYear() - 1;
  let cur_month = new Date().getMonth() + 1;
  cur_month = cur_month < 10 ? `0${cur_month}` : cur_month;
  let cur_day = new Date().getDate();
  if (cur_day < 10) cur_day = `0${cur_day}`;
  const cur_date = `${cur_year}-${cur_month}-${cur_day}`;
  const stamp_prev_year = new Date(cur_date).getTime();

  const daysArr = arr.reverse();

  let count_zhang = 0;
  let count_die = 0;
  daysArr.forEach((item, index) => {
    const stamp_cur_date = new Date(item.date).getTime();
    if (stamp_cur_date > stamp_prev_year) {
      obj.totalDays += 1; // 交易天数
      // 向下入正
      const cur_totalNetValue = Math.floor(item.totalNetValue * 10000);
      const prev_totalNetValue = Math.floor(
        arr[index - 1].totalNetValue * 10000
      );
      // 计算差值
      const increase = cur_totalNetValue - prev_totalNetValue;
      obj.totalGetValue += Math.ceil(increase); // 累计收益
      if (increase > 0) {
        obj.increaseDays += 1; // 涨的天数
        count_die = 0;
        count_zhang++;
        obj.continuousIncreaseDays = Math.max(
          obj.continuousIncreaseDays,
          count_zhang
        );
        obj.highestIncrease = Math.max(obj.highestIncrease, increase);
      } else {
        count_zhang = 0;
        count_die++;
        obj.continuousDecreaseDays = Math.max(
          obj.continuousDecreaseDays,
          count_die
        );
        obj.highestDecrease = Math.min(obj.highestDecrease, increase);
      }
    }
  });
  day_jiaoyi = obj.totalDays;
  // 涨的天数的比率
  obj.increaseRate =
    ((obj.increaseDays / obj.totalDays) * 100).toFixed(2) + '%';
  return obj;
}

var IncreaseArr = [];
// Number((Number("-0.07") * 100).toFixed(0))

async function fetchFundData() {
  for (let i = 0; i < fund_data.length; i++) {
    let arr = await getFund(fund_data[i].number, i);
    let obj = getInfoObj(arr);
    IncreaseArr.push({
      代号: fund_data[i].number,
      名称: fund_data[i].name,
      // 交易天数: obj.totalDays,
      累计收益: obj.totalGetValue,
      涨的天数: obj.increaseDays,
      涨的天数比率: obj.increaseRate,
      跌的天数: day_jiaoyi - obj.increaseDays,
      最高一天收益: obj.highestIncrease,
      最高一天下跌: obj.highestDecrease,
      连涨天数: obj.continuousIncreaseDays,
      连跌天数: obj.continuousDecreaseDays,
    });
  }
}

fetchFundData().then(() => {
  const count = IncreaseArr.reduce(
    (pre, cur) => pre + Number(cur['累计收益']),
    0
  );
  const average = (count / day_jiaoyi).toFixed(2);
  console.log(
    `交易天数：${day_jiaoyi}，累计收益：${count}, 平均收益：${average}元`
  );
  console.table(IncreaseArr);
});
