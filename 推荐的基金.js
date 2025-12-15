/*
富国恒生红利ETF联接C(019261)
中欧红利优享混合C(004815)
易方达恒生红利低波ETF联接C(021458)
万家中证港股通央企红利ETF联接C(023573)
摩根标普港股通低波红利指数A(005051)
中证国企红利指数的股息率为6.38% 看看对应的基金
华宝标普港股通低波红利ETF、长城中证红利低波100ETF两只红利低波ETF
https://fund.eastmoney.com/513630.html?spm=search
https://danjuanfunds.com/funding/019261  看看有没有可以摘录的
比如跟踪中证红利低波动指数的红利低波动ETF（563020），跟踪恒生港股通高股息低波动指数的恒生红利低波ETF（159545），都是高股息+低波动，双重因子筛选出来的指数，前者是A股指数，后者是港股指数。
这时候，假如你同时持有红利价值ETF（563700）、恒生红利低波ETF（159545）和红利低波动ETF（563020），就有机会每个月都获得分红。因为从下图所示的分红评价安排来看，这三只ETF分红评价节奏刚好错开。
ROE？ 基金怎么看这个，有对应的基金吗
沪港深红利低波
红利成长类？
下面重要基金的研究
基金分类的补充，  怎么定期来查询新发行的基金(有没有倒计时统计的那种)  看下支付宝里面的 指数+，它的主题还是不错的
红利基金的分析、现在持有的支付两只基金是否有大重叠？  红利100季度分红？ 中证红利还是中证100真的强悍？做一个对比

合并分类，比如好几个基金，例如债券投资相同的合并在一起，红利的合并在一起

港股通红利 高股息的
红利质量ETF
中证红利ETF
中证全指红利质量ETF

考虑下 自由现金流、恒生科技  这两个是否替换暂时的红利基金007467？
考虑哪些基金做及时的平衡战术？

或者说 美股和红利做一个平衡，每个都从定投30块钱开始？
南方恒生科技QDII 这个能不能有个替换？主要是4点比较恶心

*/

/*
工业富联股票
https://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=1.601138&imageType=KL
https://webquotepic.eastmoney.com/GetPic.aspx?nid=0.002475&imageType=RJY

https://push2.eastmoney.com/api/qt/ulist/get?cb=jQuery37109659831859397111_1761024593932&fltt=1&invt=2&fields=f1%2Cf2%2Cf3%2Cf4%2Cf12%2Cf13%2Cf14%2Cf152&secids=1.000001%2C0.399001%2C0.399006%2C1.000680%2C0.899050&ut=8dec03ba335b81bf4ebdf7b29ec27d15&pn=1&np=1&dect=1&pz=20&_=1761024593962

https://quote.eastmoney.com/stockhotmap/api/getquotedata?quotedata_hash=5cebd23355e1c09e60989b076d925e3fa7db2451

https://quote.eastmoney.com/concept/sh601138.html

https://quote.eastmoney.com/sh515120.html 创新药的ETF
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=1.515120
https://so.eastmoney.com/web/s?keyword=515120



*/

