/*
http://150.158.175.108:9999/preview.html 图片要加上时间戳的后缀
个人系统也是

新发的基金每天看一下?


006075-博时标普500ETF联接C
007722-天弘标普500发起(QDII-FOF)C
[{"fund_code":"006075","fund_name":"博时标普500ETF联接C","fund_type":"QDII-指数"},{"fund_code":"007722","fund_name":"天弘标普500发起(QDII-FOF)C","fund_type":"QDII-偏股"}]
富荣福耀混合C(012877) 这个也不错 2026年02月10日11:01:51

基金对比里面：
添加导入群主基金
成立时间不到半年
删除30天

203812677的账户里面，显示一些历史的监控
放在历史分组里面？

中欧瑾源灵活配置混合C(001147)

查看、上传 或者删除文件 可以指定路径

这个也main是不是每天都要看下 2026年02月03日13:33:04
https://www.cls.cn/quotation
https://www.cls.cn/finance
注：手机上 ETF*基金 这个tab下的板块的链接是多少？ 用穿透工具获取一下，电脑上找不到

CPO量化的基金
https://api3.cls.cn/quote/fundplate?os=ios&fundTypeCode=cls81935

基金诊断
https://lc.jr.jd.com/fund/funddiagnosis/index/?itemId=111934&dc=36
https://www.iwencai.com/unifiedwap/result?w=008164&querytype=fund

金十数据app的资讯接口

同花顺详情中心
https://q.10jqka.com.cn/

全球焦点快讯
https://kuaixun.eastmoney.com/yw.html
东方财富网
https://www.eastmoney.com/

南北向资金
https://data.eastmoney.com/hsgt/hsgtV2.html
https://emdata.eastmoney.com/hsgt/index.html
同花顺app也有 港股资金流向

融资融券
https://data.eastmoney.com/rzrq/sh.html
主力排名
https://data.eastmoney.com/zjlx/list.html
行情中心
https://wap.eastmoney.com/quote/bj.html
资金流向
https://data.eastmoney.com/zjlx/
东方财富流向
https://emdatah5.eastmoney.com/dc/zjlx/stock?fc=0.300059



005110,010235,014521,019000,018940,019889

这个网站再研究下
https://fund.10jqka.com.cn/
https://fund.10jqka.com.cn/datacenter/fh/ 基金分红
https://fund.10jqka.com.cn/market/xfx/ 新发基金
https://data.10jqka.com.cn/funds/gnzjl 概念资金
https://data.10jqka.com.cn/market/rzrq/ 融资融券


同花顺
https://www.10jqka.com.cn/
https://stockpage.10jqka.com.cn/youth/300059/funds/



https://data.eastmoney.com/report/industry.jshtml 行业研报
https://finance.eastmoney.com/a/cywjh.html 资讯精华
https://fund.eastmoney.com/data/xinfound.html 新成立的基金

指数估值
https://danjuanfunds.com/rn/value-center

全球市场
https://gushitong.baidu.com/

https://fund.eastmoney.com/cnjy_jzzzl.html 场内基金交易净值排行
https://fund.eastmoney.com/data/ 基金净值，可以从这里看看最新的评级之类的基金


天天基金 列表
https://fund.eastmoney.com/a/cjjyw.html

https://www.csindex.com.cn/#/about/newsCenter 中证指数的新闻与公告
https://www.csindex.com.cn/#/indices/family/detail?indexCode=000510 A500的详情



华夏恒生科技指数ETF净流入超过110亿元；天弘、华泰柏瑞、易方达、大成旗下恒生科技ETF，净流入均超过50亿元。  这些数据哪里来？能否展示在系统？是否有必要做记录展示？
https://quote.eastmoney.com/sh515450.html 可以看到ETF价格等，财联社等其它平台呢？
https://gushitong.baidu.com/index/ab-000688  可以拿到流入流出数据？

// 查询基金
https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx?m=1&pageindex=0&pagesize=99999&key=红利低波

// 基金详细数据
https://fund.eastmoney.com/pingzhongdata/007467.js?v=20250410132534

同花顺财经
https://www.10jqka.com.cn/

大盘云图
https://52etf.site/
https://dapanyuntu.com/

界面新闻-快报
https://www.jiemian.com/lists/1324kb.html

*/


