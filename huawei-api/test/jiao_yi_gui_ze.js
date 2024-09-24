/* 交易规则 */
const fetch = require('node-fetch');
const config = require('./base.js');

fetch(config.baseApi, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'jiao_yi_gui_ze',
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
