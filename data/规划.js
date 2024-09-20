/*




.github/workflows/deploy.yml





------------------------------------------------- 2024年9月17日08:13:06 之前的记录
历史业绩  近1周，1月、1年.....
https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=0

历史净值
https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2

基金诊断
https://lc.jr.jd.com/fund/funddiagnosis/index/?itemId=106545

天天基金--H5详情
https://h5.1234567.com.cn/app/fund-details/?fCode=008087

var arr = [
  { "number": "400030", "name": "东方添益(随时)", "remarks": "", "notice": "" ,skuId:'106545',buy:'y'},
  { "number": "007677", "name": "蜂巢添汇(7天)", "remarks": "", "notice": "" ,skuId:'1007677',buy:'y'},
  { "number": "485119", "name": "工银信用(稳)", "remarks": "", "notice": "" ,skuId:'107337',buy:'y'},
  { "number": "485019", "name": "工银信用(稳)", "remarks": "", "notice": "" ,skuId:'107328',buy:'y'},
  { "number": "003547", "name": "鹏华丰禄(限100)", "remarks": "", "notice": "" ,skuId:'110067',buy:'y'},

  { "number": "009604", "name": "国金惠盈(7天)(限1000)", "remarks": "", "notice": "" ,skuId:'1009604'},
  { "number": "007091", "name": "东兴兴福(1年)(7月1号)", "remarks": "", "notice": "" ,skuId:'109726'},
  { "number": "009461", "name": "东方臻萃(3月)(5月6号)", "remarks": "", "notice": "" ,skuId:'111156'},
  { "number": "002988", "name": "平安鼎信(30天)", "remarks": "", "notice": "" ,skuId:'111847'},
  { "number": "007214", "name": "国泰惠丰(30天)", "remarks": "", "notice": "" ,skuId:'1007214'},
  { "number": "008728", "name": "同泰恒利(30天)", "remarks": "", "notice": "" ,skuId:'1008728'},
  { "number": "007235", "name": "广发聚利(30天)", "remarks": "", "notice": "" ,skuId:'1007235'},
  { "number": "007769", "name": "东兴兴瑞(1年)(11-11)", "remarks": "", "notice": "" ,skuId:'112288'},
  { "number": "000116", "name": "嘉实丰益(1年)(10-21)", "remarks": "", "notice": "" ,skuId:'107795'},
  { "number": "005070", "name": "长江乐丰(3月)(6-11)", "remarks": "", "notice": "" ,skuId:'1005070'},
  { "number": "006716", "name": "东方永泰(1年)(5-23)", "remarks": "", "notice": "" ,skuId:'109338'},
  { "number": "006980", "name": "国寿安保(限500)", "remarks": "", "notice": "" ,skuId:'114237'},
  { "number": "519762", "name": "交银裕通", "remarks": "", "notice": "",skuId:'108617' }
];
localStorage.setItem("info",JSON.stringify(arr));window.location.reload();



基金名称
代号
建议
近1年连涨能力
  连续最大涨幅、同类平均


历史平均收益率
6个月，1年，2年

历史盈利概率(2年)
10%↑，5%上,0-5%

历史平均收益率 写到综合数据里面
历史收益修改为 竖着的列表和横向的柱状图(同花顺那种横向的图)
后续：
1.怎么快速得到近3年的涨幅情况？
2.其它类的债券也要做下  fof的过滤、   还是数据直接切天天基金的？
3.基金的监听程序，如果下午2.40监控到某个值了，直接进行anpush的推送
4.和现在买的差异化的有哪些，现在买的跌出增长曲线范围的有哪些
5.直接进行翻版？ vite+vue3 快速整一个


统计120天内 正收益天数比率(>=0)
统计120天内 负收益>5天数比率(<=0)

记上平均收益率、6个月、1年、2年收益率  基金诊断
  getFundDiagnosisPageInfo/?skuid=106545
  https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=0
添加昨日(晚上读取今日)、周、双周、三周、月 3个月、6个月、1年、两年、3年、5年收益、成立以来   (业绩表现里面取)
  getFundHistoryPerformancePageInfo?code=005284
funcd02里面的 建议、回撤、连续最大涨幅，  加过来
交易规则里面的 买入状态、日累计限额、买入费率
  getFundTradeRulesPageInfo?code=400030  买入规则、卖出
加完给梦初说
涨跌幅，单独开一个小窗口

008799

历史收益：的 120天正收益天数
历史收益：当前价格要不要算上？ 就是当前净值
是不是要支持排序
已购买的添加不一样的颜色
同类排名进行勾选是否显示

悬浮的颜色要修改下
近半年比较突出的要写接口看下，且每个月也要是正的
编辑页面： 增加条件是否已持有
没有购买的列出来
已经买过的跌出累计了，要进行提示

007677 还有那个A的也记录到检测，这个买一点；看下支付宝偏债；或者拿京东的数据

*/
