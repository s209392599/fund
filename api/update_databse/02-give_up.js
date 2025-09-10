/*
放弃一些基金：
  定期开放
*/
const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const {
  database_host,
  database_user,
  database_password,
} = require('../setting/database.js');

const info = {
  server_data_fund: [], // 数据库上fund数据库的文件
  search_data: [], // 天天基金查询的数据
};

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
  acquireTimeout: 10000, // 获取连接超时时间（毫秒）
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

/*
["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
["970212","ZXJTYX12GYCYQZQC","中信建投悠享12个月持有期债券C","债券型-混合一级","ZHONGXINJIANTOUYOUXIANG12GEYUECHIYOUQIZHAIQUANC"]
*/
async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    // 将字符串转换为数组
    const fundArray = JSON.parse(arrayStr);
    info.search_data = fundArray;
    console.log(`一共有${fundArray.length}个基金`);
    queryDatabase();
  } catch (err) {
    console.log('err => ', err);
  }
}
queryResilienceInfo();

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

    info.server_data_fund = results;

    var arr = [];
    info.search_data.forEach((item_1, index_1) => {
      let flag = info.server_data_fund.some(
        (item_2) => item_2.fund_code === item_1[0]
      );
      if (!flag) {
        arr.push({
          fund_code: item_1[0],
          fund_name: item_1[2],
          fund_type_name: item_1[3],
        });
      }
    });
    console.log('需要插入的数据', arr.length);
    if(arr.length){
      await insertFundData(connection, arr);
    }
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  } finally {
    if (connection) connection.release(); // 确保连接被释放
  }
}

// 插入基金数据的函数
async function insertFundData(connection, data) {
  console.log('开始已插入数据~~~');
  const insertQuery = 'INSERT INTO fund (fund_code, fund_name, fund_type_name) VALUES (?, ?, ?)';
  const failedItems = [];

  // 方法1: 逐条插入（适合小数据量）
  for (const item of data) {
    try {
      await connection.query(insertQuery, [item.fund_code, item.fund_name, item.fund_type_name]);
      console.log(`成功插入: ${item.fund_code} - ${item.fund_name}`);
    } catch (error) {
      console.error(`插入失败: ${item.fund_code} - ${item.fund_name}, 原因:`, error.message);
      failedItems.push({ ...item, error: error.message });
    }
  }

  // 方法2: 批量插入（适合大数据量，但需注意性能）
  /*
  try {
    const values = data.map(item => [item.fund_code, item.fund_name, item.fund_type_name]);
    const result = await connection.query(insertQuery, [values]);
    console.log(`批量插入成功: ${result[0].affectedRows} 条记录`);
  } catch (error) {
    console.error('批量插入失败:', error.message);
    // 如果批量插入失败，尝试逐条插入以定位问题
    for (const item of data) {
      try {
        await connection.query(insertQuery, [item.fund_code, item.fund_name, item.fund_type_name]);
        console.log(`成功插入: ${item.fund_code} - ${item.fund_name}`);
      } catch (err) {
        console.error(`插入失败: ${item.fund_code} - ${item.fund_name}, 原因:`, err.message);
        failedItems.push({ ...item, error: err.message });
      }
    }
  }
  */

  // 打印所有失败的记录
  if (failedItems.length > 0) {
    console.error('以下记录插入失败:', JSON.stringify(failedItems, null, 2));
  } else {
    console.log('所有记录插入成功！');
  }
}
