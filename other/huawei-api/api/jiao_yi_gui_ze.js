/* 交易规则 */
const fetch = require('node-fetch');

exports.handler = async function (requestData) {
  const code = requestData.code || '400030';
  const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `reqData={"fundCode":"${code}","orderLimit":"","channel":"9"}`,
      method: 'POST',
    });
    const data = await res.json();
    return {
      success: true,
      resultData: data.resultData.datas,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message, // Corrected from `err` to `error`
    };
  }
};
