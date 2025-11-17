// 腾讯服务器mysql的查询
const { pool } = require('../../setting/pool.js'); // 引入mysql连接池
const express = require('express');
const router = express.Router();

// 获取所有正常监听的基金(排除关键词、不可买)
router.post('/fund_mysql_normal_all', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    var query = 'SELECT fund_code, fund_name, no_keyword FROM fund_all'; // 只查询这几个字段

    const [results] = await Promise.race([
      connection.query(query),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 15 * 1000)
      ), // 查询超时时间（毫秒）
    ]);

    console.log(`数据库中一共有${results.length}个基金`);

    return res.send({
      code: 200,
      msg: '获取成功',
      data: {
        length: results.length,
      },
    });
  } catch (error) {
    console.error('数据库操作失败:', error.message);
    return res.send({
      code: 500,
      msg: '数据库查询出错',
    });
  }
});

// 根据 基金号获取基金数据
router.post('/fund_mysql_fundinfo_byfunds', async (req, res) => {
  const { funds = [] } = req.body;
  if (!funds.length) {
    res.send({
      code: 400,
      msg: '请传入基金数据',
      data: [],
    });
    return;
  }

  let connection;
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

var query = `
SELECT
    *
FROM
    fund_all
WHERE
    fund_code IN (?)
    AND no_keyword = 'y'
    AND is_sale = 'y'
`;
    // 使用connection.execute而不是connection.query来确保参数化查询正确执行
    const [results] = await Promise.race([
      connection.execute(query, [funds]),// 使用参数化查询防止SQL注入
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 15 * 1000)
      ), // 查询超时时间（毫秒）
    ]);

    return res.send({
      code: 200,
      msg: '获取成功',
      data: {
        count: results.length,
        data: results,
      },
    });
  } catch (error) {
    console.error('数据库操作失败:', error.message);
    return res.send({
      code: 500,
      msg: '数据库查询出错',
    });
  } finally {
    // 确保连接被释放回连接池
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
