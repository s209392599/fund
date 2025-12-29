// api文件夹下暴露过来的一些方法  fund_apifolder_开头
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');

// 封装一个读取文件并返回json数据的方法
async function readJsonFile(filePath = '') {
  if (__dirname.includes('api/routes/fund')) {
    let prestr = __dirname.replace('routes/fund', filePath);
    filePath = prestr; // mac
  } else if (__dirname.includes('api\\routes\\fund')) {
    let prestr = __dirname.replace('routes\\fund', filePath);
    filePath = prestr; // windows
  }
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function turnDataFn(res, obj){
  const filePath = obj.filePath || './data.json';
  // 不对数据转换，不用写
  const turnDataFn = obj.turnDataFn || ((v)=>{ return v;});
  try {
    let json_data = await readJsonFile(filePath);
    if (!json_data) {
      return res.send({
        code: 404,
        msg: '数据文件不存在',
        data: null,
      });
    }
    const turnData = turnDataFn(json_data);
    return res.send({
      code: 200,
      msg: '读取文件成功',
      data: turnData,
    });
  } catch (error) {
    return res.send({
      code: 400,
      msg: '读取文件失败',
      data: null,
    });
  }
}

// 读取交叉排行的数据
router.post('/fund_apifolder_jiaichapaihang', async (req, res) => {
  return turnDataFn(res, {
    filePath: 'data/pai_hang_jiao_cha/data.json',
    turnDataFn: (json_data) => {
      const curDay = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');
      return json_data[curDay] || {}; // 只取当天的数据
    },
  });
});

// 根据关键词返回基金
router.post('/fund_apifolder_query_keywords', async (req, res) => {
  const { text = '' } = req.body;
  if (text.length < 2) {
    return res.send({
      code: 400,
      msg: '未正确获取到搜索关键词',
      data: [],
    });
  }
  return turnDataFn(res, {
    filePath: 'data/fund_all/data.json',
    turnDataFn: (json_data) => {
      let arr = [];
      json_data.forEach((item) => {
        let fund_name = item[1];
        if(fund_name.includes(text)){
          arr.push({
            fund_code: item[0],
            fund_name: item[1],
            fund_type: item[2],
          });
        }
      });
      return arr;
    },
  });
});

module.exports = router;
