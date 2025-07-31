const express = require('express');
const router = express.Router();

// 定义一个GET路由
router.get('/testget', (req, res) => {
  const content = req.query.content || '';
  res.send({
    code: 200,
    msg: '成功',
    data: [content || '没有传递参数哦'],
  });
});

router.post('/testpost', (req, res) => {
  console.log('req.body',req.body);
  const content = req.body.content || '';
  res.send({
    code: 200,
    msg: '成功',
    data: [content || '没有传递参数哦'],
  });
});

// router.get('/users/:id', (req, res) => {
//   const userId = req.params.id;
//   res.send(`Get user with ID ${userId}`);
// });

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
