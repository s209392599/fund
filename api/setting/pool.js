const mysql = require('mysql2/promise');
const {
  database_host,
  database_user,
  database_password,
} = require('./database.js');

// 数据库配置
const dbConfig = {
  host: database_host,
  user: database_user,
  password: database_password,
  database: 'fund',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 15 * 1000, // 连接超时时间（毫秒）
  // debug: true // 开启调试模式
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool: pool
};
