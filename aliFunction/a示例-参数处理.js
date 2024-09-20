const fetch = require('node-fetch');
const querystring = require('querystring');
exports.handler = (req, resp, context) => {
  console.log('req.queries', req.queries); // 第一种是get的方法请求
  let code = req.queries.code || '400030';
  let pageSize = req.queries.pageSize || 780;

  console.log('req.headers', req.headers); // header的方法传参
  console.log('req.headers.code', req.headers.code);
  console.log('req.headers.pagesize', req.headers.pagesize);

  console.log('req.body', req.body); // post表单上传(Buffer)
  console.log('req.body.toString()', req.body.toString());
  const bodyString = req.body.toString('utf8');
  const parsedBody = querystring.parse(bodyString);
  console.log(parsedBody);
  console.log(parsedBody.code);
  console.log(parsedBody.pagesize);

  resp.send(JSON.stringify('boxue is 666'));
};
