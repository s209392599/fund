const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 使用 Express 内置中间件解析 JSON 请求体（仅对 POST 请求有用）
router.use(express.json());

const sendMailFn = async (cakkbak_res, content) => {
  const mail_title = content; // 右键主题

  const filePath = path.join(__dirname, '../../data/base/user.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileContent);
  const dataArray = jsonData.data;

  var marilArr = dataArray.map((v) => v.mail);
  var marilArr = [
    '209392599@qq.com', // 郭坤
    's209392599@163.com', // 郭坤
  ];

  var html = `
  <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>涨幅速览</title>
  <style>
    * {margin: 0;padding: 0;box-sizing: border-box;}
    #imgbox {display: flex;align-items: center;flex-wrap: wrap;}
    img {display: block;border: 1px solid #ddd !important;margin: 2px;height: 160px;width: calc(50% - 4px);}
  </style></head>

  <body>
    <div id="imgbox">
      <img src="https://j4.dfcfw.com/charts/pic6/007467.png" alt="华泰柏瑞中证红利低波ETF联接C">
      <img src="https://j4.dfcfw.com/charts/pic6/020989.png" alt="南方恒生科技指数发起(QDII)C">
      <img src="https://j4.dfcfw.com/charts/pic6/023918.png" alt="华夏国证自由现金流ETF发起式联接C">
      <img src="https://j4.dfcfw.com/charts/pic6/008087.png" alt="华夏中证5G通信主题ETF联接C">
      <img src="https://j4.dfcfw.com/charts/pic6/021030.png" alt="汇添富国证港股通创新药ETF发起式联接A">
      <img src="https://j4.dfcfw.com/charts/pic6/023521.png" alt="博时上证科创板人工智能ETF发起式联接C">
      <img src="https://j4.dfcfw.com/charts/pic6/019260.png" alt="富国恒生">
    </div>
  </body>
  </html>
  `;

  // 创建传输器
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com', // QQ邮箱的SMTP服务器地址
    port: 465, // SMTP端口 (SSL通常为465，非SSL为587)
    secure: true, // 使用SSL
    auth: {
      user: '209392599@qq.com', // 你的QQ邮箱地址
      pass: 'ftylpxdehwowbjbd', // 你生成的授权码
    },
  });

  // 邮件选项
  const mailOptions = {
    from: '"基金参考" <209392599@qq.com>', // 发件人地址
    to: marilArr.join(','), // 收件人地址，多个用逗号分隔
    subject: mail_title, // 邮件主题
    text: '基金消息提醒', // 纯文本内容
    html: html, // HTML 内容
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error('发送失败');
    } else {
      cakkbak_res.send({
        code: 200,
        msg: '邮件已发送',
        data: [],
      });
      console.log('邮件已发送: %s', info.messageId);
    }
  });
};

// 处理 GET 请求
router.get('/sendNotionMail', (req, res) => {
  const content = req.query.content;
  if (!content) {
    return res.send({
      code: 400,
      msg: '未正确传参',
      data: [],
    });
  }
  try {
    sendMailFn(res, content);
  } catch (error) {
    res.send({
      code: 500,
      msg: '服务器处理错误',
      data: [],
    });
  }
});

// 处理 POST 请求
router.post('/sendNotionMail', async (req, res) => {
  const content = req.body.content;
  if (!content) {
    return res.send({
      code: 400,
      msg: '未正确传参',
      data: [],
    });
  }

  try {
    sendMailFn(res, content);
  } catch (error) {
    res.send({
      code: 500,
      msg: '服务器处理错误',
      data: [],
    });
  }
});

module.exports = router;
