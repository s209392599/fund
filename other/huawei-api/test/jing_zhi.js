/* 累计、单位净值、涨跌幅 */
const fetch = require('node-fetch');
const config = require('./base.js');

fetch(config.baseApi, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'jing_zhi',
    code: '400030',
  }),
})
  .then((res) => res.json())
  .then((res) => {
    console.log(`success`, res);
  })
  .catch((err) => {
    console.log(`[err]`, err);
  });
