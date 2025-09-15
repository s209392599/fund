/*
更新某些字段的值
*/
const mysql = require('mysql2/promise');

const {
  database_host,
  database_user,
  database_password,
} = require('../setting/database.js');

// 数据库配置
const dbConfig = {
  host: database_host,
  user: database_user,
  password: database_password,
  database: 'fund',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 连接超时时间（毫秒）
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 获取数据库连接并执行查询的异步函数
async function queryDatabase() {
  let connection;
  let time_start = new Date().getTime();
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    var query =
      'SELECT fund_code, include_keyword, is_fundgz, is_sale FROM fund'; // 只查询这几个字段
    const [results] = await Promise.race([
      connection.query(query),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 10000)
      ), // 查询超时时间（毫秒）
    ]);

    let index = 0;
    let len = results.length;
    while (index < len) {
      let item = results[index];
      const updateFields = {
        include_keyword: item.include_keyword === 'y' ? 'n' : 'y',
        // is_fundgz: item.is_fundgz === 'y' ? 'n' : 'y',
        // is_sale: item.is_sale === 'y' ? 'n' : 'y',
      };

      const updateQuery = 'UPDATE fund SET ? WHERE fund_code = ?';
      try {
        await connection.query(updateQuery, [updateFields, item.fund_code]);
        console.log(`${index} - 成功: ${item.fund_code} - ${item.fund_name}`);
      } catch (error) {
        console.error(
          `！！！！！！！！ ${index} - 失败: ${item.fund_code}, 原因:`,
          error.message
        );
      }
      index++;
    }
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  } finally {
    let time_end = new Date().getTime();
    let time_diff = time_end - time_start;
    let fen = 0;
    let miao = 0;
    if (time_diff > 0) {
      fen = Math.floor(time_diff / 1000 / 60);
      miao = Math.floor((time_diff - fen * 60 * 1000) / 1000);
    }
    console.log(`操作完毕，退出程序, 耗时 ${fen}分 ${秒}秒`);
    if (connection) connection.release(); // 确保连接被释放
  }
}
queryDatabase();
