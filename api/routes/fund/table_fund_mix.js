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

// 根据关键词返回基金
router.post('/fund_table_mix_query', async (req, res) => {
  const { type_1 = '' } = req.body;
  if (!type_1) {
    res.send({
      code: 400,
      msg: '未传入一级分类',
      data: [],
    });
    return;
  }
  var query = `SELECT * FROM fund_mix WHERE type_1 = :type_1`;
  DatabasePostQuery({
    res: res,
    query: query,
    values: { type_1 }, // 使用对象而不是数组
    format: (results) => results,
  });
});


module.exports = router;
