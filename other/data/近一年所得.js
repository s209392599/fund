// 基金实时涨幅
const fetch = require('node-fetch');

const { yimai, guancha, fangqi } = require('./data.js');

var arr = [...yimai];

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":260,"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      return netValueList;
    });
}

// 累计净值 2024年11月9日16:42:09 周六
// lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2 来源地址
// https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo
// https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"400030","pageNum":1,"pageSize":260,"channel":"9"}
/* 下面是返回值
{
  "resultCode": 0,
  "resultMsg": "操作成功",
  "resultData": {
    "code": "0000",
    "datas": {
      "titleMap": {
        "netValueRowName": "单位净值",
        "dateRowName": "日期",
        "totalNetValueRowName": "累计净值",
        "dailyRateRowRate": "日涨跌幅"
      },
      "netValueList": [
        {
          "date": "2024-11-08",
          "netValue": "1.3457",
          "dailyProfit": "0.02",
          "totalNetValue": "1.5737"
        },
        {
          "date": "2024-11-07",
          "netValue": "1.3454",
          "dailyProfit": "0.05",
          "totalNetValue": "1.5734"
        },
      ],
    }
  }
}
*/

var IncreaseArr = [];

// Number((Number("-0.07") * 100).toFixed(0))

async function fetchFundData() {
  for (let i = 0; i < arr.length; i++) {
    let obj = await getFund(arr[i].number, i);
    const cur_count = obj.reduce((pre, cur) => {
      return pre + Number(Number(cur.dailyProfit).toFixed(2)) * 100;
    }, 0);

    IncreaseArr.push({
      代号: arr[i].number,
      名称: arr[i].name,
      近一年收益: cur_count, // 累计涨幅
    });
  }
}

fetchFundData().then(() => {
  const count = IncreaseArr.reduce(
    (pre, cur) => pre + Number(cur['近一年收益']),
    0
  );
  const rate_year = (count / arr.length / 10000) * 100;
  const rate_end = rate_year.toFixed(2);
  const day_money = (count / 365).toFixed(2); // 每天收益
  console.log(`近一年累计：${count}元,年化:${rate_end}%，每天:${day_money}元`);
  console.table(IncreaseArr);
});
