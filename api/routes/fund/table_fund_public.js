// 服务器上`fund_mix`表的查询
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const { DatabasePostQuery } = require('../../utils/DatabasePostQuery.js'); // post请求数据库查询封装


// 排序-公共的基金数据
router.post('/fund_public_fund_sort', async (req, res) => {
  const { fund_code = [], email = null } = req.body;

  if(email !== '209392599@qq.com') {
    res.send({
      code: 400,
      msg: '权限不足',
      data: [],
    });
  }

  if (fund_code.length === 0) {
    res.send({
      code: 400,
      msg: '基金代码不能为空',
      data: [],
    });
  }

  // 生成索引数组
  const index_arr = fund_code.map((v, i) => i + 1);

  // 构建SQL更新语句
  let query_str = '';
  let values = [];

  // 使用CASE语句批量更新排序值
  query_str = `
    UPDATE fund_public
    SET sort_order = CASE fund_code
      ${fund_code.map((code, index) => `WHEN ? THEN ?`).join(' ')}
      ELSE sort_order
    END
    WHERE fund_code IN (${fund_code.map(() => '?').join(',')})
  `;

  // 构建参数值数组
  values = [];
  fund_code.forEach((code, index) => {
    values.push(code, index_arr[index]); // code作为WHEN条件，index作为THEN值
  });
  fund_code.forEach(code => {
    values.push(code); // WHERE条件的IN子句
  });

  return DatabasePostQuery({
    res: res,
    query: query_str,
    values: values,
    format: results => ({
      affected_rows: results.affectedRows,
      message: '排序更新成功'
    }),
  });
});

module.exports = router;