/*
每天00点 执行copy公共数据到服务器的位置；另外需要一个接口进行数据同步
周 月 季 6个月 交叉涨幅靠前的

http://150.158.175.108:9005/index.html  后台管理界面
http://150.158.175.108:9000 基金前台页面

https://github.com/kubero-dev/ladder  开源的网页抓取查看工具。用户输入网址，它会自动将网页抓取展示出来。

如果长时间不操作出现屏保 或者 出现登录界面保护隐私，可好？

加入操作历史的查询；只保留最近的50条；

https://lc.jr.jd.com/finance/funddetail/home/?fundCode=000844  不可买

SELECT fund_code, fund_name, fund_type_name, no_keyword, is_fundgz, is_sale,is_allow,no_allow_reason,jd_totalAsset
FROM fund
WHERE (no_keyword = 'y' OR no_keyword IS NULL)
  AND (is_fundgz = 'y' OR is_fundgz IS NULL)
  AND (is_sale = 'y' OR is_sale IS NULL)
  AND (is_allow = 'y' OR is_allow IS NULL)
  AND (fund_type_name NOT LIKE '%债%' OR fund_type_name IS NULL)
  AND (fund_type_name NOT LIKE '%固收%' OR fund_type_name IS NULL)
  AND (fund_type_name NOT LIKE '%货币%' OR fund_type_name IS NULL)
  AND RIGHT(fund_name, 1) != 'A'
  AND (jd_totalAsset IS NULL OR CAST(jd_totalAsset AS DECIMAL(18, 2)) >= 100000000);




SELECT *
FROM fund
WHERE is_fundgz = 'y'
  AND is_fundgz IS NOT NULL
  AND no_keyword = 'y'
  AND no_keyword IS NOT NULL
  AND is_sale = 'y'
  AND is_sale IS NOT NULL
  AND RIGHT(fund_name, 1) != 'A';

SELECT *
FROM fund
WHERE is_fundgz = 'y'
  AND no_keyword = 'y'
  AND is_sale = 'y'
  AND RIGHT(fund_name, 1) != 'A'
  AND UPPER(fund_type_name) NOT LIKE '%债%';




预览界面 添加过往基金、华夏5G、中航等


搜索优化：
搜索的时候假如 基金数据不是今天更新的再去更新
或者 当天只更新 基金类型为某一类的再去更新
或者 大家购买的基金数据再去更新

https://fund.eastmoney.com/trade/xf.html 新发基金
苏新上证科创综指增强C(023938)  类似的科创综指数找一找，抖音博主推荐收益类型的

夏普比率 这个要不要收集数据？
创金合信新材料新能源股票C(011143)

[近一周，近一月，近3月]的收益    基金规模，手续费，持有人结构，成立时长，前十持仓占比，过去一年分红，修复天数
最大回撤、基金经理、换手率 万万


管理后台的直接换个项目来做，单独去部署，包括公共基金维护
接口的数据统计，哪个邮箱 什么ip，访问的什么接口，什么请求参数

下面的特色榜单之类的，要不要每天做个邮件通知？ 还是群通知？
https://channel.jr.jd.com/data-ranking/home/?jrcontainer=h5&jrlogin=false&channel=bd_rank_rebound_leader
*/


/* 独立涨幅表（推荐）
-- 主表（基金基本信息）
CREATE TABLE fund_basic (
    fund_id          VARCHAR(20) PRIMARY KEY,  -- 基金代码
    fund_name        VARCHAR(100),
    create_date      DATE,
    other_static_info TEXT
);

-- 涨幅表（动态指标）
CREATE TABLE fund_growth (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    fund_id     VARCHAR(20) NOT NULL,          -- 关联基金
    period_type ENUM('1周','1月','3月','6月','1年','3年','5年','今年','成立') NOT NULL,
    avg_value   DECIMAL(10,2),                 -- 同类平均涨幅
    rate        DECIMAL(10,2),                 -- 本基金涨幅
    rank        VARCHAR(20),                   -- 排名（如"230/2152"）
    level       TINYINT,                       -- 等级（1=优秀,2=良好...）
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_fund_period (fund_id, period_type),  -- 防止重复插入
    FOREIGN KEY (fund_id) REFERENCES fund_basic(fund_id)
);

-- 查询某基金近1年表现
SELECT * FROM fund_growth
WHERE fund_id = '018561' AND period_type = '1年';

-- 统计所有基金"近1月"平均涨幅
SELECT AVG(rate) FROM fund_growth
WHERE period_type = '1月' AND level = 1;  -- 仅优秀基金

*/


/*  宽表（主表包含所有涨幅字段）
CREATE TABLE fund_wide (
    fund_id          VARCHAR(20) PRIMARY KEY,
    fund_name        VARCHAR(100),
    -- 涨幅字段
    week_avg         DECIMAL(10,2),
    week_rate        DECIMAL(10,2),
    week_rank        VARCHAR(20),
    week_level       TINYINT,
    month_avg        DECIMAL(10,2),
    month_rate       DECIMAL(10,2),
    month_rank       VARCHAR(20),
    month_level      TINYINT,
    -- ...其他周期字段
    update_time      DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

/*
017836
永赢智选回报混合C 022365
021605
024861
004815

*/

