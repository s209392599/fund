const fetch = require('node-fetch');

var code = '400030';
let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;
// https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"400030","orderLimit":"","channel":"9"}
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
    // if (res.resultData.code === '0000') {
    //   const datas = res.resultData.datas;
    //   console.log(`a001.js 67 [res]`, datas);
    // }
    console.log(`a001.js 71 [datas]`, res);
  })
  .catch((err) => {
    console.log(`a001.js 73 [err]`, err);
  });
