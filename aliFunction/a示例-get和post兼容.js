const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // 根据请求类型处理请求
    if (event.httpMethod === 'GET') {
      // 处理 GET 请求
      const code = event.queryStringParameters
        ? event.queryStringParameters.code
        : '400030';
      const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailPageInfo?reqData={"itemId":"","createOrdermaket":"","fundCode":"${code}","clientVersion":null,"channel":"9"}`;

      const response = await fetch(url, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      const jsonResponse = await response.json();
      const resultData = jsonResponse.resultData || {};
      const datas = resultData.datas || {};
      return {
        statusCode: 200,
        body: JSON.stringify(datas),
      };
    } else if (event.httpMethod === 'POST') {
      // 处理 POST 请求
      let body = '';
      event.stream.forEach((chunk) => {
        body += chunk.toString();
      });

      return new Promise((resolve, reject) => {
        event.stream.on('end', () => {
          try {
            const postData = JSON.parse(body);
            const code = postData.code || '400030';
            const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailPageInfo?reqData={"itemId":"","createOrdermaket":"","fundCode":"${code}","clientVersion":null,"channel":"9"}`;

            fetch(url, {
              headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/x-www-form-urlencoded',
                priority: 'u=1, i',
                'sec-ch-ua':
                  '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
              },
            })
              .then(async (response) => {
                const jsonResponse = await response.json();
                const resultData = jsonResponse.resultData || {};
                const datas = resultData.datas || {};
                resolve({
                  statusCode: 200,
                  body: JSON.stringify(datas),
                });
              })
              .catch((error) => {
                reject({
                  statusCode: 500,
                  body: JSON.stringify('error'),
                });
              });
          } catch (e) {
            reject({
              statusCode: 500,
              body: JSON.stringify('error parsing request body'),
            });
          }
        });
      });
    } else {
      // 不支持的方法
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify('internal server error'),
    };
  }
};
