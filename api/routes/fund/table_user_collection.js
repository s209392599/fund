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

// 查询用户的基金
router.post('/fund_table_query_by_user', async (req, res) => {
  let { fund_user_id } = req.body;
  if (!CustomFn.isValidFundUserId(fund_user_id)) {
    return res.send({
      code: 400,
      msg: '用户id格式错误',
      data: [],
    });
  }
  fund_user_id = parseFloat(fund_user_id);
  DatabasePostQuery({
    res: res,
    query: `SELECT * FROM fund_user_collection WHERE fund_user_id = ${fund_user_id} ORDER BY sort_order ASC`,
    format: (results) => ({
      data: results,
    }),
  });
});


module.exports = router;
