const fetch = require('node-fetch');

var code = '400030';
// let u = `https://1799001811503384.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/fund/retracement/?code=${code}`;
let u = `https://:1799001811503384:functions/getFundDetail/?code=${code}`;

fetch(u, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
  },
})
  .then(res => res.json())
  .then(res => {
    console.log(`a001.js 71 [datas]`, res);
  }).catch(err => {
    console.log(`a001.js 73 [err]`, err);
  })
