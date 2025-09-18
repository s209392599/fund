// https://blog.csdn.net/qq_43592064/article/details/148082669 发送邮件带am参考
const nodemailer = require('nodemailer');
var mail_title = ``; // 邮件主题
// 2025年09月09日14:10:50
mail_title = `机器人、纳斯达克加仓；中信日定投可以多加点；德邦、信澳、东财云计算 暂停定投，一个月后全部合并到中航，可以接受暂时损失的可以先卖出一些，最近易中天可能会持续向下；`;
// 2025年09月10日14:34:10
mail_title = `机器人加仓，其它的先坚持定投`;
// 2025年09月11日14:53:36
mail_title = `中航、德邦、信澳、东财云计算 卖出 10%左右，继续买入纳斯达克；电池仓位小的话也可以加`;
// 2025年09月12日13:55:31
mail_title = `中航、德邦、信澳 继续卖出 10%左右；加仓 人工智能、机器人、纳斯达克；增加定投 广发中证A500ETF联接C(022425)`;
// 2025年09月15日14:27:46
mail_title = `中航、德邦、信澳 留一个即可，剩下的清仓，我留的德邦；
电池 卖出10%，继续日定投；
机器人 卖出8%，继续日定投；
开始日定投 160424-华安创业板50ETF联接C 小量；
清仓 019103-景顺长城恒生消费ETF联接；
清仓 020726-建信灵活配置混合C；
清仓 023350-诺安多策略混合C；
清仓 018729-华夏智胜新锐股票C；
注意 华泰柏瑞中证红利低波ETF联接C 仓位要降低；`;
// 2025年09月16日14:08:30
mail_title = `
机器人 卖出5%，先锁定前期利润；
人工智能 卖出5% 先锁定前期利润；
东财云计算增强C 卖出20%(避免手续费部分)；
纳斯达克 卖出5%(注意最近7天刚开买的不要动)；
华安医药生物股票发起式C 微加仓；
华夏国证自由现金流 微加仓；
有余钱的红利继续买入哈
`;
// 2025年09月17日
mail_title = `
南方恒生科技指数C 卖出5%；
易方达机器人ETF联接C 卖出5%；
加仓 博时上证科创板人工智能；
`;
// 2025年09月18日
mail_title = `
机器人、人工智能 继续出5%；
东财云计算增强C 卖出5%；
富国红利、电池 加仓；
永赢科技智选混合发起C(022365) 不要底仓，开启小量日定投；
`;

/*
清仓 012322-东财云计算增强C

要不要加入一个5G之类的？
东财通信？
https://fund.eastmoney.com/ztjj/#!syl/D/dt/syl/zjlr/FLOW/c/0/curr/BK000174-%E9%80%9A%E4%BF%A1/fst/DESC


*/




// mail_title = ``;
// mail_title = ``;
// mail_title = ``;

// 007467 后面要卖出一些

/*
南方恒生科技指数(020989)
广发中证A500ETF联接C(022425)
汇添富中证电池主题C(012863)

取消 景顺长城恒生消费ETF联接 的定投

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
  '936106274@qq.com',// 张晗 2025年9月16日20:20:12
  '2992059190@qq.com',// 张盈 2025年09月17日11:28:49
];
// marilArr = [marilArr[0]];// 只开放自己
// marilArr = [marilArr[0],marilArr[marilArr.length - 1]];// 开放测试人员

var msg_arr = mail_title.trim().replaceAll('；',';').split(';');
var msg_str = '';
msg_arr.forEach(v => msg_str +=`<div>${v}<div>`)

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
  ${msg_str}

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
