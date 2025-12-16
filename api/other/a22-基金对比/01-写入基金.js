const fs = require('fs');

const fund_arr = [
  {
    fund_code: '023918',
    fund_name: '华夏国证自由现金流ETF联接C',
  },
  {
    fund_code: '012276',
    fund_name: '富国中证沪港深500ETF联接C',
  },
  {
    fund_code: '022425',
    fund_name: '广发中证A500ETF联接C',
  },
  {
    fund_code: '020256',
    fund_name: '中欧中证机器人C',
  },
  {
    fund_code: '012863',
    fund_name: '汇添富中证电池主题ETF联接C',
  },
  {
    fund_code: '016858',
    fund_name: '国金量化多因子股票C',
  },
  {
    fund_code: '002112',
    fund_name: '德邦鑫星价值灵活配置混合C',
  },
  {
    fund_code: '024203',
    fund_name: '永赢制造升级智选混合发起C',
  },
  {
    fund_code: '020989',
    fund_name: '南方恒生科技指数C',
  },
  {
    fund_code: '017437',
    fund_name: '华宝纳斯达克精选股票发起式',
  },
  {
    fund_code: '018125',
    fund_name: '永赢先进制造智选混合发起C',
  },
  {
    fund_code: '023350',
    fund_name: '诺安多策略混合C',
  },
  {
    fund_code: '018561',
    fund_name: '中信保诚多策略混合(LOF)C',
  },
  {
    fund_code: '290014',
    fund_name: '泰信现代服务业混合',
  },
  {
    fund_code: '021991',
    fund_name: '中加专精特新量化混合C',
  },
  {
    fund_code: '020867',
    fund_name: '华安恒生红利',
  },
  {
    fund_code: '019261',
    fund_name: '富国恒生红利ETF联接C',
  },
  {
    fund_code: '003027',
    fund_name: '安信新价值混合C',
  },
  {
    fund_code: '016870',
    fund_name: '景顺长城稳健增益债券C',
  },
  {
    fund_code: '160424',
    fund_name: '华安创业板50ETF联接C',
  },
  {
    fund_code: '023999',
    fund_name: '易方达上证科创板综合增强C',
  },
  {
    fund_code: '008087',
    fund_name: '中证华夏5G',
  },
  {
    fund_code: '023521',
    fund_name: '博时上证科创板人工智能ETF联接C',
  },
  {
    fund_code: '003595',
    fund_name: '长盛盛崇灵活配置混合C',
  },
  {
    fund_code: '012322',
    fund_name: '东财云计算增强C',
  },
  {
    fund_code: '010365',
    fund_name: '鹏华中证香港银行指数(LOF)C',
  },
  {
    fund_code: '002943',
    fund_name: '广发多因子混合',
  },
  {
    fund_code: '015881',
    fund_name: '中欧小盘成长混合C',
  },
  {
    fund_code: '015790',
    fund_name: '永赢高端装备智选混合发起C',
  },
  {
    fund_code: '024195',
    fund_name: '永赢国证商用卫星通信产业ETF发起联接C',
  }
];

fs.writeFileSync(
  './data/filter.json',
  JSON.stringify(fund_arr, null, 2)
);
