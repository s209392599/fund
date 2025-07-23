// https://blog.csdn.net/qq_43592064/article/details/148082669 发送邮件带am参考
const nodemailer = require('nodemailer');
const mail_title = `中信保诚、自由现金流加仓；南方恒生卖出2%；其它先不动`;// 右键主题

var marilArr = [
  'xuebinghui@bmrb.com.cn',// 薛炳辉
  '209392599@qq.com', // 自己
  'cdk1025@foxmail.com',// 前端帮帮群-Aiden
  'liucuimin1234@163.com',// 刘翠敏
  '2774710531@qq.com',// 基金-王亚娟
  '245813892@qq.com',// 基金-邱欣妍(清盐)
  '876844823@qq.com',// 于豆豆
  '1315678738@qq.com',// 前端帮帮群-Nickii
  '1437170263@qq.com',// 基金-王旭豪
  '690002524@qq.com',// 袁梦-涛哥媳妇
  '309372591@qq.com',// 基金-万万
  'hgzc_0703@qq.com',// 郑州帮帮群-猴哥在此(侯沛源)
  '532323146@qq.com',// 林杏
  '1985160325@qq.com',// 赵万隆
  '2294816863@qq.com',// 杜亚谦
  '564749573@qq.com',// 谢孟初
  '724803869@qq.com',// 前端帮帮群-吴昊
  '505643270@qq.com',// 前端帮帮群-汪尚
  '512220559@qq.com',// 王梦琳
  '491719804@qq.com',// 基金-吴美燕(赵万隆姐姐)
  '944148863@qq.com',// 王文泉
  '1023447847@qq.com',// 曾楠
  '397275461@qq.com',// 曾楠
  '397275461@qq.com',// 基金-鲍辰路
  '858627452@qq.com',// 张恒星
  '893261449@qq.com',// 基金-杨国宇
  '1257995147@qq.com',// 基金-饶东禹
  '381851897@qq.com',// 张洪亮
  '2216200137@qq.com',// 刘成阁
  '992131703@qq.com',// 王梦娜
  '1162602300@qq.com',// 吴坤
  '2247621549@qq.com',// 邓米
  'napp0112@163.com',// 基金群-刘成刚
  '1978097296@qq.com',// 基金-高晓波
  // '990635441@qq.com',// 朱雅文
  '1147349343@qq.com',// 基金-陈卓
  '15592191450@163.com',// 王冠涵
  '169226991@qq.com',// 基金-小陈(抖音转化)
  'Lud2017@163.com',// 基金-陆东
  '943836589@qq.com', // 雅苑-向阳而生(8-1-2904)
  '2505512921@qq.com', // 刘虎
  '352237248@qq.com',// 郑州帮帮群-壹陆不是16
  '3281770@qq.com ',// 基金-俞梨(豆豆同事)
  '837166305@qq.com',// 基金-芥末
  '875457031@qq.com',// 基金-孙锦琪 2025年07月21日15:53:59
  'lliuch321@qq.com',// 刘铖浩 2025年07月23日09:20:11
]

var html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>涨幅速览</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    #imgbox {
      display: flex;
      /* justify-content: center; */
      align-items: center;
      flex-wrap: wrap;
    }

    img {
      display: block;
      border: 1px solid #ddd !important;
      margin: 2px;
      height: 160px;
      width: calc(50% - 4px);
    }
  </style>
</head>

<body>
  <div id="imgbox">
    <img src="https://j4.dfcfw.com/charts/pic6/007467.png" alt="华泰柏瑞中证红利低波ETF联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/020989.png" alt="南方恒生科技指数发起(QDII)C">
    <img src="https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.515450" alt="南方红利低波50ETF联接C(008164)">
    <img src="https://j4.dfcfw.com/charts/pic6/023918.png" alt="华夏国证自由现金流ETF发起式联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/008087.png" alt="华夏中证5G通信主题ETF联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/021030.png" alt="汇添富国证港股通创新药ETF发起式联接A">
    <img src="https://j4.dfcfw.com/charts/pic6/017057.png" alt="嘉实国证绿色电力ETF发起联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/023521.png" alt="博时上证科创板人工智能ETF发起式联接C">
    <img src="https://j4.dfcfw.com/charts/pic6/019260.png" alt="博时上证科创板人工智能ETF发起式联接C">
  </div>
