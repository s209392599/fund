const fetch = require('node-fetch');

var code = '400030';
// var code = '007220';
let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailPageInfo`;
const reqData = `reqData={"itemId":"","createOrdermaket":"","fundCode":"${code}","clientVersion":null,"channel":"9"}`;
u += `?${reqData}`;

fetch(u, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
  },
})
  .then(res => res.json())
  .then(res => {
    if (res.resultData.code === '0000') {
      const datas = res.resultData.datas;
      console.log(`a001.js 67 [res]`, datas);
      console.log(`a001.js 67 [res]`, datas.fundNoticeJumpData);
    }
    console.log(`a001.js 71 [datas]`, res);
  }).catch(err => {
    console.log(`a001.js 73 [err]`, err);
  })