{
  /*
概念板块
https://quote.eastmoney.com/center/gridlist.html#concept_board
点击cpo进入
https://quote.eastmoney.com/bk/90.BK1128.html
点击 板块资金流向 进入 CPO概念的资金流向
https://data.eastmoney.com/bkzj/BK1128.html


  */
}

// 财联社
{
  /*
基金排行榜
https://api3.cls.cn/quote/fund/0/0?os=ios
https://api3.cls.cn/quote/fund/1/0?os=ios&sv=817&token= 白酒排行榜
/*  待用
https://www.cls.cn/quotation 行情
// 简易指数的涨幅信息
https://x-quote.cls.cn/v2/quote/a/web/stocks/basic?app=CailianpressWeb&secu_codes=sh000001,sz399001,sz399006,sh000016,sz399300,sh000905&fields=secu_code,secu_name,change,last_px,preclose_px
// 指数详细的涨幅的线
https://x-quote.cls.cn/quote/index/tlines?app=CailianpressWeb&os=web&secu_codes=sh000001,sz399001,sz399006,sh000016,sz399300,sh000905
// 指数的详细详情
https://x-quote.cls.cn/quote/stocks/basic?secu_codes=sh000001,sh603773,sz399001
// 自己根据上面摸索出来的
https://x-quote.cls.cn/quote/stocks/basic?secu_codes=sh000001,sz399001,sz399006,sh000016,sz399300,sh000905&fields=secu_code,secu_name,change,last_px,preclose_px


https://www.cls.cn/finance “看盘”里面的涨幅异动时间轴，当天板块的异动
https://www.cls.cn/v3/transaction/anchor?app=CailianpressWeb&cdate=2026-02-05

板块
https://api3.cls.cn/share/plate/v1/all
获取对应版块涨幅
https://x-quote.cls.cn/quote/plate/refresh?app=cailianpress&channel=0&secu_codes=cls80620
https://x-quote.cls.cn/quote/plate/refresh?secu_codes=cls80056,cls80620

财联社-主题基金榜单
https://x-quote.cls.cn/v2/quote/a/plate/fund_heat_by_shzq?days=1&way=change&num=50&rever=0
https://x-quote.cls.cn/v2/quote/a/plate/fund_heat_by_shzq?days=1&way=change&num=1000&rever=0
https://x-quote.cls.cn/v2/quote/a/plate/fund_heat_by_shzq?days=10&way=change&num=50&rever=0

https://x-quote.cls.cn/v2/quote/a/stock/ranking/topics?app=cailianpress

https://api3.cls.cn/quote/fundplate?sv=817&os=ios&fundTypeCode=cls82517



  */
}



function generateSecureRandomString(length) {
    const array = new Uint8Array(length); // 创建一个足够长的 Uint8Array
    window.crypto.getRandomValues(array); // 填充随机值
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(''); // 将 Uint8Array 转换为十六进制字符串
}

const secureRandomString = generateSecureRandomString(16); // 生成一个长度为 32 的十六进制字符串（因为是两个十六进制字符表示一个字节）
console.log(secureRandomString); // 输出类似 "7f2c198d3b2a5f4e87b1d23c91eb5678" 的字符串


function safeUUID() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  if (window.crypto?.getRandomValues) return generateUUID();
  // Ultimate fallback (not crypto-secure)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
  });
}

function generateUUID() {
  // 1. Generate 16 cryptographically secure random bytes
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);

  // 2. Set version (4) and variant bits per RFC 4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40;  // Version 4 (0100)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;  // Variant 10xx

  // 3. Format as UUID string
  const hex = Array.from(bytes, b =>
    b.toString(16).padStart(2, '0')
  ).join('');

  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}
console.log(generateUUID())
console.log(generateUUID())
console.log(generateUUID())
console.log(generateUUID())





function secureRandomInt(min, max) {
  const range = max - min + 1;
  // 创建一个足够大的随机数，以减少模偏差
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);

  return min + (randomValue[0] % range);
}
console.log(secureRandomInt(1, 6));   // 模拟安全的骰子
console.log(secureRandomInt(1000, 9999)); // 生成一个安全的 4 位验证码

