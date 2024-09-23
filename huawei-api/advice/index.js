const fetch = require('node-fetch');
exports.handler = function (event, context, callback) {
  const error = null;
  let requestData = {};

  if (event.httpMethod === 'POST') {
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    requestData = JSON.parse(decodedBody);
  } else if (event.httpMethod === 'GET') {
    requestData = event.queryStringParameters;
  }

  const code = requestData.name || '400030';
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/queryFundInfo?reqData={"fundCode":"${code}"}`;

  fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let data = res.resultData.dates;
      const output = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
        body: JSON.stringify(data),
      };
      callback(error, output);
    })
    .catch((err) => {
      callback(error, { success: false, message: err.message });
    });
};

/* 基金诊断建议
https://ms.jr.jd.com/gw/generic/jj/h5/m/queryFundInfo?reqData={"fundCode":"005284"} 原始访问地址

https://1799001811503384.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/fund/queryResilienceInfo/?code=005284 调用
{
   advice: "谨慎持有"
    color: "3"
    grade: 2
    idxFundType: "FINANCIAL_TYPE"
    itemCode: "160222"
    itemId: 106770
    itemName: "国泰国证食品饮料行业指数"
    itemTypeName: "指数型"
}

积极持有 color:1 #ff801a
持续观望 color:2
谨慎持有 color:3 #44bf97

混合型
指数型
。。。
*/
