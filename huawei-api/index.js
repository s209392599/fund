// index.js
exports.handler = async function (event, context, callback) {
  let requestData = {};

  if (event.httpMethod === 'POST') {
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    requestData = JSON.parse(decodedBody);
  } else if (event.httpMethod === 'GET') {
    requestData = event.queryStringParameters;
  }

  const name = requestData.name;

  if (name) {
    try {
      const apiModule = require(`./api/${name}`);

      if (typeof apiModule.handler === 'function') {
        const response = await apiModule.handler(requestData);
        const output = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        };
        callback(null, output);
      } else {
        callback(null, { statusCode: 404, body: JSON.stringify({ success: false, message: 'API not found' }) });
      }
    } catch (error) {
      callback(null, { statusCode: 500, body: JSON.stringify({ success: false, message: error.message }) });
    }
  } else {
    callback(null, { statusCode: 400, body: JSON.stringify({ success: false, msg: '需要传递接口名称' }) });
  }
};
