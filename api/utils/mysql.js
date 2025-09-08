// 安装mysql2包：npm install mysql2
const mysql = require('mysql2/promise');

const { exec } = require('child_process');
exec('ping 150.158.175.108', (error, stdout, stderr) => {
  if (error) {
    console.error('无法连接到服务器:', error.message);
    return;
  }
  console.log('服务器已连接');
});

// 测试连接
async function testConnection() {
  const pool = mysql.createPool({
  host: '150.158.175.108',
  user: 'boxue',
  password: 'qaz123..',
  database: 'fund',
  port: 3306,
  connectTimeout: 20000, // 增加到20秒
  acquireTimeout: 20000, // 增加到20秒
  queueLimit: 10 // 限制排队连接数
});


  try {
    const conn = await pool.getConnection();
    console.log('数据库连接成功');
    conn.release();
  } catch (err) {
    // console.error('连接失败:', err.message);
     console.error('连接失败:', err);
  console.error('错误详情:');
  console.error('- 错误码:', err.code);
  console.error('- 错误号:', err.errno);
  console.error('- SQL状态:', err.sqlState);
  console.error('- 错误信息:', err.message);
  } finally {
    await pool.end();
  }
}
testConnection();



/*
mysql -u root -p  登录数据库
SHOW DATABASES;   查看有哪些数据库
mysqlshow -u root -p fund  查看fund数据库有哪些表
CREATE DATABASE fund;  创建数据库
USE fund;  使用数据库
SHOW TABLES;  查看有哪些表
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255));  创建表
DESCRIBE users;  查看表结构
INSERT INTO users (name, email) VALUES ('John', '<EMAIL>'), ('Jane', '<EMAIL>');  插入数据
SELECT * FROM users;  查询数据
UPDATE users SET email = '<EMAIL>' WHERE id = 1;  更新数据
DELETE FROM users WHERE id = 2;  删除数据
DROP TABLE users;  删除表
DROP DATABASE fund;  删除数据库

 
*/



// 数据库配置
const dbConfig = {
  host: '150.158.175.108',
  user: 'root',
  password: 'qaz123..',
  database: 'fund',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


// 创建连接池
const pool = mysql.createPool(dbConfig);

// 查询示例
async function queryExample() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [1]);
    console.log(rows);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    if (connection) connection.release();
  }
}

// 事务处理示例
async function transactionExample() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    await conn.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [100, 1]);
    await conn.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [100, 2]);
    
    await conn.commit();
    console.log('Transaction completed');
  } catch (err) {
    await conn.rollback();
    console.error('Transaction failed:', err);
  } finally {
    conn.release();
  }
}

// 使用示例
// queryExample();
// transactionExample();
