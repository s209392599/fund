/* 交易规则 */
const fetch = require('node-fetch');
const code = '400030';
let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;

fetch(u, {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: `reqData={"fundCode":"${code}","orderLimit":"","channel":"9"}`,
  method: 'POST',
})
  .then((res) => res.json())
  .then((res) => {
    let data = res.resultData.datas;
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
