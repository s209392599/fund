const fetch = require('node-fetch');

// 详情
var code = '400030';
// var code = '007220';
let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;
fetch(u, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
  },
  "body": `reqData={"fundCode":"${code}","pageChannel":"detail","channel":"9"}`,
  "method": "POST",
})
  .then(res => res.json())
  .then(res => {
    var resultData = res.resultData || {};
    var datas = resultData.datas || {};
    console.log(`a001.js 71 [datas]`, datas);
    // console.log(`a001.js 71 [datas]`, datas.purchaseRule.purchaseProcess);
  }).catch(err => {
    console.log(`a001.js 73 [err]`, err);
  })
