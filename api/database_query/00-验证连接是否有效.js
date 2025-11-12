const { pool } = require('../setting/pool.js');// 引入mysql连接池

async function queryData(){
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping(); // 验证连接是否有效
    console.log('数据库连接成功！');
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  } finally {
    if (connection) connection.release(); // 确保释放连接
  }
}
queryData();
