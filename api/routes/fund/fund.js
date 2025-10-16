const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const { DatabasePostQuery } = require('../../utils/DatabasePostQuery.js'); // post请求数据库查询封装

// 登录
router.post('/fund_amain_login', async (req, res) => {
  const { user_name = '', password = '' } = req.body;
  if (!user_name || !password || password.length < 4) {
    return res.send({
      code: 400,
      msg: '参数错误',
      data: [],
    });
  }
  const userData = await DatabasePostQuery({
    res: res,
    query: `SELECT * FROM fund_users WHERE user_name = '${user_name}' AND user_password = '${password}';`,
    format: (results) => ({
      id: results[0]?.id,
      user_email: results[0]?.user_email,
      user_name: results[0]?.user_name,
    }),
    next: true,
  });
  /*
  {
  "id": 57,
  "user_email": "203812677@qq.com",
  "user_name": "boxue",
  "zh_name": "自己的测试号",
  "user_password": "qaz123..",
  "fund_count": 30,
  "remark": null,
  "expiration_time": "2098-12-31T16:00:00.000Z",
  "create_time": "2025-10-14T06:26:09.000Z",
  "update_time": "2025-10-14T06:26:16.000Z",
  "user_token": null
}
  */
  if (userData && userData.length && userData[0].id) {
    return res.send({
      code: 200,
      msg: '登录成功',
      data: {
        id: userData[0].id,
        user_email: userData[0].user_email,
        user_name: userData[0].user_name,
        user_password: userData[0].user_password,
      },
    });
  } else {
    return res.send({
      code: 400,
      msg: '数据匹配失败',
      data: [],
    });
  }
});

function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str;
}
// 获取实时涨幅
router.post('/fund_amain_getfundgz', (req, res) => {
  const { fundcode = '', pageSize = 10 } = req.body;
  var isSixDigitNumber = /^\d{6}$/.test(fundcode); // 6位数字䣂类型
  if (!isSixDigitNumber) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fundcode}.js?rt=${+new Date()}`;
    fetch(u, {})
      .then((data) => data.text())
      .then((data) => {
        if (data.length > 250) {
          res.send({
            code: 400,
            msg: '此基金号可能暂未开放，请确认',
            data: [],
          });
        } else {
          let str = realTimeInformation(data);
          let obsData = JSON.parse(str || '{}');
          res.send({
            code: 200,
            msg: '成功',
            data: {
              fund_code: fundcode,
              fund_name: obsData.name || '',
              gszzl: obsData.gszzl || '',
              dwjz: obsData.dwjz || '',
              gsz: obsData.gsz || '',
              gztime: obsData.gztime || '',
            },
          });
        }
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fundcode}未能正确获取到值`,
      data: [],
    });
  }
});

