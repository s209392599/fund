const fetch = require('node-fetch');

exports.main = async (event, context) => {
  console.log('event', event);
  var code = event.queryString.code || '400030';
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;
  try {
    const response = await fetch(u, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `reqData={"fundCode":"${code}","orderLimit":"","channel":"9"}`,
      method: 'POST',
    });
    const res = await response.json();
    var resultData = res.resultData || {};
    var datas = resultData.datas || {};
    return {
      statusCode: 200,
      body: JSON.stringify(datas),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify('error'),
    };
  }
};
