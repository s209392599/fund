/* 基金建议 */
const fetch = require('node-fetch');

const code = '400030';
const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/queryFundInfo?reqData={"fundCode":"${code}"}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log('success', data.resultData.dates);
  })
  .catch((err) => {
    console.log('error', err);
  });