/*
红利或者股票型：
{ code: '007467', name: '华泰柏瑞中证红利低波C' },
{ code: '019260', name: '富国恒生红利ETF联接A' },
{ code: '020989', name: '南方恒生科技指数发起C' },
{ code: '023918', name: '华夏国证自由现金流C' },
{ code: '023521', name: '博时上证科创板人工智能ETF发起式联接C' },
{ code: '020973', name: '易方达机器人ETF联接C' },

量化：
{ code: '018561', name: '中信保诚多策略C' },// 30天
{ code: '020726', name: '建信灵活配置混合C' },// 30天
{ code: '002834', name: '华夏新锦绣混合C' },// 30天
{ code: '016858', name: '国金量化多因子股票C' },// 30天
{ code: '018729', name: '华夏智胜新锐股票C' },// 30天
{ code: '023350', name: '诺安多策略混合C' },// 30天
德邦鑫星价值灵活配置混合C(002112)
中航机遇领航混合发起C(018957)

医药：
华安医药生物股票发起式C(022691)

云计算：
华泰柏瑞中证沪港深云计算产业ETF发起式联接C(019331)
东财云计算增强C(012322)
汇添富中证沪港深云计算产业ETF联接C(014544)

通信：
东财通信C(008327)
博时中证全指通信设备指数发起式C(020692)
天弘中证全指通信设备指数发起C(020900)
富国中证通信设备主题ETF发起式联接C(021934)
华夏中证5G通信主题ETF联接D(023765)

红利低波：
008115-天弘中证
021551-博时中证
007467-华泰柏瑞中证红利低波C
008164-南方红利低波

核能:
永赢制造升级智选混合发起C(024203)
华富天鑫灵活配置混合C(003153)

风电设备/新能源：
前海联合泳隆混合C (007040)  主要投资风电产业链（如电缆、塔筒、主机）

深海科技：
永赢启源混合发起C(016561)

美股方向推荐：
华宝纳斯达克精选股票发起式(QDII)C(017437)
南方纳斯达克100指数发起(QDII)A(016452)
宝盈纳斯达克100指数发起(QDII)A人民币(019736)

CPO：
财通成长优选混合C(021528)

芯片：
汇添富上证科创板芯片ETF发起式联接C(020629)

消费：
景顺长城恒生消费ETF联接(QDII)C(019103)
嘉实中证主要消费ETF发起联接C(009180)


光伏：
无



债券类推荐：
006980-国寿安保泰恒纯债债券
016870-景顺长城稳健增益C

债券类其它5+推荐：
007540-华泰保兴安悦债券A
007584-鹏华丰鑫债券A

http://150.158.175.108:9999/preview.html 最新的基金涨幅预览地址哈

024195-永赢国证商用卫星通信产业ETF发起联接C 有通信和商业航天
015790-永赢高端装备智选混合发起C 这个商业航天

国泰国证航天军工指数(LOF)C(015599)
*/



/*
可以看到很多数据
https://fund.eastmoney.com/pingzhongdata/019260.js?v=20250724153651

实时涨幅
https://fundgz.1234567.com.cn/js/019260.js
https://fundgz.1234567.com.cn/js/019260.js?rt=1753342851359

https://image.sinajs.cn/newchart/v5/fundpre/min_s/008164.gif 涨幅

https://basic.10jqka.com.cn/JPZV30/ 可以按这个展示格式扣下数据

买卖规则
https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"515450","orderLimit":"","channel":"9"}


*/

/*
从下面读取 投资策略中 有量化
http://fundf10.eastmoney.com/jbgk_018561.html
*/

/*
中央汇金系列：
华泰柏瑞沪深300ETF(510300) 场内交易
华泰柏瑞沪深300ETF联接A(460300)
华泰柏瑞沪深300ETF联接C(006131)
华泰柏瑞沪深300ETF联接I(022699)
华泰柏瑞沪深300ETF联接Y(022948)

华夏上证50ETF(510050) 场内交易
华夏上证50ETF联接A(001051)
华夏上证50ETF联接C(005733)
华夏上证50ETF联接Y(022959)

医药相关：
国泰国证疫苗与生物科技ETF发起联接C(017186)
*/

