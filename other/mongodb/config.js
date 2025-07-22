const { ServerApiVersion } = require('mongodb');

module.exports = {
  name: 'boxue',// mongodb 账号
  password: 'Boxueis666',// mongodb 密码
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
  uri: "mongodb+srv://boxue:Boxueis666@boxue.lpczq.mongodb.net/?retryWrites=true&w=majority&appName=boxue",
  // uri: "mongodb+srv://boxue:Boxueis666@boxue.lpczq.mongodb.net",
  // key: ''
};
/*
*/
