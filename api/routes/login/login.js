const express = require('express');
const router = express.Router();

// 定义一个GET路由
router.get('/login', (req, res) => {
  res.send('login is ok');
});

module.exports = router;
