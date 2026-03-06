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

// 查询用户基金
router.post('/fund_table_query_by_user', async (req, res) => {
  let { user_id = '' } = req.body;
  user_id = parseFloat(user_id);
  DatabasePostQuery({
    res: res,
    query: `SELECT fund_list FROM fund_users WHERE id = ${user_id}`,
    // format: (results) => results,
    format: (results) => {
      let res = results?.[0]?.fund_list || '[]';
      return JSON.parse(res);
    }
  });
});

// 保存用户基金
router.post('/fund_table_users_save_fundlist', async (req, res) => {
  const { user_id = '', fund_list = '' } = req.body;
  if (!user_id) {
    res.send({
      code: 400,
      msg: '未传入用户ID',
      data: [],
    });
    return;
  }

  var query = `UPDATE fund_users SET fund_list = ? WHERE id = ?`;
  DatabasePostQuery({
    res: res,
    query: query,
    values: [fund_list, user_id],
    format: (results) => {
      if (results.affectedRows > 0) {
        return {
          code: 200,
          msg: '保存成功',
          data: []
        };
      } else {
        return {
          code: 500,
          msg: '保存失败或未找到用户',
          data: []
        };
      }
    },
  });
});

// 修改用户基金
router.post('/fund_table_users_update_fundlist', async (req, res) => {
  const { user_id = '', fund_list = [] } = req.body;
  if (!user_id) {
    res.send({
      code: 400,
      msg: '未传入用户ID',
      data: [],
    });
    return;
  }

  const fundListStr = fund_list.join(',');
  var query = `UPDATE fund_users SET fundlist = ? WHERE id = ?`;
  DatabasePostQuery({
    res: res,
    query: query,
    values: [fundListStr, user_id],
    format: (results) => {
      if (results.affectedRows > 0) {
        return {
          code: 200,
          msg: '更新成功',
          data: []
        };
      } else {
        return {
          code: 500,
          msg: '更新失败或未找到用户',
          data: []
        };
      }
    },
  });
});

module.exports = router;
