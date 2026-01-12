// 过滤可买的基金
const info = {
  tableList: [],
};



const filterBuyableFunds = async (funds) => {
  if(funds.length === 0) {
    return [];
  }
  for(let i=0; i<funds.length; i++) {
    let item = funds[i];
    let fund_code = item.fund_code;

    // 获取基本信息，删除不可买、删除小于1亿、删除1-3-6月排名靠后
    // 获取买卖费率，删除不可定投、删除卖出限制超过30天、删除综合费率大于2、删除买入费率是多段的
    // 获取修复数据，删除最大回撤超过25%的、删除修复天数超过120天的
    // 获取预测涨幅的，删除没有预测涨幅数据的
  }
  return info.tableList;
};

module.exports = { filterBuyableFunds };