</body>

</html>
`;

/*
007467-华泰柏瑞中证红利低波C
008164-南方红利低波50ETFC
020989-南方恒生科技指数发起C
018561-中信保诚多策略灵活C
019269-富国恒生红利ETF联接A
023918-华夏国证自由现金流C
*/

 /*
    https://push2.eastmoney.com/api/qt/stock/get?invt=2&fltt=1&cb=jQuery351018138707342421845_1751948554116&fields=f58%2Cf734%2Cf107%2Cf57%2Cf43%2Cf59%2Cf169%2Cf170%2Cf152%2Cf46%2Cf60%2Cf44%2Cf45%2Cf47%2Cf48%2Cf19%2Cf17%2Cf531%2Cf15%2Cf13%2Cf11%2Cf20%2Cf18%2Cf16%2Cf14%2Cf12%2Cf39%2Cf37%2Cf35%2Cf33%2Cf31%2Cf40%2Cf38%2Cf36%2Cf34%2Cf32%2Cf211%2Cf212%2Cf213%2Cf214%2Cf215%2Cf210%2Cf209%2Cf208%2Cf207%2Cf206%2Cf161%2Cf49%2Cf171%2Cf50%2Cf86%2Cf168%2Cf108%2Cf167%2Cf71%2Cf292%2Cf51%2Cf52%2Cf191%2Cf192%2Cf452%2Cf177&secid=1.515450&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=%7C0%7C0%7C0%7Cweb&dect=1&_=1751948554117

    https://push2.eastmoney.com/api/qt/stock/get?invt=2&fltt=1&fields=f58,f734,f107,f57,f43,f59,f169,f170,f152,f46,f60,f44,f45,f47,f48,f19,f17,f531,f15,f13,f11,f20,f18,f16,f14,f12,f39,f37,f35,f33,f31,f40,f38,f36,f34,f32,f211,f212,f213,f214,f215,f210,f209,f208,f207,f206,f161,f49,f171,f50,f86,f168,f108,f167,f71,f292,f51,f52,f191,f192,f452,f177&secid=1.515450

    https://push2.eastmoney.com/api/qt/stock/get?fields=f58,f57,f43,f60,f169,f170&secid=1.515450
    "data":{"f43":1494,"f57":"515450","f58":"红利低波50ETF","f60":1496,"f169":-2,"f170":-13}

    https://push2.eastmoney.com/api/qt/stock/get?fields=f58,f57,f43,f60,f169,f170&secid=1.000001
    "data":{"f43":349316,"f57":"000001","f58":"上证指数","f60":347313,"f169":2003,"f170":58}

    f58: 指数代号
    f57: 指数名称
    f43: 当前值
    f60: 昨收
    f169: 差值
    f170: 涨幅百分比

    涨幅
    https://fundgz.1234567.com.cn/js/007467.js
    jsonpgz({"fundcode":"007467","name":"华泰柏瑞中证红利低波ETF联接C","jzrq":"2025-07-07",
    "dwjz":"1.7074",// 单位净值
    "gsz":"1.7030",// 估算净值
    "gszzl":"-0.26",// 估算净值涨跌
    "gztime":"2025-07-08 11:30"// 估值时间

    下降值 44也要展示一下
    });
    */


// 创建传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', // QQ邮箱的SMTP服务器地址
  port: 465, // SMTP端口 (SSL通常为465，非SSL为587)
  secure: true, // 使用SSL
  auth: {
    user: '209392599@qq.com', // 你的QQ邮箱地址
    pass: 'ftylpxdehwowbjbd' // 你生成的授权码
  }
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
