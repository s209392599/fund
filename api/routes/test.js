const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

router.get('/text', (req, res) => {
  res.send('Hello, World!');
});

// http://localhost:9999/test?name=boxue&age=18
router.get('/test', (req, res) => {
  // 接受所有参数，并返回json
  const params = req.query || {};
  res.json({
    code:200,
    message: '成功',
    data: {
      ...params,
    },
  });
});

// http://localhost:9999/users/18
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Get user with ID ${userId}`);
});

module.exports = router;
