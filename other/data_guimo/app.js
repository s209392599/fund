const path = require('path');
const express = require('express');
const fs = require('fs').promises;
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// 允许跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 获取所有基金数据
async function getAllFundData() {
  try {
    const dataDir = path.join(__dirname, './data_guimo/data_all');
    const files = await fs.readdir(dataDir);
    let allData = {};
    let totalCount = 0;

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const data = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      const category = path.parse(file).name; // 获取文件名（不含扩展名）作为分类
      allData[category] = jsonData.data;
      totalCount += jsonData.data.length;
    }

    return {
      total: totalCount,
      categories: Object.keys(allData).length,
      data: allData
    };
  } catch (e) {
    console.error('处理数据时发生错误:', e);
    throw e;
  }
}

// API 路由
app.get('/api/funds', async (req, res) => {
  try {
    const data = await getAllFundData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取特定分类的基金数据
app.get('/api/funds/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const filePath = path.join(__dirname, `./data_guimo/data_all/${category}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: '未找到该分类数据' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
