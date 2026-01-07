/*

科创创业：2026年01月07日11:21:20
013305,012895,012908,013299,013303,013316,017413
[{"fund_code":"013305","fund_name":"易方达中证科创创业50ETF联接C","fund_type":"指数型-股票"},{"fund_code":"012895","fund_name":"天弘中证科创创业50ETF联接C","fund_type":"指数型-股票"},{"fund_code":"012908","fund_name":"鹏扬中证科创创业50ETF联接C","fund_type":"指数型-股票"},{"fund_code":"013299","fund_name":"南方中证科创创业50ETF联接C","fund_type":"指数型-股票"},{"fund_code":"013303","fund_name":"招商中证科创创业50ETF联接C","fund_type":"指数型-股票"},{"fund_code":"013316","fund_name":"嘉实中证科创创业50ETF发起联接C","fund_type":"指数型-股票"},{"fund_code":"017413","fund_name":"创金合信中证科创创业50指数增强C","fund_type":"指数增强-股票"}]

017437-华宝纳斯达克精选股票发起式
003595-长盛盛崇灵活配置混合C
010365-鹏华中证香港银行指数
007722--天弘标普500发起C
008254--华宝致远混合C
014002--浦银安盛全球智能科技C
016702--银华海外数字经济量化选股混合C
017437--华宝纳斯达克精选股票发起式C
017654--创金合信全球芯片产业股票发起C
017731--嘉实全球产业升级股票发起式C

016870-景顺长城稳健增益债券C


020973-易方达机器人ETF联接C  存为历史
019088-工银中证稀有金属主题ETF-C
创金合信全球芯片产业股票发起(QDII)C(017654)
摩根欧洲动力策略股票(QDII)C(019450)

信澳双创智选混合C(018986) 关键词双创
科创创业

008327--东财通信C
001438--易方达瑞享混合E
天弘全球高端制造混合(QDII)C(016665)

CPO：
022365-永赢科技智选混合发起C

军工：
013613--宝盈国家安全沪港深股票C


021934--富国中证通信设备主题ETF发起式联接C
021989--银河中证通信设备主题指数发起式C
008327--东财通信C
019072--嘉实国证通信ETF发起联接C
019237--广发国证通信ETF发起式联接C
008087- 华夏中证5G通信主题ETF联接C

vue-draggable-plus
import { VueDraggable } from 'vue-draggable-plus';



获取前600的基金
去除那些不要的基金(特殊字符、特定基金号)
去除A类的

近1日 前300 0.1
近1周 前300 0.3
近1月 前300 0.3
近3月 前300 0.2
近6月 前300 0.1

把基金最近的排名情况进行 一个折线图，读取进来3个月的，
基金均线的图  都读取出来，防止007467这样的，方便及时调整

基金减仓榜？连续三天前5名不可取
*/

/*
https://m.1234567.com.cn/index.html?page=jjph&tab=qb -- 全部基金排行
*/
fetch(
  'https://condition.tiantianfunds.com/condition/conditionFund/fundSelect',
  {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
    },
    referrer: 'https://m.1234567.com.cn/',
    body: 'orderField=5_1_-1&pageIndex=1&pageNum=30&pageType=5&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&abnormal=3&rankSy=1',
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  }
);

/*
https://fund.eastmoney.com/trade/hh.html#zwf_,sc_z,st_desc
*/
fetch(
  'https://fund.eastmoney.com/data/fundtradenewapi.aspx?ft=hh&sc=z&st=desc&pi=1&pn=150&cp=&ct=&cd=&ms=&fr=&plevel=&fst=&ftype=&fr1=&fl=0&isab=1',
  {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua':
        '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    referrer: 'https://fund.eastmoney.com/trade/hh.html',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }
);

/*
布林带+均线+KDJ+macd
历史推荐管理

firewall-cmd --reload  刷新防火墙
*/

/* 分红红利  2025年12月7日19:39:10
023585
022980
022951
022678
022098
022663
021962
021584
021376
020467
019261
016129
018382 观察
018388
015558
012762
008115 观察
008164
007606
007467
003025 观察

021735
021551
021458
020603
016514
007829
007760
005125

501029
*/
