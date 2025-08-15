const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');

// 获取用户的json数据
const getUserJson = () => {
  const filePath = path.join(__dirname, '../../data/base/user.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileContent);
  return jsonData;
};

// 定义一个GET示例请求
router.get('/testget', (req, res) => {
  const content = req.query.content || '';
  res.send({
    code: 200,
    msg: '成功',
    data: [content || '没有传递参数哦'],
  });
});

// 定义一个POST示例请求
router.post('/testpost', (req, res) => {
  console.log('req.body', req.body);
  const content = req.body.content || '';
  res.send({
    code: 200,
    msg: '成功',
    data: [content || '没有传递参数哦'],
  });
});

// 登录
router.post('/fund_login', (req, res) => {
  const { email = '', password = '' } = req.body;
  if (
    !email ||
    !password ||
    password.length < 4 ||
    !CustomFn.CustomValidateEmail(email)
  ) {
    return res.send({
      code: 400,
      msg: '邮箱或密码格式不对',
      data: [],
    });
  }
  const userData = (getUserJson() || {}).data || [];
  const user = userData.find((item) => item.mail === email);
  if (!user) {
    return res.send({
      code: 400,
      msg: '未获取到用户数据',
      data: [],
    });
  }
  if (user.password !== password) {
    return res.send({
      code: 400,
      msg: '密码不对',
      data: [],
    });
  }
  return res.send({
    code: 200,
    msg: '登录成功',
    data: user,
  });
  // fund_login
});

// 注册
router.post('/fund_register', (req, res) => {
  console.log('req.body', req.body);
});

// 获取公共的基金数据
router.get('/fund_public_fund', (req, res) => {
  const userData = getUserJson() || [];
  res.send({
    code: 200,
    msg: '成功',
    data: userData.public_fund || [],
  });
});

// 修改用户信息
router.post('/fund_update_user_info', (req, res) => {
  console.log('req.body', req.body);
});

// 获取基金历史数据
router.post('/fund_history_data', (req, res) => {
  const { fundcode = '', pageSize = 10 } = req.body;

  if (!fundcode) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${fundcode}","pageNum":1,"pageSize":${pageSize},"channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        let netValueList = datas.netValueList || [];
        // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
        res.send({
          code: 200,
          msg: '成功',
          data: netValueList.reverse(),
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fundcode}未能正确获取到值`,
      data: [],
    });
  }
});

// 获取timer基金当天涨幅
router.post('/fund_today_rate_by_timer', (req, res) => {
  const fundcode = req.body.fundcode || '';
  if (!fundcode) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  const apiDir = path.join(__dirname, '../../'); // 回退到 /api 目录
  let fileDir = path.join(apiDir, 'data/preview/', fundcode);

  console.log('fileDir', fileDir);
  // /Users/guokun/github/fund/api/routes/fund/data/preview/023350
  fs.readdir(fileDir, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件夹不存在，返回404
        return res.send({
          code: 404,
          msg: '没有这个基金的文件夹',
          data: [],
        });
      } else {
        // 其他错误，返回405
        return res.send({
          code: 405,
          msg: '读取文件夹时发生错误',
          data: [],
        });
      }
    }

    // 过滤出.json文件，并找到最新的文件
    const jsonFiles = files.filter((file) => file.endsWith('.json'));
    if (jsonFiles.length === 0) {
      return res.send({
        code: 404,
        msg: '没有这个基金的json文件',
        data: [],
      });
    }

    // 按文件名中的日期部分排序，找到最新的文件
    jsonFiles.sort((a, b) => {
      const dateA = a.split('_')[1];
      const dateB = b.split('_')[1];
      return new Date(dateB) - new Date(dateA); // 降序排序
    });

    const latestFile = jsonFiles[0];
    const filePath = path.join(fileDir, latestFile);

    // 读取最新文件的内容
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // 读取文件时发生错误，返回405
        return res.send({
          code: 405,
          msg: '读取基金数据文件时发生错误',
          data: [],
        });
      }

      try {
        // 解析JSON数据
        const jsonData = JSON.parse(data);
        return res.send({
          code: 200,
          msg: '已正确读取',
          data: jsonData,
        });
      } catch (parseError) {
        // 解析JSON时发生错误，返回405
        return res.send({
          code: 405,
          msg: '格式化基金数据出错',
          data: jsonData,
        });
      }
    });
  });
});

/*
获取基金的历史业绩
https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=007467&disclosureType=1&activeIndex=0 来源页面
近一周多少、近一月多少。。。。。。
*/
router.post('/fund_history_performance', (req, res) => {
  const { fundcode = '', pageSize = 10 } = req.body;

  if (!fundcode) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryPerformancePageInfo?reqData={"fundCode":"${fundcode}","channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        let performanceList = datas.performanceList || [];
        res.send({
          code: 200,
          msg: '成功',
          data: performanceList,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fundcode}未能正确获取到值`,
      data: [],
    });
  }
});

// router.get('/users/:id', (req, res) => {
//   const userId = req.params.id;
//   res.send(`Get user with ID ${userId}`);
// });

// router.get('/api/data', (req, res) => {
//   // 尝试调用后端接口
//   axios.get(BACKEND_API_URL)
//     .then(response => {
//       // 如果成功获得后端接口的响应，则直接转发这个响应
//       res.json(response.data);
//     })
//     .catch(error => {
//       // 如果后端接口出错，则返回自定义响应
//       console.error('Backend API is not reachable. Error:', error.message);
//       res.status(503).json({ error: 'Service Unavailable', data: 'Default Data' });
//     });
// });

module.exports = router;
