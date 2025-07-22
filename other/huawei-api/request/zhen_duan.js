/* 基金诊断 */
const fetch = require('node-fetch');

/*
https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDiagnosisPageInfo?reqData={"skuId":"106045"}  可以直接在浏览器地址栏打开
*/
var skuId = '106545';
const u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDiagnosisPageInfo`;

fetch(u, {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: `reqData={"skuId":"${skuId}"}`,
  method: 'POST',
})
  .then((res) => res.json())
  .then((data) => {
    console.log('success', data.resultData.datas);
  })
  .catch((err) => {
    console.log('error', err);
  });
