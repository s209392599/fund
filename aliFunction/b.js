const fetch = require('node-fetch');

u = `https://775477fdb4134cd5924c62381cf95ed0.apig.cn-east-3.huaweicloudapis.com/evtest`;

fetch(u)
  .then((res) => res.json())
  .then((res) => {
    console.log(`a001.js 71 [datas]`, res);
  })
  .catch((err) => {
    console.log(`a001.js 73 [err]`, err);
  });