/*
其它关注：
景顺长城中证港股通科技ETF发起联接C(016496)
广发中证港股通非银ETF发起式联接C(020501)
富国中证AAA科技创新公司债ETF(159200) -- 场内交易
嘉实全球产业升级股票发起式(QDII)A(017730)
嘉实全球产业升级股票发起式(QDII)C(017731)
富国全球消费精选混合(QDII)人民币C(012062)
永赢科技智选混合发起C(022365)
易方达标普信息科技指数(QDII-LOF)A(人民币)(161128)
华夏中证机器人ETF发起式联接C(018345)
*/

/*

https://saithink.top/guide/demo.html 模板网站

  http://j4.dfcfw.com/charts/pic6/008087.png?v=1754900040433
  https://image.sinajs.cn/newchart/v5/fund/nav/ss/008087.gif?v=1754899979474
  008087要进入到监控

  宝盈转型动力混合C(015389)  进入量化候选：2025年08月12日14:57:23

  016531 - 碳中和
  015389 - 进入候选

  银华中证5G通信主题ETF联接A(008889)
  银华中证5G通信主题ETF联接C(010524)

  华夏中证5G通信主题ETF联接A(008086)
  华夏中证5G通信主题ETF联接D(023765)

  东财互联网C(012372) 适合到一定为止，但是是否和红利类的重合？


  qq邮件里面怎么才能渲染出来 后来才请求的内容 比如018561的实际涨幅呢？还是在服务端先整理好

  electron的学习
  uniapp-开发鸿蒙开发
  还有专门的鸿蒙开发
  wasm开发  WebAssembly
  vue源码学习
  开发模式的学习
  开始刷算法
  切片上传和多个大文件下载
  负载均衡
  性能监听、优化、错误上传
  canvas、svg绘制图形学习ç
  threejs、d3等的学习
  绘制流程图那些插件的学习
  wobworker的学习
  react和angular的学习
  ssr、SSG、ISR
  加密
  WebSQL
  WebSocket 断线重连、心跳、鉴权、房间管理、消息类型  Node.js +Socket.io可以模拟一下
  new Event( 自定义事件
  GPU
  GC
  输入网址到页面加载  看下语雀的整理
  grid布局
  n8n 自动工作流
  微应用
  WebContainer
  curl 的用法整理
  浏览器指纹
  MQTT协议
  OTA  longcat上搜索一下
  https://mp.weixin.qq.com/s/_lN1Ml0E9jGdNyVtFVeRtw 尝试原生写法和库的写法，能不能自己封装？
  cheerio


  next
  nuxt
  wss协议
  uniapp
  taro学习一下
  各种数据库的使用  nodejs-进行链接试试
  反编译

  张燕辉的学习笔记还在吗？

  虚拟币交易的学习、开发
  学一点java
  学python
  学rust

  /Users/guokun/Desktop/chromeDownFile/echarts-custom-series-main 再学习下
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
/*

// 获取用户的json数据
const getUserJson = () => {
  const filePath = path.join(__dirname, '../../data/base/user.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileContent);
  return jsonData;
};
// 存储用户的json数据
const updateUserJson = (newJsonData) => {
  const filePath = path.join(__dirname, '../../data/base/user.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(newJsonData, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.log('err', err);
    return false;
  }
};

// 获取 标准基金 数据
const getPublicFundJson = () => {
  const filePath = path.join(__dirname, '../../data/base/standard_fund.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileContent);
  return jsonData;
};
// 更新 标准基金 数据
const updatePublicFundJson = (newJsonData) => {
  const filePath = path.join(__dirname, '../../data/base/standard_fund.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(newJsonData, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.log('err', err);
    return false;
  }
};

// 定义一个GET示例请求
router.get('/testget', (req, res) => {
  const content = req.query.content || '';
  res.send({
    code: 200,
    msg: '成功',
    data: [content || '没有传递参数哦'],
  });
});

// 定义一个POST示例请求
router.post('/testpost', (req, res) => {
  console.log('req.body', req.body);
  const content = req.body.content || '';
  res.send({
    code: 200,
    msg: '成功',
    data: [content || '没有传递参数哦'],
  });
});


*/
