/*
http://fund.eastmoney.com/allfund.html 按基金代码排序


易方达改革红利混合(001076)
华安恒生港股通中国央企红利ETF发起式联接C(020867)  替换华泰柏瑞
富国中证沪港深500ETF联接C(012276)  替换恒生科技
https://j4.dfcfw.com/charts/pic6/012276.png


电池、机器人 卖出4天份额；
纳斯达克卖出 2天份额；

020989-南方恒生科技指数C
007467-华泰柏瑞中证红利低波E
019261-富国恒生红利ETF联接C
这三个转 012276-富国中证沪港深500ETF联接C

023999-易方达上证科创板综合增强C
160424-华安创业板50ETF联接C
这两个
一半儿给022425-广发中证A500ETF联接C
一半给022365-永赢科技智选混合发起C

023521-博时上证人工智能 转 012322-东财云计算

018561-中信保诚多策略混合(LOF)C
002834-华夏新锦绣混合C
这两个转 	016858-国金量化多因子股票C

安信新价值混合C(003027)
景顺长城稳健增益债券C(016870)
跑跑好的资产，给万万和冰莹讲


https://www.bilibili.com/video/BV1JWtDeqE44/?vd_source=05a30f42f608d43de22f6db10d8c8d4d 软件讲解


https://space.bilibili.com/381896465

https://xuangu.eastmoney.com/Result?type=fund&color=w&id=xc0d67218dd193006da8&a=edit_way  条件选股
https://xuangu.eastmoney.com/?type=fund&color=w

https://cn.investing.com/funds/major-funds 英为财情
https://cn.investing.com/charts/indices-charts


https://lc.jr.jd.com/finance/funddetail/home/?fundCode=008327 京东金融详情 4个头部标签的种类，可以记录到爬取的js中去
https://lc.jr.jd.com/finance/funddetail/home/?fundCode=007467
https://lc.jr.jd.com/finance/funddetail/home/?fundCode=007540
https://lc.jr.jd.com/finance/funddetail/home/?fundCode=002112


https://space.bilibili.com/381896465  他的视频可以看下


基金排行---收集一下两个种类的不同，一个可以node-fetch
https://fund.eastmoney.com/data/fundranking.html#tall;c0;r;s1nzf;pn50;ddesc;qsd20240918;qed20250918;qdii;zq;gg;gzbd;gzfs;bbzt;sfbb
https://fund.eastmoney.com/trade/hh.html#zwf_,sc_z,st_desc
https://m.1234567.com.cn/index.html?page=jjph&tab=qb  手机端上的排行


UPDATE fund_user_collection SET
fund_code = '008087',
fund_name = 'test',
sort_order = 2,
fundgz = 2,
fund_type = 'type1',
fund_sign = '正常',
zhang_url = 'https',
point_top = 1.5,
point_down = 1.23,
fixed = 100.56,
fund_desc = '备注'
WHERE id = 1;

SELECT * FROM fund_public ORDER BY sort_order ASC;

SELECT * FROM fund_users WHERE user_name = 'boxue' AND user_password = 'qaz123..';

SELECT * FROM fund_users WHERE user_name = 'boxue' AND user_password = 'qaz123..';

https://fundgz.1234567.com.cn/js/007467.js

jd_header_tag 榜单、特色亮点、用户关注、投资方向
{"rankList":["连续5年跑赢同类 · 第9名"],"highlights":{"tagList":[],"morningstarRating":"2"},"userFocus":[],"themeNameList":["综合","免税店"]}

jd_historyPerformance 历史业绩
[
  {"avg":"0.13","rate":"-0.91","name":"近1周","rank":"3176/4354"},
  {"avg":"7.53","rate":"4.32","name":"近1月","rank":"2737/4279"},
  {"avg":"24.15","rate":"13.68","name":"近3月","rank":"3152/4019"},
  {"avg":"18.01","rate":"8.82","name":"近6月","rank":"2775/3645"},
  {"avg":"59.71","rate":"32.16","name":"近1年","rank":"2495/3020"},
  {"avg":"24.13","rate":"9.87","name":"今年以来","rank":"3474/4354"},
  {"avg":"26.69","rate":"21.93","name":"近3年","rank":"1061/1869"},
  {"avg":"155.06","rate":"194.57","name":"成立以来","rank":"25/123"}
]

jd_fundDiagnosis 综合诊断
87|57|93|84

jd_proportion 持仓分类占比
93.54|0.00|7.86|0.00|0.00

jd_holdStock 持仓明细
{
  "stock":[
    {"name":"洛阳钼业","industryName":"工业金属","ratio":"2.09%"},
    {"name":"江苏银行","industryName":"银行","ratio":"2.07%"},
    {"name":"民生银行","industryName":"银行","ratio":"1.97%"},
    {"name":"潍柴动力","industryName":"汽车零部件","ratio":"1.91%"},
    {"name":"光大银行","industryName":"银行","ratio":"1.90%"},
    {"name":"中国联通","industryName":"通信服务","ratio":"1.89%"},
    {"name":"华能国际","industryName":"电力","ratio":"1.89%"},
    {"name":"平安银行","industryName":"银行","ratio":"1.88%"},
    {"name":"三七互娱","industryName":"游戏","ratio":"1.87%"},
    {"name":"三一重工","industryName":"工程机械","ratio":"1.87%"}
  ],
  "bond":[],
  "fund":[]
}

jd_fund_archive 基金档案
{
  "establishedDateByCn":"2013年03月22日",
  "company_name":"财通基金管理有限公司",
  "fundScaleList":["0.71","0.68","0.65","0.39"],
  "instPurchaseRatio":"0",
  "purchaseRatio":"100",
  "companyManageScale":"753.33亿",
  "manageNumber":"57"
}

jd_managerInfo 基金经理
[
  {"yearPerformance":"-3.22",
  "employPerformance":"17.32",
  "employmentDate":"4年117天",
  "accessionDateDesc":"2023.01.16-至今",
  "managerName":"顾弘原",
  "accessionDate":"2年247天",
  "manageScale":"8.97亿元"}
]


other/mei_tuan/index.js 图片内容读取

// import hongli from './hongli.js';
// const newArr = hongli.map(item => {
//   let defen = 0;
//   let obj = {
//     '近1周': 5,
//     '近1月': 10,
//     '近3月': 30,
//     '近6月': 35,
//     '近1年': 20,
//   };
//   let jd_historyPerformance = item.jd_historyPerformance || [];
//   jd_historyPerformance.forEach(v => {
//     if (v.name === '近1周') {
//       defen += v.rate * obj['近1周'] * 100;
//     } else if (v.name === '今年以来') {
//       defen += v.rate * obj['近1月'] * 100;
//     } else if (v.name === '今年以来') {
//       defen += v.rate * obj['近3月'] * 100;
//     } else if (v.name === '近6月') {
//       defen += v.rate * obj['近6月'] * 100;
//     } else if (v.name === '近1年') {
//       defen += v.rate * obj['近1年'] * 100;
//     }
//   })
//   item.defen = Number(defen.toFixed(2));
//   return item;
// })

*/
