const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  // 实现获取用户的逻辑
  res.send('Get all users');
});

router.get('/users/:id', (req, res) => {
  // 实现获取单个用户的逻辑
  const userId = req.params.id;
  res.send(`Get user with ID ${userId}`);
});

// http://localhost:9999/hello?name=123 调用示例
router.get('/hello', (req, res) => {
  // const userId = req.params.id;
  let curName = req.query.name;
  res.send(`Hello ${curName}!!`);
});

module.exports = router;
