/*
router.post('/fund_manage_fund_query', async (req, res) => {
  return DatabasePostQuery.apply({ res }, [{
    query: 'SELECT * FROM fund_public ORDER BY sort_order ASC',
    format: (results) => ({
      length: results.length,
      data: results,
    })
  }]);
});
*/
const { pool } = require('../setting/pool.js');
async function executeQuery(query, values = [], timeout = 15000) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await Promise.race([
      connection.query(query, values), // 使用预处理
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), timeout)
      ),
    ]);
    return results;
  } catch (error) {
    console.error('Database query failed:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

function sendResponse(res, code, msg, data = null) {
  return res.send({
    code,
    msg,
    data,
  });
}

/*
next: 是否需要下一步，当服务器需要多个操作时，设置为false
*/
async function DatabasePostQuery({
  res,
  query,
  values = [],
  format,
  timeout = 15000,
  successMsg = '获取成功',
  next = false
}) {
  try {
    const results = await executeQuery(query, values, timeout); // 传递 values
    if(!next){
      const formattedData = format ? format(results) : results;
      sendResponse(res, 200, successMsg, formattedData);
    }else{
      return results;
    }
  } catch (error) {
    console.error('Database update failed:', error.message);
    sendResponse(res, 500, '数据库更新出错');
  }
}

module.exports = { DatabasePostQuery };
