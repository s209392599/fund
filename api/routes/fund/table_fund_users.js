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


//

// 获取所有用户
router.post('/fund_get_all_user_info', async (req, res) => {
  let query_str = 'SELECT * FROM fund_users LIMIT 1000';
  let values = [];
  if (req.body.search_name) {
    query_str = 'SELECT * FROM fund_users WHERE user_name LIKE ? OR zh_name LIKE ? LIMIT 1000';
    values.push(`%${req.body.search_name.trim()}%`, `%${req.body.search_name.trim()}%`);
  }
  return DatabasePostQuery({
    res: res,
    query: query_str,
    values: values,
    format: results => results,
  });
});


/**
 {
  "email": "378604984@qq.com",
  "name": "吴伟结",
  "update_time": "2026-01-07 07:00:41",
  "password": "111666",
  "fund": [],
  "user_status": "",
  "remark": "周公子的律师朋友"
}
 */
// 新增用户
router.post('/fund_add_user_info', (req, res) => {
  let { form = {} } = req.body;
  if (!form.email) {
    res.send({
      code: 400,
      msg: '请传入邮箱',
      data: [],
    });
    return;
  }
  if (!form.name) {
    res.send({
      code: 400,
      msg: '请传入用户名',
      data: [],
    });
    return;
  }
  if (!form.password) {
    res.send({
      code: 400,
      msg: '请传入密码',
      data: [],
    });
    return;
  }
  form.fund_count = form.fund_count || 30;


  let USER_JSON = {};
  const userData = USER_JSON.data || [];
  const user = userData.find((item) => item.email === form.email);
  if (!user) {
    USER_JSON.data.push(form);
    const result = updateUserJson(USER_JSON);
    console.log('result', result);
    if (result) {
      res.send({
        code: 200,
        msg: '新增成功',
        data: [],
      });
    } else {
      res.send({
        code: 400,
        msg: '新增失败',
        data: [],
      });
    }
  } else {
    res.send({
      code: 400,
      msg: '用户已存在',
      data: [],
    });
  }
});

// 修改某个用户信息
router.post('/fund_update_user_info', (req, res) => {
  const { form = {} } = req.body;
  let USER_JSON = {};

  const userData = USER_JSON.data || [];
  const dIndex = userData.findIndex((item) => item.email === form.email);
  if (dIndex === -1) {
    res.send({
      code: 400,
      msg: '用户不存在',
      data: [],
    });
  } else {
    userData[dIndex] = form;
    const result = updateUserJson(USER_JSON);
    console.log('result', result);
    if (result) {
      res.send({
        code: 200,
        msg: '操作成功',
        data: [],
      });
    } else {
      res.send({
        code: 400,
        msg: '操作失败',
        data: [],
      });
    }
  }
});

// 删除某个用户
router.post('/fund_del_user_info', (req, res) => {
  const { email = '' } = req.body;
  if (!email) {
    return res.send({
      code: 400,
      msg: '请传入邮箱',
      data: [],
    });
  }
  let USER_JSON = {};
  const userData = USER_JSON.data || [];
  const user = userData.find((item) => item.email === email);
  if (!user) {
    return res.send({
      code: 400,
      msg: '未获取到用户数据',
      data: [],
    });
  } else {
    USER_JSON.data = userData.filter((v) => v.email != email);
    const result = updateUserJson(USER_JSON);
    if (result) {
      res.send({
        code: 200,
        msg: '删除成功',
        data: user,
      });
    } else {
      return res.send({
        code: 400,
        msg: '删除失败',
        data: [],
      });
    }
  }
});

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
