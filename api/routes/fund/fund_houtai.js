const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const {DatabasePostQuery} = require('../../utils/DatabasePostQuery.js'); // post请求数据库查询封装
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const { pool } = require('../../setting/pool.js'); // 引入mysql连接池

let time_cancel = 0; // 用于服务自动断开

// 后台登录
router.post('/fund_admin_login', (req, res) => {
  const { email = '', password = '' } = req.body;
  if(email === '209392599@qq.com' && password === 'qaz123..' && req.body.erji_password === 'boxue666'){
    res.send({
    code: 200,
    msg: '登录成功',
    data: [],
  });
  }else{
    res.send({
      code: 400,
      msg: '邮箱或密码不对',
      data: [],
    });
  }
});

// 获取所有用户
router.post('/fund_get_all_user_info', (req, res) => {
  const userData = (getUserJson() || {}).data || [];
  return res.send({
    code: 200,
    msg: '获取所用用户成功',
    data: userData,
  });
});

// 新增用户
router.post('/fund_add_user_info', (req, res) => {
  const { form = {} } = req.body;
  let USER_JSON = getUserJson() || {};

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
  let USER_JSON = getUserJson() || {};

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
  let USER_JSON = getUserJson() || {};
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

// 排序-公共的基金数据
router.post('/fund_public_fund_sort', (req, res) => {
  const { index_new,index_old } = req.body;
  const userData = getPublicFundJson() || {};
  const public_fund = userData.public_fund || [];

  const [item] = public_fund.splice(index_old, 1);
  public_fund.splice(index_new, 0, item);

  const result = updateUserJson(userData);
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
});

// 查询-公共的基金数据
router.post('/fund_public_fund_query', async (req, res) => {
  return DatabasePostQuery.apply({ res }, [{
    query: 'SELECT * FROM fund_public ORDER BY sort_order ASC',
    format: (results) => ({
      length: results.length,
      data: results,
    })
  }]);
});

router.post('/fund_public_fund_query111', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT * FROM fund_public ORDER BY sort_order ASC';

    const [results] = await Promise.race([
      connection.query(query),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 15 * 1000)
      ),
    ]);

    return res.send({
      code: 200,
      msg: '获取成功',
      data: {
        length: results.length,
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
    if (connection) {
      connection.release(); // 确保连接被释放回连接池
    }
  }
});

// 新增-公共的基金数据
router.post('/fund_public_fund_add', (req, res) => {
  const { form = {} } = req.body;
  const userData = getPublicFundJson() || {};
  const public_fund = userData.public_fund || [];
  public_fund.push(form);

  const result = updateUserJson(userData);
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
});
// 排序-公共的基金数据
router.post('/fund_public_fund_sort', (req, res) => {
  const { index_new,index_old } = req.body;
  const userData = getPublicFundJson() || {};
  const public_fund = userData.public_fund || [];

  const [item] = public_fund.splice(index_old, 1);
  public_fund.splice(index_new, 0, item);

  const result = updateUserJson(userData);
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
});
// 修改-公共的基金数据
router.post('/fund_public_fund_update', (req, res) => {
  const { form = {} } = req.body;
  const userData = getPublicFundJson() || {};
  const public_fund = userData.public_fund || [];

  const dIndex = public_fund.findIndex((item) => item.code === form.code);
  if (dIndex === -1) {
    res.send({
      code: 400,
      msg: '修改的基金不存在',
      data: [],
    });
  } else {
    public_fund[dIndex] = form;

    const result = updatePublicFundJson(userData);
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

// 删除-公共的基金数据
router.post('/fund_public_fund_delete', (req, res) => {
  const { fundcode = '', pageSize = 10 } = req.body;
  const userData = getPublicFundJson() || {};
  let public_fund = userData.public_fund || [];
  userData.public_fund = public_fund.filter(v => v.code !== fundcode);

  const result = updatePublicFundJson(userData);
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

  res.send({
    code: 200,
    msg: '成功',
    data: userData.public_fund || [],
  });
});

module.exports = router;
