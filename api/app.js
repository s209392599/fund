const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 9999;

// 允许任何域访问
app.use(cors());

app.use(express.static(path.join(__dirname, 'static')));

app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8'); // 设置所有HTTP响应的字符集为UTF-8
  next();
});

app.use(bodyParser.text({ type: 'text/html', defaultCharset: 'utf-8' }));

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

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
