// 基金实时涨幅
const fetch = require("node-fetch");

const { yimai, guancha, fangqi } = require('./data.js');

var arr = [
  ...yimai,
  ...guancha,
];

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":20,"channel":"9"}`;
  return fetch(u, {})
    .then(res => res.json())
    .then(res => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      return netValueList[0] || {};
    });
}

var IncreaseArr = [];

// Number((Number("-0.07") * 100).toFixed(0))


async function fetchFundData() {
  for (let i = 0; i < arr.length; i++) {
    let obj = await getFund(arr[i].number, i);
    IncreaseArr.push({
      "代号": arr[i].number,
      "名称": arr[i].name,
      // "今日涨幅": obj.dailyProfit,
      // "今日涨幅": Number(obj.dailyProfit) * 100,
      // "今日涨幅": Number(Number(obj.dailyProfit).toFixed(2)) * 100,
      "今日涨幅": Math.round(Number(obj.dailyProfit) * 100),
      "单位净值": obj.netValue,
      "累计净值": obj.totalNetValue,
      "日期": obj.date,
    });
  }
}

fetchFundData().then(() => {
  console.table(IncreaseArr);
  // console.table(IncreaseArr, { columns: { '今日涨幅': { align: 'right' } } });
});


// -------------------------------------------------  skuid 开始 ---------
{
  var itemIdArr = [];
  async function getItemid(code, index) {
    console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailPageInfo?reqData={"itemId":"","createOrdermaket":"","fundCode":"${code}","clientVersion":null,"channel":"9"}`;
    return fetch(u, {})
      .then(res => res.json())
      .then(res => {
        let resultData = res.resultData || {};
        let datas = resultData.datas || {};
        let headerOfItem = datas.headerOfItem || [];
        return headerOfItem.itemId || '';
      });
  }

  async function fetchFundData() {
    for (let i = 0; i < arr.length; i++) {
      let itemId = await getItemid(arr[i].number, i);
      itemIdArr.push({
        "代号": arr[i].number,
        "名称": arr[i].name,
        "itemId": itemId,
      });
    }
  }

  // fetchFundData().then(() => {
  //   console.table(itemIdArr);
  // });
}
// -------------------------------------------------  skuid 结束 ---------
