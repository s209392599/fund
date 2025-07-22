/* 累计、单位净值、涨跌幅 */

/* 
京东金融的历史净值
https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2

https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"400030","pageNum":1,"pageSize":2,"channel":"9"}
*/

const fetch = require('node-fetch');

const code = '400030';
const size = 2;
let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":${size},"channel":"9"}`;

fetch(u)
  .then((res) => res.json())
  .then((res) => {
    var resultData = res.resultData || {};
    var datas = resultData.datas || {};
    var netValueList = datas.netValueList || [];
    console.log('success', netValueList);
  })
  .catch((err) => {
    console.log('error', err);
  });

/* 
返回值：
{
  "date": "2024-03-20",
  "netValue": "1.3148",
  "dailyProfit": "0.00",
  "totalNetValue": "1.5428"
}
字段说明：
{
  "netValueRowName": "单位净值",
  "dateRowName": "日期",
  "totalNetValueRowName": "累计净值",
  "dailyRateRowRate": "日涨跌幅"
}


success [
  {
    date: '2024-09-24',
    netValue: '1.3539',
    dailyProfit: '-0.05',
    totalNetValue: '1.5819'
  },
  {
    date: '2024-09-23',
    netValue: '1.3546',
    dailyProfit: '0.00',
    totalNetValue: '1.5826'
  }
]
*/
