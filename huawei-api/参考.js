/* 
var getRawBody = require('raw-body');
const fetch = require("node-fetch");
var getFormBody = require('body/form');
var body = require('body');



*/

/* 
POST 请求的 body 数据通常可以通过 event 参数直接访问

exports.handler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body); // 解析请求体
    const name = requestBody.name; // 获取 name 参数
    const age = requestBody.age; // 获取 age 参数

    return {
      statusCode: 200,
      body: JSON.stringify({ name, age }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'error' }),
    };
  }
};
*/

/* 
URL 拼接的查询
exports.handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters; // 获取查询参数
    const name = queryParams.name; // 获取 name 参数
    const age = queryParams.age; // 获取 age 参数

    return {
      statusCode: 200,
      body: JSON.stringify({ name, age }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'error' }),
    };
  }
};
*/

/* 
兼容两种查询参数的写法
exports.handler = async (event, context) => {
  try {
    let requestData;
    
    // 判断请求方式
    if (event.httpMethod === 'POST') {
      // 解析 POST 请求 body
      requestData = JSON.parse(event.body); 
    } else {
      // 获取 GET 请求查询参数
      requestData = event.queryStringParameters;
    }
    
    // 从请求数据中获取参数
    const name = requestData.name;
    const age = requestData.age;

    return {
      statusCode: 200,
      body: JSON.stringify({ name, age }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'error' }),
    };
  }
};
*/

/* 
处理 GET 请求参数
对于 GET 请求，参数通常通过 URL 的查询字符串传递。可以使用 Node.js 的 url 模块来解析这些参数。以下是一个示例：

const url = require('url');

exports.main = async (event, context) => {
    const { path, queryString } = event; // 获取请求路径和查询字符串
    const parsedUrl = url.parse(path + '?' + queryString, true); // 解析 URL
    const param1 = parsedUrl.query.param1; // 获取 GET 请求中的 param1 参数

    return {
        statusCode: 200,
        body: `Received GET request with param1: ${param1}`,
    };
};
*/

/* 
处理 POST 请求参数
对于 POST 请求，数据通常在请求体中传递。在华为云函数中，可以通过 event.body 获取请求体，并根据 Content-Type 进行解析。以下是处理 JSON 和表单数据的示例：
处理 JSON 数据

exports.main = async (event, context) => {
    const body = JSON.parse(event.body); // 解析 JSON 格式的请求体
    const param1 = body.param1; // 获取 POST 请求中的 param1 参数

    return {
        statusCode: 200,
        body: `Received POST request with param1: ${param1}`,
    };
};
*/

/* 
处理 URL 编码的数据
如果 POST 请求的数据是以表单格式发送的（application/x-www-form-urlencoded），可以使用 querystring 模块来解析：

const querystring = require('querystring');

exports.main = async (event, context) => {
    const body = querystring.parse(event.body); // 解析表单格式的请求体
    const param1 = body.param1; // 获取 POST 请求中的 param1 参数

    return {
        statusCode: 200,
        body: `Received POST request with param1: ${param1}`,
    };
};
*/
