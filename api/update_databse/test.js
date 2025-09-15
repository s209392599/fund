const mysql = require('mysql2/promise');
const noText = require('../utils/noText.js'); // 排除的关键词
const noFundCode = require('../utils/noFundCode.js'); // 排除的基金代码

const {
  database_host,
  database_user,
  database_password,
} = require('../setting/database.js');

const dbConfig = {
  host: database_host,
  user: database_user,
  password: database_password,
  database: 'fund',
  waitForConnections: true,
  connectionLimit: 20, // 增加连接池大小
  queueLimit: 0,
  connectTimeout: 20000, // 增加连接超时时间
};

const pool = mysql.createPool(dbConfig);

async function queryDatabaseWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('数据库连接成功！');

      // fund_code fund_name fund_type_name include_keyword is_fundgz is_sale
      var query = 'SELECT fund_code, include_keyword FROM fund';// 只查询这几个字段
      const [results] = await Promise.race([
        connection.query(query),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('数据库查询超时')), 30 * 1000) // 增加查询超时时间
        ),
      ]);

      console.log(`数据库中一共有${results.length}个基金`);

      const arr = [];
      results.forEach((item_1, index_1) => {
        const flag_1 = item_1.include_keyword === 'y';
        const flag_2 = item_1.is_fundgz === 'y';
        const flag = flag_1 || flag_2;
        if (!flag) {
          arr.push({
            fund_code: item_1.fund_code,
            fund_name: item_1.fund_name,
          });
        }
      });
      console.log(`一共有${arr.length}个基金需要更新`);
      break; // 成功则退出循环
    } catch (error) {
      console.error(`第 ${i + 1} 次尝试失败:`, error.message);
      if (i === retries - 1) {
        console.error('所有重试都失败了');
      } else {
        await new Promise(res => setTimeout(res, 5000)); // 等待5秒后重试
      }
    } finally {
      if (connection) connection.release();
      if (i === retries - 1) {
        console.log(`操作完毕，退出程序`);
        process.exit(0);
      }
    }
  }
}

queryDatabaseWithRetry();