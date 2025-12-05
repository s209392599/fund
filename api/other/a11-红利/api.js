const fs = require('fs');
const express = require('express');
const app = express();
const port = 3006;

// 允许任何来源访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 暴漏出去一个接口，根据参数中的fund_code，删除data/filter.json中的对应项
app.post('/delete_fund', (req, res) => {
  const filterJson = require('./data/filter.json');// 动态读取filterJson
  const fund_code = req.body.fund_code;
  const index = filterJson.findIndex((item) => item.fund_code === fund_code);
  if (index === -1) {
    res.json({ success: false, message: '基金不存在' });
    return;
  }
  filterJson.splice(index, 1);
  fs.writeFileSync('./data/filter.json', JSON.stringify(filterJson, null, 2));
  res.json({ success: true, message: '删除成功' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
