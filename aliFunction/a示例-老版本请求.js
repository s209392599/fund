const fetch = require('node-fetch');

// https://lc.jr.jd.com/finance/fund/latestdetail/buySellInfo/?activeIndex=0&fundCode=007769

// 下面的也可以直接请求 2024年09月19日10:26:42
// https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"400030","pageChannel":"detail","channel":"9"}
exports.handler = (req, resp, context) => {
  console.log('req.queries', req.queries);
  var code = req.queries.code || '400030';
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;
  fetch(u, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: `reqData={"fundCode":"${code}","orderLimit":"","channel":"9"}`,
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log('res',res);
      var resultData = res.resultData || {};
      var datas = resultData.datas || {};
      resp.send(JSON.stringify(datas));
    })
    .catch((err) => {
      resp.send(JSON.stringify('error'));
    });
};
