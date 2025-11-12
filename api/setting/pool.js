const mysql = require('mysql2/promise');
const {
  database_host,
  database_user,
  database_password,
} = require('./database.js');

const dbConfig = {
  host: database_host,
  user: database_user,
  password: database_password,
  database: 'fund',
  waitForConnections: true,
  connectionLimit: 10,// 最大连接数
  queueLimit: 100, // ⭐ 改为 100，防止无限排队
  connectTimeout: 15 * 1000,// TCP连接超时
  acquireTimeout: 10 * 1000,// 获取连接超时（单位：毫秒）
  idleTimeout: 10000, // ⭐ 空闲连接超时（单位：毫秒）
  enableKeepAlive: true, // ⭐ 启用TCP保活
  acquireTimeoutMillis : 60000,   // 正确字段
  keepAliveInitialDelay: 0, // 立即发送保活探测
  testOnBorrow: true,         // 从连接池获取连接时验证有效性
  queryFormat: function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (match, key) {
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
      }
      return match;
    }.bind(this));
  }
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool: pool
};
