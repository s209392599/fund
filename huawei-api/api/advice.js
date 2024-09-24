/* 基金建议 */
const fetch = require('node-fetch');

exports.handler = async function (requestData) {
  const code = requestData.code || '400030';
  const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/queryFundInfo?reqData={"fundCode":"${code}"}`;

  try {
    const res = await fetch(url, {});
    const data = await res.json();
    return {
      success: true,
      resultData: data.resultData.dates,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
