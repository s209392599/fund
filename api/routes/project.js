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

/*
ID：随机生成的ID(8位)
name: 登录的账号
password: 登录的密码
time_resg: 注册时间
time_end: 最后一次登录时间
mail: 邮箱地址
tel: 电话

基金相关信息表：
ID：基金ID
name: 基金名称
preview_url: 基金预览地址
type: 基金类型
status: 基金状态
description: 基金描述
time: 基金创建时间

基金表：
ID：人员ID
name: 基金名称
type: 基金类型
*/
