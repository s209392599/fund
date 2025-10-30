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
router.post('/fund_manage_fund_query', async (req, res) => {
  DatabasePostQuery({
    res: res,
    query: 'SELECT * FROM fund_public ORDER BY sort_order ASC',
    format: (results) => results
    // format: (results) => ({
    //   length: results.length,
    //   data: results,
    // }),
  });
});

// 修改-公共的基金数据
router.post('/fund_manage_fund_update', (req, res) => {
  const { form = {} } = req.body;
  const query_str = `
    UPDATE fund_public
    SET
      fund_name = ?,
      fund_type = ?,
      zhang_url = ?,
      fund_fixed = ?,
      point_down = ?,
      point_top = ?,
      fund_desc = ?,
      fund_sign = ?
    WHERE fund_code = ?;
  `;

  const values = [
    form.fund_name,
    form.fund_type,
    form.zhang_url,
    parseFloat(form.fund_fixed || 0),
    form.point_down,
    form.point_top,
    form.fund_desc,
    form.fund_sign,
    form.fund_code,
  ];

  return DatabasePostQuery({
    res,
    query: query_str,
    values: values,
    format: (results) => ({
      affectedRows: results.affectedRows, // 返回受影响的行数
    }),
    successMsg: '更新成功',
  });
});

// 新增-公共的基金数据
router.post('/fund_manage_fund_add', async (req, res) => {
  const { form = {} } = req.body;

  const total_str = 'SELECT COUNT(*) AS total FROM fund_public';
  const total_num = await DatabasePostQuery({
    query: total_str,
    next: true,
  });
  const cur_sort = total_num[0].total + 1;

//   {
//   "fund_code": "012276",
//   "fund_name": "富国中证沪港深500ETF联接C",
//   "type": "红利",
//   "zhang_url": "https://j4.dfcfw.com/charts/pic6/012276.png",
//   "fixed": "100",
//   "point_down": "1.2",
//   "point_top": "1",
//   "fund_desc": "",
//   "sign": "正常"
// }
/*
CREATE TABLE `fund_public` (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT '唯一字段',
  `fund_code` varchar(6) NOT NULL COMMENT '基金代号',
  `fund_name` varchar(100) NOT NULL COMMENT '基金名称',
  `sort_order` int(3) NOT NULL COMMENT '排序',
  `fund_type` varchar(10) DEFAULT NULL COMMENT '分类',
  `fund_sign` varchar(10) DEFAULT NULL COMMENT '正常、历史、观察、待卖',
  `point_top` decimal(8,4) DEFAULT NULL COMMENT '提示_最高点',
  `point_down` decimal(8,4) DEFAULT NULL COMMENT '提示_最低点',
  `fund_desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `fund_fixed` decimal(5,0) DEFAULT NULL COMMENT '每日定投的量',
  `zhang_url` varchar(150) DEFAULT NULL COMMENT '涨幅的url地址',
  `fundgz` varchar(1) DEFAULT NULL COMMENT '预览涨幅',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_sort_order` (`sort_order`),
  KEY `index_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;
*/

  const query_str = `
    INSERT INTO fund_public (
        fund_code, fund_name, sort_order, fund_type, fund_sign, zhang_url,
        point_top, point_down, fund_desc, fund_fixed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    form.fund_code,
    form.fund_name,
    cur_sort,
    form.fund_type,
    form.fund_sign,
    form.zhang_url,
    form.point_top || '',
    form.point_down || '',
    form.fund_desc || '',
    parseFloat(form.fund_fixed || 0)
  ];

  DatabasePostQuery({
    res,
    query: query_str,
    values: values,
    format: (results) => ({
      affectedRows: results.affectedRows, // 返回受影响的行数
    }),
    successMsg: '新增成功',
  });
});

// 删除-公共的基金数据
router.post('/fund_manage_fund_delete', (req, res) => {
  const { id = null, pageSize = 10 } = req.body;
  console.log(id);
  if (typeof id === 'number' && Number.isInteger(id) && id > 0) {
    DatabasePostQuery({
      res,
      query: 'DELETE FROM fund_public WHERE id = ' + id,
      format: (results) => ({
        affectedRows: results.affectedRows, // 返回受影响的行数
      }),
    });
  } else {
    res.send({
      code: 500,
      msg: 'id必须是1开始的正整数',
      data: []
    });
  }
});

// 排序-公共的基金数据
router.post('/fund_manage_fund_sort', async (req, res) => {
  const { fund_code, index_new, index_old } = req.body;

  // 确保 index_new 和 index_old 是数字
  const newIndex = parseInt(index_new, 10);
  const oldIndex = parseInt(index_old, 10);

  // 构造 SQL 查询
  const queries = [
    `UPDATE fund_public SET sort_order = 0 WHERE fund_code = '${fund_code}';`,
    newIndex > oldIndex
      ? `UPDATE fund_public SET sort_order = sort_order - 1 WHERE sort_order <= ${newIndex} AND sort_order > ${oldIndex} AND fund_code != '${fund_code}';`
      : `UPDATE fund_public SET sort_order = sort_order + 1 WHERE sort_order >= ${newIndex} AND sort_order < ${oldIndex} AND fund_code != '${fund_code}';`,
    `UPDATE fund_public SET sort_order = ${newIndex} WHERE fund_code = '${fund_code}';`,
  ];

  try {
    // 执行 SQL 查询
    for (const query of queries) {
      await DatabasePostQuery({
        query,
        next: true, // 如果 DatabasePostQuery 支持 next 参数
      });
    }

    // 返回成功响应
    res.send({
      code: 200,
      msg: '排序更新成功',
    });
  } catch (err) {
    console.error('排序更新失败:', err);
    res.send({
      code: 500,
      msg: '排序更新失败',
    });
  }
});

// -------------------------------------------------------------------------  下面的待改造

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

// 新增用户
router.post('/fund_add_user_info', (req, res) => {
  const { form = {} } = req.body;
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

// 通过邮箱发送操作建议
router.post('/fund_send_mail_operate', async (req, res) => {
  const { msg = '' } = req.body;
  console.log('msg', msg);
  let all_user = [];

  // let query_str = 'SELECT * FROM fund_users LIMIT 1000';
  // let values = [];
  // if(req.body.search_name){
  //   query_str = 'SELECT * FROM fund_users WHERE user_name LIKE ? OR zh_name LIKE ? LIMIT 1000';
  //   values.push(`%${req.body.search_name.trim()}%`,`%${req.body.search_name.trim()}%`);
  // }
  // all_user = await DatabasePostQuery({
  //   res: res,
  //   query: query_str,
  //   values: values,
  //   format: results => results,
  //   next: true,
  // });

  // console.log('all_user',all_user);
  /*
  {
    id: 53,
    user_name: '786260489@qq.com',
    zh_name: '基金-王凯华',
    user_password: '8888',
    fund_count: 30,
    remark: null,
    expiration_time: 2025-08-31T16:00:00.000Z,
    create_time: 2025-09-23T04:52:43.000Z,
    update_time: 2025-09-23T04:52:43.000Z,
    user_token: null
  },
  */
  res.send({
    code: 200,
    data: all_user || [],
    msg: '发送成功'
  })
});

module.exports = router;
