const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

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

app.use((req, res, next) => {
  const whitelist = ['150.158.175.108:9999', 'localhost:9000'];
  const requestHost = req.get('Host');
  const machineSecretToken = req.get('X-Machine-Secret'); // 用于验证您特定Mac的自定义请求头
  const machineSecret = 'C02CN1R4MD6Q';// mac电脑的序列号
  // wmic csproduct get uuid  在windows上获取uuid
  console.log('-------------------------------------');
  console.log('requestHost => ',requestHost);
  console.log('machineSecretToken => ',machineSecretToken);

  // 检查是否是OPTIONS预检请求，直接通过
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Machine-Secret');
    return res.sendStatus(204);
  }

  if (whitelist.includes(requestHost)) {
    // res.header('Access-Control-Allow-Origin', requestOrigin);
    return next();// 允许白名单
  }

  // 条件2：允许包含正确“秘密令牌”的请求 (例如来自您Mac上的Postman或脚本)
  if (machineSecretToken === machineSecret) {
    return next();// 允许自己的mac电脑请求
  }

  // 如果以上条件都不满足，则拒绝访问
  console.warn(`Forbidden request from origin: ${requestOrigin}`);
  return res.status(403).send('Access Denied');
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
