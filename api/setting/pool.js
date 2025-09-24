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
  connectTimeout: 15 * 1000,
  acquireTimeout: 10 * 1000,
  idleTimeout: 10000, // ⭐ 更清晰的空闲超时名称
  enableKeepAlive: true, // ⭐ 启用保活
  keepAliveInitialDelay: 0,
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool: pool
};
