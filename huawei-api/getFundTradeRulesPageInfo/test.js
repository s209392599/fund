const fetch = require('node-fetch');
let u;
u = `https://775477fdb4134cd5924c62381cf95ed0.apig.cn-east-3.huaweicloudapis.com/getFundTradeRulesPageInfo`;

const params = new URLSearchParams({
  code: '006549',
});
const urlWithParams = `${u}?${params.toString()}`;

fetch(urlWithParams, {
  method: 'get',
})
  .then((res) => res.json())
  .then((res) => {
    console.log(`success`, res);
  })
  .catch((err) => {
    console.log(`[err]`, err);
  });

// fetch(u, {
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     code: '005284',
//   }),
// })
//   .then((res) => res.json())
//   .then((res) => {
//     console.log(`a001.js 71 [datas]`, res);
//   })
//   .catch((error) => console.error('请求失败:', error)); // 错误处理
