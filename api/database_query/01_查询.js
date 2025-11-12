const { pool } = require('../setting/pool.js');// 引入mysql连接池
const fs = require('fs');

let retryCount = 0;
async function queryData(){
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    // var query = 'SELECT fund_code, fund_name, no_keyword FROM fund_all'; // 只查询这几个字段
    // var query = 'SELECT * FROM fund_public'; // 只查询这几个字段

    // const [results] = await Promise.race([
    //   connection.query(query),
    //   new Promise((_, reject) =>
    //     setTimeout(() => reject(new Error('数据库查询超时')), 15 * 1000)
    //   ), // 查询超时时间（毫秒）
    // ]);
    // const filePath = './data/01_query.json';// 写入文件位置
    // const fileContent = JSON.stringify(results, null, 2);
    // fs.writeFileSync(filePath, fileContent, 'utf8');
  } catch (error) {
    if (error.code === 'ECONNRESET' && retryCount < 3) {
      console.log('连接已重置，重试中...');
      retryCount++;
      return await queryData(retryCount); // 递归重试
    }
    console.error('数据库操作失败:', error.message);
  } finally {
    if (connection) connection.release(); // 确保释放连接
  }
}
queryData();
