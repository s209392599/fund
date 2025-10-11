// https://blog.csdn.net/qq_43592064/article/details/148082669 发送邮件带am参考
const nodemailer = require('nodemailer');
var mail_title = ``; // 邮件主题
// 2025年09月23日14:16:55
mail_title = `
机器人、人工智能、科创板综指、纳斯达克 多加点仓；
华泰红利 卖两天定投的量；
其它先坚持定投，明天大概率拉人工智能、芯片；
`;
// 2025年09月24日14:31:32
mail_title = `
机器人、人工智能、电池、东财云计算 卖出5%；
明天视情况大批量基金卖出，今天也可以提前操作哈
`;
// 2025年09月25日13:18:54
mail_title = `
现金流 卖出15%；
富国红利、华泰红利 加仓1%
德邦、中航、信澳 卖出15%；
其它 普卖5%-15% 注意手续费；
`;
// 2025年09月26日10:19:06
mail_title = `
清仓 德邦、华安生物、景顺长城恒生消费,不够7天的10月9号再卖；
富国红利、华泰红利 卖出1%；
机器人、人工智能、电池 加仓1%；
其它先不动
`;
// 2025年09月29日14:37:50
mail_title = `
电池、创业板 卖出3%；
创业板、5G 卖出2%；
人工智能 加仓1%；
其他先坚持定投，节后可能主要搞机器人和电池，大家提前做好资金安排
`;
// 2025年10月09日13:46:04
mail_title = `
买底仓 永赢制造升级智选混合发起C(024203)；
买底仓 工银中证稀有金属主题ETF-C(019088)；
电池、机器人、华泰红利 加仓；
富国红利、自由现金流、人工智能 卖出7天定投份额；
同业存单可以今明各赎回50%；
`;
//
mail_title = `
中证华夏5G、东财云计算、华安创业板 停止定投,一周内合并到广发中证A500；
机器人、人工智能、电池 建议持有，准备10、11月份强力持有；
富国红利、现金流、华泰红利 三选二，暂时不是很建议高仓位持有南方恒科；
量化类：建议国金量化、永赢科技、永赢制造，其它可以定个计划合并；
华宝纳斯达克这个可选可不选；
`;


/*
10.13 周一 停止日定投 工银中证稀有金属主题ETF-C
10.13 周一 取消 中信保诚的日定投  11.15之前找机会就卖出一部分的份额
10.20清仓 中证华夏5G、东财云计算、华安创业板
10.21 清仓 工银中证稀有金属主题ETF-C


//
mail_title = `

`;

018957
中航机遇领航混合发起C

016371
信澳业绩驱动混合C

002112
德邦鑫星价值灵活配置混合C

008327
东财通信C https://j4.dfcfw.com/charts/pic6/008327.png




清仓 012322-东财云计算增强C

要不要加入一个5G之类的？
东财通信？
https://fund.eastmoney.com/ztjj/#!syl/D/dt/syl/zjlr/FLOW/c/0/curr/BK000174-%E9%80%9A%E4%BF%A1/fst/DESC

南方恒生科技指数(020989)
广发中证A500ETF联接C(022425)
汇添富中证电池主题C(012863)
取消 景顺长城恒生消费ETF联接 的定投
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
  '1834651803@qq.com', // 杜望
  '786260489@qq.com', // 基金-王凯华
  '1050210750@qq.com', // 彭贝贝
  '936106274@qq.com',// 张晗 2025年9月16日20:20:12
  '2992059190@qq.com',// 张盈 2025年09月17日11:28:49
  '897953871@qq.com',// 基金-Avery(阿鹏) 2025年09月22日14:22:37
  '173560567@qq.com',// 基金-刘一凡 2025年09月22日14:24:06
  '859377899@qq.com',// 基金-H 2025年09月22日14:24:54
  '1354461841@qq.com',// 李鑫-聚言朋友 2025年09月22日15:49:51
  '934704152@qq.com',// 刘莹莹
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

function getFormattedDate() {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1; // getMonth() 返回 0-11，所以需要加1
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // 使用三元运算符确保月、日、小时、分钟和秒都是两位数
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // 拼接成 YYYY-MM-DD HH:MM:SS 格式
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

// 发送邮件
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('发送失败:', error);
  }
  // console.log('邮件已发送: %s', info.messageId, getFormattedDate());
  console.log('邮件已发送: %s', getFormattedDate());
});
