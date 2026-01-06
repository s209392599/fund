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

/* 数据库的一些操作
SELECT * FROM fund_mix ORDER BY mix_id;

-- update_time修改为自动读取当前时间
ALTER TABLE fund_mix 
MODIFY COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 插入一条数据
INSERT INTO fund_mix (
  type_1, 
  type_2, 
  type_3, 
  type_4, 
  mix_data, 
  mix_desc, 
  user_id
) 
VALUES (
  'di_zhi_dao_hang',
  '',
  '', 
  '', 
  '',
  '地址导航', 
  '1'
);

*/


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
  var query = `SELECT * FROM fund_mix WHERE type_1 = ?`;
  DatabasePostQuery({
    res: res,
    query: query,
    values: [type_1], // 修改：将对象格式改为数组格式
    format: (results) => results,
  });
});

router.post('/fund_table_mix_update', async (req, res) => {
  const { type_1 = '', updateFields = {} } = req.body;

  if(!type_1){
    res.send({
      code: 400,
      msg: '未传入一级分类',
      data: [],
    });
    return;
  }
  // updateFields不能是空对象
  if (Object.keys(updateFields).length === 0) {
    res.send({
      code: 400,
      msg: '未传入更新内容',
      data: [],
    });
    return;
  }

  // 构建SET子句和值数组
  const fields = Object.keys(updateFields);
  const values = Object.values(updateFields);
  
  // 创建SET子句 (例如: field1=?, field2=?)
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const query = `UPDATE fund_mix SET ${setClause} WHERE type_1 = ?`;
  
  // 添加type_1到值数组的末尾
  const queryValues = [...values, type_1];
  
  DatabasePostQuery({
    res: res,
    query: query,
    values: queryValues,
    format: (results) => results,
  });
});

module.exports = router;
