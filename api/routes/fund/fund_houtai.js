const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const { DatabasePostQuery } = require('../../utils/DatabasePostQuery.js'); // post请求数据库查询封装
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const { pool } = require('../../setting/pool.js'); // 引入mysql连接池

// 后台登录
router.post('/fund_admin_login', (req, res) => {
  const { email = '', password = '' } = req.body;
  if (
    email === '209392599@qq.com' &&
    password === 'qaz123..' &&
    req.body.erji_password === 'boxue666'
  ) {
    res.send({
      code: 200,
      msg: '登录成功',
      data: [],
    });
  } else {
    res.send({
      code: 400,
      msg: '邮箱或密码不对',
      data: [],
    });
  }
});

// 查询-公共的基金数据
router.post('/fund_public_fund_query', async (req, res) => {
  return DatabasePostQuery.apply({ res }, [
    {
      query: 'SELECT * FROM fund_public ORDER BY sort_order ASC',
      format: (results) => ({
        length: results.length,
        data: results,
      }),
    },
  ]);
});

// 修改-公共的基金数据
router.post('/fund_public_fund_update', (req, res) => {
  const { form = {} } = req.body;
  const query_str = `
    UPDATE fund_public
    SET
      fund_name = ?,
      type = ?,
      zhang_url = ?,
      fixed = ?,
      point_down = ?,
      point_top = ?,
      fund_desc = ?,
      sign = ?
    WHERE fund_code = ?;
  `;

  const values = [
    form.fund_name,
    form.type,
    form.zhang_url,
    form.fixed || 0,
    form.point_down,
    form.point_top,
    form.fund_desc,
    form.sign,
    form.fund_code,
  ];

  return DatabasePostQuery.apply({ res }, [
    {
      query: query_str,
      values: values,
      format: (results) => ({
        affectedRows: results.affectedRows, // 返回受影响的行数
      }),
      successMsg: '更新成功',
    },
  ]);
});

// 新增-公共的基金数据
router.post('/fund_public_fund_add', (req, res) => {
  const { form = {} } = req.body;
  const query_str = `
    INSERT INTO fund_public (
        fund_code, fund_name, sort_order, type, sign, zhang_url,
        point_top, point_down, fund_desc, fixed
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
  `;
  const values = [
    form.fund_code,
    form.fund_name,
    form.sort_order || 1,
    form.type,
    form.zhang_url,
    form.fixed || 0,
    form.point_down,
    form.point_top,
    form.fund_desc,
    form.sign,
    form.fund_code,
  ];

  return DatabasePostQuery.apply({ res }, [
    {
      query: query_str,
      values: values,
      format: (results) => ({
        affectedRows: results.affectedRows, // 返回受影响的行数
      }),
      successMsg: '新增成功',
    },
  ]);
});

// -------------------------------------------------------------------------  下面的待改造

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
  const { index_new, index_old } = req.body;
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

// 删除-公共的基金数据
router.post('/fund_public_fund_delete', (req, res) => {
  const { fundcode = '', pageSize = 10 } = req.body;
  const userData = getPublicFundJson() || {};
  let public_fund = userData.public_fund || [];
  userData.public_fund = public_fund.filter((v) => v.code !== fundcode);

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
