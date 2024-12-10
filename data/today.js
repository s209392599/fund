// 基金实时涨幅
const fetch = require('node-fetch');

const { yimai, guancha, fangqi } = require('./data.js');

var arr = [...yimai];

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":23,"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // console.log(`today.js 18 [netValueList]`,netValueList);
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      return netValueList || [];
    });
}

var IncreaseArr = [];
// Number((Number("-0.07") * 100).toFixed(0))

async function fetchFundData() {
  const cur_year = new Date().getFullYear();
  let cur_month = new Date().getMonth() + 1;
  cur_month = cur_month < 10 ? `0${cur_month}` : cur_month;
  let cur_day = new Date().getDate();
  if (cur_day < 10) cur_day = `0${cur_day}`;
  const cur_date = `${cur_year}-${cur_month}-${cur_day}`;

  for (let i = 0; i < arr.length; i++) {
    let fund_data_arr = await getFund(arr[i].number, i);

    let obj_1 = fund_data_arr[0];
    let obj_2 = fund_data_arr[fund_data_arr.length - 1];
    // 计算差值
    let total_cha = Math.floor(obj_1.totalNetValue * 10000) - Math.floor(obj_2.totalNetValue * 10000);

    const flag = obj_1.date === cur_date;
    IncreaseArr.push({
      代号: arr[i].number,
      名称: arr[i].name,
      万元收入: flag ? Math.round(Number(obj_1.dailyProfit) * 100) : 0,
      近一月: total_cha,
      // 单位净值: flag ? obj_1.netValue : '',
      // 累计净值: flag ? obj_1.totalNetValue : '',
      日期: flag ? obj_1.date : '',
    });
  }
}

fetchFundData().then(() => {
  const count = IncreaseArr.reduce(
    (pre, cur) => pre + Number(cur['万元收入']),
    0
  );
  console.log('今日累计收益: ' + count + '元');
  console.table(IncreaseArr);
  // console.table(IncreaseArr, { columns: { 万元收入: { align: 'right' } } });// console-table-printer'
});
