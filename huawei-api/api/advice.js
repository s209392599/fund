/*
基金建议

*/

const fetch = require('node-fetch');

exports.handler = async function (requestData) {
  const code = requestData.name || '400030';
  const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/queryFundInfo?reqData={"fundCode":"${code}"}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
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
