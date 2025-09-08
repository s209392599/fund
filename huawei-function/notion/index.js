// https://blog.csdn.net/qq_43592064/article/details/148082669 发送邮件带am参考
const nodemailer = require('nodemailer');
var mail_title = `量化继续定投; 红利类卖出3天的定投份额; 可新增定投 易方达机器人ETF联接C(020973)`; // 右键主题
mail_title = `量化可再手动买入一点；其它先坚持定投`;

mail_title = `华泰红利和消费(2选1)加仓，其它不动`;
mail_title = `东财云计算、消费类的、永赢科技 直接卖出；`;
//  看下a500 里面哪一个最好，顺便把搜索给做了
//

/*
南方恒生科技指数(020989) 完全卖出进行清仓

汇添富中证电池主题ETF发起式联接C(012863) 开启两周的小定投，11月份出货

取消 景顺长城恒生消费ETF联接 的定投

其它的先持续定投，如果没有钱了可以先卖出一部分(15 ~ 20位的基金)

*/

/*
移除 广发中证A500ETF联接C 推荐，昨天已经买入的7天后可以卖掉 后6位的持仓
*/

var marilArr = [
  '209392599@qq.com', // 郭坤
  'xuebinghui@bmrb.com.cn', // 薛炳辉
  'cdk1025@foxmail.com', // 前端帮帮群-Aiden
  'liucuimin1234@163.com', // 刘翠敏
  '2774710531@qq.com', // 基金-王亚娟
  '245813892@qq.com', // 基金-邱欣妍(清盐)
  '876844823@qq.com', // 于豆豆
  '1315678738@qq.com', // 前端帮帮群-Nickii
  '1437170263@qq.com', // 基金-王旭豪
  '690002524@qq.com', // 袁梦-涛哥媳妇
  '309372591@qq.com', // 基金-万万
  'hgzc_0703@qq.com', // 郑州帮帮群-猴哥在此(侯沛源)
  '532323146@qq.com', // 林杏
  '1985160325@qq.com', // 赵万隆
  '2294816863@qq.com', // 杜亚谦
  '564749573@qq.com', // 谢孟初
  '724803869@qq.com', // 前端帮帮群-吴昊
  '505643270@qq.com', // 前端帮帮群-汪尚
  '512220559@qq.com', // 王梦琳
  '491719804@qq.com', // 基金-吴美燕(赵万隆姐姐)
  '944148863@qq.com', // 王文泉
  '1023447847@qq.com', // 曾楠
  '397275461@qq.com', // 曾楠
  '397275461@qq.com', // 基金-鲍辰路
  '858627452@qq.com', // 张恒星
  '893261449@qq.com', // 基金-杨国宇
  '1257995147@qq.com', // 基金-饶东禹
  '381851897@qq.com', // 张洪亮
  '2216200137@qq.com', // 刘成阁
  '992131703@qq.com', // 王梦娜
  '1162602300@qq.com', // 吴坤
  '2247621549@qq.com', // 邓米
  'napp0112@163.com', // 基金群-刘成刚
  '1978097296@qq.com', // 基金-高晓波
  '1147349343@qq.com', // 基金-陈卓
  '15592191450@163.com', // 王冠涵
  '169226991@qq.com', // 基金-小陈(抖音转化)
  'Lud2017@163.com', // 基金-陆东
  '3985713874@qq.com', // 雅苑-向阳而生(8-1-2904)
  '2505512921@qq.com', // 刘虎
  '352237248@qq.com', // 郑州帮帮群-壹陆不是16
  '3281770@qq.com ', // 基金-俞梨(豆豆同事)
  '837166305@qq.com', // 基金-芥末
  '875457031@qq.com', // 基金-孙锦琪
  'lliuch321@qq.com', // 刘铖浩
  // '459947847@qq.com', // 王一行
  '1834651803@qq.com', // 杜望
  '786260489@qq.com', // 基金-王凯华
  '1050210750@qq.com', // 彭贝贝
];

var html = `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>涨幅速览</title><style>
    * {margin: 0;padding: 0;box-sizing: border-box;}
    #imgbox {display: flex;align-items: center;flex-wrap: wrap;}
    img {display: block;border: 1px solid #ddd !important;margin: 2px;height: 160px;width: calc(50% - 4px);}
  </style>
</head>
<body>
  <div>${mail_title}</div>

  <div>
    <a href="http://150.158.175.108:9999/preview.html" rel="noopener" target="_blank">涨幅预览地址</a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://mli8rlv6cu.feishu.cn/docx/BcJhdXYMqoXS47xb0xdcuBo2nGh" rel="noopener" target="_blank">基金相关知识及网站介绍</a>
  </div>

  <div id="imgbox">
    <img src="https://j4.dfcfw.com/charts/pic6/007467.png" alt="华泰柏瑞中证红利低波ETF联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/019260.png" alt="富国恒生红利ETF联接A">
    <img src="https://j4.dfcfw.com/charts/pic6/020989.png" alt="南方恒生科技指数发起(QDII)C">
    <img src="https://j4.dfcfw.com/charts/pic6/023918.png" alt="华夏国证自由现金流ETF发起式联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/023521.png" alt="博时上证科创板人工智能ETF发起式联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/020973.png" alt="易方达机器人ETF联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/012322.png" alt="东财云计算增强C">

    <img src="https://j4.dfcfw.com/charts/pic6/008087.png" alt="华夏中证5G通信主题ETF联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/021030.png" alt="汇添富国证港股通创新药ETF发起式联接A">
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
  // from: '"发件人名称" <你的QQ邮箱@qq.com>', // 发件人信息
  from: '"基金参考" <209392599@qq.com>', // 发件人地址
  to: marilArr.join(','), // 收件人地址，多个用逗号分隔
  subject: mail_title, // 邮件主题
  text: '基金消息提醒', // 纯文本内容
  // html: '<b>测试邮件</b>', // HTML 内容
  html: html, // HTML 内容
  // 还可以添加附件
  // attachments: [
  //   {
  //     filename: "example.txt", // 附件名称
  //     content: "这是附件内容", // 附件内容（可以是 Buffer 或文件路径）
  //   },
  // ],
};

// 发送邮件
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('发送失败:', error);
  }
  console.log('邮件已发送: %s', info.messageId);
});
