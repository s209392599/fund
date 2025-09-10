/*
天天基金网能否实时读取到涨幅数据
*/
const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const noText = require('../utils/noText.js'); // 排除的关键词
const noFundCode = require('../utils/noFundCode.js'); // 排除的基金代码

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
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    const query = 'SELECT * FROM fund';
    const [results] = await Promise.race([
      connection.query(query),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 10000)
      ), // 查询超时时间（毫秒）
    ]);

    let index = 0;
    let len = results.length;
    while(index < len){
      let item = results[index];
      if(item.include_no_keyword !== 'y'){
        let u = `https://fundgz.1234567.com.cn/js/${item.fund_code}.js`;
        let response = await fetch(u);
        const res = (await response.text()) || {};
        if(res.length < 11 || res.length > 300){
          console.log(`${index} ------------不正常  ${item.fund_code} -- ${item.fund_name} -- ${res.length}`);

          const updateQuery = 'UPDATE fund SET no_sale = ? WHERE fund_code = ?';
          try {
            await connection.query(updateQuery, ['y', results[index].fund_code]);
            console.log(`成功更新: ${results[index].fund_code} - ${results[index].fund_name}`);
          } catch (error) {
            console.error(`更新失败: ${results[index].fund_code}, 原因:`, error.message);
          }
        }else{
          console.log(`${index} 正常 -- ${results[index].fund_code} -- ${results[index].fund_name} -- ${res.length}`);
        }
      }
      index++;
    }
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  } finally {
    console.log(`操作完毕，退出程序`);
    if (connection) connection.release(); // 确保连接被释放
  }
}
queryDatabase();
