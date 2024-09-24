/* 基金建议 */
const fetch = require('node-fetch');
const config = require('./base.js');

fetch(config.baseApi, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'advice',
    code: '005284',
  }),
})
  .then((res) => res.json())
  .then((res) => {
    console.log(`success`, res);
  })
  .catch((err) => {
    console.log(`[err]`, err);
  });
