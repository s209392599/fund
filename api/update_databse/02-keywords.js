/*
放弃一些基金：
  名称里面包含 定期(3个月等)
  货币型- 这种基金类型
*/
const mysql = require('mysql2/promise');
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

    console.log(`数据库中一共有${results.length}个基金`);

    var arr_1 = [];// 包含关键词的基金
    var arr_2 = [];// 不包含关键词的基金
    results.forEach((item_1, index_1) => {
      let flag_1 = noText.some((item_2) => item_1.fund_name.includes(item_2));
      let flag_2 = noFundCode.some((item_2) => item_1.fund_code === item_2);
      let flag = flag_1 || flag_2;
      if (flag) {
        arr_1.push({
          fund_code: item_1.fund_code,
          fund_name: item_1.fund_name,
        });
      } else {
        arr_2.push({
          fund_code: item_1.fund_code,
          fund_name: item_1.fund_name,
        });
      }
    });
    console.log(`一共有${arr_1.length}个基金需要更新`);
    if (arr_1.length) {
      await updateFundData(connection, arr_1,arr_2);
    }
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  } finally {
    console.log(`操作完毕，退出程序`);
    if (connection) connection.release(); // 确保连接被释放
    process.exit(0);
  }
}
queryDatabase();

// 更新数据库的函数
async function updateFundData(connection, arr_1,arr_2) {
  console.log('开始更新服务器数据~~~');
  const updateQuery = 'UPDATE fund SET include_keyword = ? WHERE fund_code = ?';
  const failedItems = [];

  for (const item of arr_1) {
    try {
      await connection.query(updateQuery, ['y', item.fund_code]);
      console.log(`成功更新: ${item.fund_code} - ${item.fund_name}`);
    } catch (error) {
      console.error(`更新失败: ${item.fund_code}, 原因:`, error.message);
      failedItems.push({
        fund_code: item.fund_code,
        error: error.message
      });
    }
  }

  for (const item of arr_2) {
    try {
      await connection.query(updateQuery, ['n', item.fund_code]);
      console.log(`成功更新: ${item.fund_code} - ${item.fund_name}`);
    } catch (error) {
      console.error(`更新失败: ${item.fund_code}, 原因:`, error.message);
      failedItems.push({
        fund_code: item.fund_code,
        error: error.message
      });
    }
  }

  // 输出所有失败的记录
  if (failedItems.length > 0) {
    console.error('以下记录更新失败:', JSON.stringify(failedItems, null, 2));
  } else {
    console.log('所有记录更新成功！');
  }
  process.exit(0);// 0表示正常退出，1表示异常退出
}
