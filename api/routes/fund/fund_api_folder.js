// api文件夹下暴露过来的一些方法  fund_apifolder_开头
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');

// 读取交叉排行的数据
router.post('/fund_apifolder_jiaichapaihang', async (req, res) => {
  try{
    // const filePath = path.join(__dirname, 'data', '');
    // const data = fs.readFileSync(filePath, 'utf8');
    // const jsonData = JSON.parse(data);

    let filePath = '';
    if(__dirname.includes('api/routes/fund')){
      let prestr = __dirname.replace('routes/fund', 'data/pai_hang_jiao_cha');
      filePath = prestr + '/data.json';
    }else{
      filePath = './data.json';// 本文件执行
    }
    console.log('filePath',filePath);
    // 1. 使用异步读取（避免阻塞事件循环）
    const data = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    // 2. 添加文件存在性检查
    if (!fs.existsSync(filePath)) {
      return res.send({
        code: 404,
        msg: '数据文件不存在',
        data: null
      });
    }else{
      const curDay = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');
      const turnData = jsonData[curDay] || {};// 只取当天的数据
      res.send({
        code: 200,
        msg: '读取文件成功',
        data: turnData,
      });
    }
  } catch (error) {
    res.send({
      code: 400,
      msg: '读取文件失败',
      data: [],
    });
  }
});


module.exports = router;
