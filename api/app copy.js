const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const schedule = require('node-schedule');
const { exec } = require('child_process');
const CustomFn = require('./CustomFn.js');
const { fund_history_performance } = require('./utils/fundHistroy.js');
const rateLimit = require('express-rate-limit'); // 引入速率限制中间件
const app = express();
const port = 9999;

// 1. 应用IP速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 200, // 每个IP在窗口期内最多200个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: '请求过于频繁，请稍后再试。'
});
app.use(limiter);


// 2. 增强型来源验证中间件
app.use((req, res, next) => {
  const corsWhitelist = ['http://localhost:9000']; // 跨域白名单, 例如本地开发环境
  const allowedReferer = 'http://150.158.175.108:9999'; // 合法的Referer来源
  const allowedSecrets = [
    'C02CN1R4MD6Q', // Mac序列号
    'YOUR_WINDOWS_UUID_HERE' // Windows UUID
  ];

  const requestOrigin = req.get('origin');
  const requestReferer = req.get('Referer');
  const machineSecretToken = req.get('X-Machine-Secret');

  // --- CORS 预检请求处理 ---
  if (req.method === 'OPTIONS') {
    // 只允许白名单中的跨域预检请求通过
    if (requestOrigin && corsWhitelist.includes(requestOrigin)) {
      res.header('Access-Control-Allow-Origin', requestOrigin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, X-Machine-Secret');
      return res.sendStatus(204);
    }
    return res.status(403).send('Access Denied');
  }

  // --- 实际请求验证 ---

  // 规则1: 包含有效秘密令牌的请求，直接通过
  if (machineSecretToken && allowedSecrets.includes(machineSecretToken)) {
    return next();
  }

  // 规则2: 处理来自浏览器的跨域请求 (有Origin头)
  if (requestOrigin) {
    if (corsWhitelist.includes(requestOrigin)) {
      res.header('Access-Control-Allow-Origin', requestOrigin); // 必须设置响应头
      return next();
    }
  }

  // 规则3: 处理同域请求和爬虫 (无Origin头)
  if (!requestOrigin) {
    // 合法的同域请求会带有Referer
    if (requestReferer && requestReferer.startsWith(allowedReferer)) {
      return next();
    }
  }

  // --- 所有规则都不满足，拒绝访问 ---
  console.warn(`[FORBIDDEN] Origin: "${requestOrigin}", Referer: "${requestReferer}", IP: "${req.ip}"`);
  return res.status(403).send('Access Denied: Invalid origin or missing credentials.');
});


app.use(express.static(path.join(__dirname, 'static')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ... existing code ...
