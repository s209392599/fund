const express = require('express');
const router = express.Router();

// 定义一个GET路由
router.get('/project', (req, res) => {
  res.send('boxue is 666');
});

router.get('/get_example', (req, res) => {
  res.send('get_example返回值');
});

// router.get('/api/data', (req, res) => {
//   // 尝试调用后端接口
//   axios.get(BACKEND_API_URL)
//     .then(response => {
//       // 如果成功获得后端接口的响应，则直接转发这个响应
//       res.json(response.data);
//     })
//     .catch(error => {
//       // 如果后端接口出错，则返回自定义响应
//       console.error('Backend API is not reachable. Error:', error.message);
//       res.status(503).json({ error: 'Service Unavailable', data: 'Default Data' });
//     });
// });

module.exports = router;
