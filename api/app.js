const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const whiteAdree = [
  'http://150.158.175.108:9999',
  'http://150.158.175.108:9000', // 基金网站的使用
  'http://150.158.175.108:9005', // 后台管理接口
  'http://localhost:9000', // Vue项目-主项目
  'http://localhost:9001', // Vue项目-后台
  'http://localhost:9999', // 本地测试
  'http://127.0.0.1:9002', // live server插件
  'http://127.0.0.1:9999', // live server插件
];

/* 应用IP速率限制
const rateLimit = require('express-rate-limit'); // 引入速率限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 200, // 每个IP在窗口期内最多200个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: '请求过于频繁，请稍后再试。'
});
app.use(limiter);
*/

const app = express();
const PORT = process.env.PORT || 9999;

// 允许任何域访问
app.use(cors());

app.use(express.static(path.join(__dirname, 'static')));

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8'); // 设置所有HTTP响应的字符集为UTF-8
  next();
});

// 获取当前时间 yyyy-mm-dd hh:mm:ss
function getCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

app.use((req, res, next) => {
  const request_origin = req.get('origin');
  const request_referer = req.get('referer');
  const machineSecretToken = req.get('X-Machine-Secret'); // 用于验证您特定Mac的自定义请求头
  const machineSecret = 'C02CN1R4MD6Q'; // mac电脑的序列号
  // wmic csproduct get uuid  在windows上获取uuid
  console.log('-------------------------------------');
  // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  console.log('req.originalUrl => ', req.originalUrl, getCurrentTime());

  // 检查是否是OPTIONS预检请求，直接通过
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, X-Machine-Secret'
    );
    return res.sendStatus(204);
  }

  if (request_origin) {
    let flag_2 = false;
    whiteAdree.forEach((item) => {
      if (request_origin.startsWith(item)) {
        flag_2 = true;
      }
    });
    if (flag_2) {
      return next(); // 允许白名单
    }
  }
  if (request_referer) {
    let flag_3 = false;
    whiteAdree.forEach((item) => {
      if (request_referer.startsWith(item)) {
        flag_3 = true;
      }
    });
    if (flag_3) {
      return next(); // 允许白名单
    }
  }

  if (machineSecretToken === machineSecret) {
    return next(); // 允许特定验证
  }

  return res.status(403).send({
    code: '403',
    data: [],
    msg: '拒绝非正规途径访问！',
  });
});

// 路由模块所在的目录
const routesDirectory = path.join(__dirname, 'routes');

// 递归函数，用于加载所有.js文件
function loadRoutes(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // 如果是目录，递归调用
      loadRoutes(fullPath);
    } else if (path.extname(file) === '.js') {
      // 如果是.js文件，加载它
      const route = require(fullPath);
      app.use(route);
    }
  });
}

// 调用递归函数加载路由
loadRoutes(routesDirectory);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
