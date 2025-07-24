// 解析查询参数
exports.handler = (event, context, callback) => {
  let requestData = {};
  if (event.httpMethod === 'POST') {
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    requestData = JSON.parse(decodedBody);
  } else if (event.httpMethod === 'GET') {
    requestData = event.queryStringParameters;
  }
};
// 主要针对get请求
exports.handler = (event, context, callback) => {
  const queryParams = event.queryStringParameters || {};
  const codes = queryParams.code ? queryParams.code.split(',') : [];
  const hasZhi = queryParams.zhi === 'true' || queryParams.zhi === '1';
  const zhis = queryParams.zhicode ? queryParams.zhicode.split(',') : [];
};

// 返回json
exports.handler = function (event, context, callback) {
  const error = null;
  const output = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    isBase64Encoded: false,
    body: `{"name": "boxue is 666", "age": 19}`,
  };
  callback(error, output);
};
// 或者直接返回json
exports.handler = async (event, context) => {
  const output = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    isBase64Encoded: false,
    body: JSON.stringify(event),
  };
  return output;
};

// 返回promise
exports.handler = async (event, context) => {
  const output = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    isBase64Encoded: false,
    body: JSON.stringify(event),
  };

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(output);
    }, 2000);
  });
  return promise;
  // anthor way
  // res = await promise;
  // return res
};

// 返回html
exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
    body: html,
    // isBase64Encoded: false
  });
};
