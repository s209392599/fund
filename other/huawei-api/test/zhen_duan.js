/* 基金诊断 */
const fetch = require('node-fetch');
const config = require('./base.js');

fetch(config.baseApi, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'zhen_duan',
    skuId: '106545',
  }),
})
  .then((res) => res.json())
  .then((res) => {
    console.log(`success`, res);
  })
  .catch((err) => {
    console.log(`[err]`, err);
  });