// 查询用户的基金
router.post('/fund_amain_fund_query_by_user', async (req, res) => {
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

// 保存用户的基金数据
router.post('/fund_amain_save_fund_data', async (req, res) => {
  let { fund_info = [], fund_user_id = null } = req.body;
  if (!fund_user_id) {
    return res.send({
      code: 400,
      msg: '未正确获取到用户id',
      data: [],
    });
  }
  if (!CustomFn.isValidFundUserId(fund_user_id)) {
    return res.send({
      code: 400,
      msg: '用户id格式错误',
      data: [],
    });
  }
  fund_user_id = parseFloat(fund_user_id);
  if (!fund_info.length) {
    return res.send({
      code: 400,
      msg: '未正确获取到基金数据',
      data: [],
    });
  }
  const oldData = await DatabasePostQuery({
    res: res,
    query: `SELECT * FROM fund_user_collection WHERE fund_user_id = ${fund_user_id} ORDER BY sort_order ASC`,
    format: (results) => ({
      data: results,
    }),
    next: true,
  });
  const arr_update = []; // 需要更新的
  const arr_add = []; // 需要新增的
  const arr_delete = []; // 需要删除的
  const oldMap = new Map(oldData.map((item) => [item.fund_code, item]));
  fund_info.forEach((item) => {
    if (oldMap.has(item.fund_code)) {
      arr_update.push(item);
      oldMap.delete(item.fund_code); // 标记为已处理
    } else {
      arr_add.push(item);
    }
  });
  arr_delete.push(...oldMap.values());
  console.log('arr_update', arr_update.length);
  console.log('arr_add', arr_add.length);
  console.log('arr_delete', arr_delete.length);

  if (arr_delete.length) {
    arr_delete.forEach((item) => {
      DatabasePostQuery({
        res: res,
        query: `DELETE FROM fund_user_collection WHERE id = ${item.id};`,
        format: (results) => ({
          affectedRows: results.affectedRows, // 返回受影响的行数
        }),
        next: true,
      });
    });
  }

  if (arr_update.length) {
    arr_update.forEach((item) => {
      DatabasePostQuery({
        res: res,
        query: `UPDATE fund_user_collection SET fund_code = '${item.fund_code}',
          fund_name = '${item.fund_name}',
          sort_order = ${item.sort_order},
          fundgz = '${item.fundgz}',
          fund_type = '${item.fund_type}',
          fund_sign = '${item.fund_sign}',
          zhang_url = '${item.zhang_url}',
          point_top = '${item.point_top}',
          point_down = '${item.point_down}',
          fund_fixed = '${item.fund_fixed}',
          fund_desc = '${item.fund_desc}' WHERE id = ${item.id};`,
        format: (results) => ({
          affectedRows: results.affectedRows, // 返回受影响的行数
        }),
        next: true,
      });
    });
  }

  if (arr_add.length) {
    arr_add.forEach((item) => {
      DatabasePostQuery({
        res: res,
        query: `INSERT INTO fund_user_collection
          (fund_user_id, fund_code, fund_name, sort_order, fundgz, fund_type, fund_sign, zhang_url, point_top, point_down, fund_fixed, fund_desc)
          VALUES (
          ${fund_user_id},
          '${item.fund_code}',
          '${item.fund_name}',
          ${item.sort_order},
          '${item.fundgz}',
          '${item.fund_type}',
          '${item.fund_sign}',
          '${item.zhang_url}',
          '${item.point_top}',
          '${item.point_down}',
          '${item.fund_fixed}',
          '${item.fund_desc}');`,
        format: (results) => ({
          affectedRows: results.affectedRows, // 返回受影响的行数
        }),
        next: true,
      });
    });
  }

  res.send({
    code: 200,
    data: [],
    msg: '成功',
  });
});

// 获取群主基金数据
router.post('/fund_amain_public_funds', async (req, res) => {
  DatabasePostQuery({
    res: res,
    query: `SELECT * FROM fund_public ORDER BY sort_order ASC;`,
    format: (results) => results,
  });
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

router.post('/fund_detailPageInfoWithNoPin', (req, res) => {
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
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fundcode}","itemId":"","clientVersion":"","channel":"9"}`;
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

  // console.log('fileDir', fileDir);
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

/* 获取天天基金的搜索结果 */
router.post('/fund_search_bytiantian', (req, res) => {
  const { text = '' } = req.body;

  if (!text) {
    res.send({
      code: 400,
      msg: '未正确获取到搜索关键词',
      data: [],
    });
    return;
  }
  try {
    // console.log('text', text);
    const keyStr = encodeURIComponent(text);
    let url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx`;
    let params = `?m=1&key=${keyStr}&pageindex=0&pagesize=1000&t=` + Date.now();

    let u = `${url}${params}`;
    fetch(u, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://fund.eastmoney.com/',
        Accept: 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        // console.log('data', data);
        let datas = data.Datas || [];
        datas = datas.filter((item) => !noText.includes(item.CODE)); // 排除的关键词
        datas = datas.filter((item) => !noFundCode.includes(item.CODE)); // 排除的基金代码

        const turn_data = datas.map((item) => {
          return {
            code: item.CODE,
            name: item.NAME,
          };
        });

        res.send({
          code: 200,
          msg: '成功',
          data: turn_data,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${text} 搜索失败`,
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
