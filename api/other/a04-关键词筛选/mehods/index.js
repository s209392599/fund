const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../../utils/noFundCode.js'); // 排除的基金代码

// 获取所有基金代码
async function queryResilienceInfo(search_data) {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);

    // 清空原数组并添加新数据，这样会修改原始数组
    search_data.length = 0; // 清空数组
    const mappedData = fundArray.map(v => {
      return {
        fund_code: v[0],
        fund_name: v[2],
        fund_type: v[3],
      }
    });

    search_data.push(...mappedData); // 将新数据推入原数组
    console.log(`一共有${fundArray.length}个基金需要过滤`);
  } catch (err) {
    console.log('err => ', err);
  }
}

async function filter_keywords(obj) {
  let filter_data = obj.filter_data || [];
  const {
    keyword_arr = [],// 包含的关键词
    noFundType = [],// 不要的基金类型关键词
    noEndWith = [],// 不以什么结尾
    extraFundNameArr = [],// 额外去除的关键词或者基金名称
    extraFundCodeArr = [],// 额外去除的基金代码
    extraAddFundArr = [],// 额外添加的基金代码
  } = obj;
  // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  let newArr = [];
  let all_fund_len = filter_data.length;
  for (let i = 0; i < all_fund_len; i++) {
    let item = filter_data[i];
    let fund_code = item.fund_code; // 基金代码
    let fund_name = item.fund_name; // 基金名称
    let fund_type = item.fund_type; // 基金类型
    // 需要包含 量化、策略、灵活、因子、增强、绝对收益、动量、成长、趋势、绩优、智选、优选、精选
    if (!keyword_arr.some((v) => fund_name.includes(v))) {
      continue;
    }
    // 基金类型中不能有货币、债券
    if (noFundType.some((v) => fund_type.includes(v))) {
      continue;
    }
    // 不能以 A、ETF、(后端) 结尾
    if (noEndWith.some((v) => fund_name.endsWith(v))) {
      continue;
    }
    // 不能包含 noText 中的关键词
    if (noText.some((v) => fund_name.includes(v))) {
      continue;
    }
    // 不能包含 noFundCode 中的基金代码
    if (noFundCode.includes(fund_code)) {
      continue;
    }
    // 额外去除的关键词或者基金名称
    if (extraFundNameArr.some((v) => fund_name.includes(v))) {
      continue;
    }
    // 额外去除的基金代码
    if (extraFundCodeArr.includes(fund_code)) {
      continue;
    }

    newArr.push({
      fund_code: item.fund_code,
      fund_name: item.fund_name,
      fund_type: item.fund_type,
    });
  }
  newArr = newArr.concat(extraAddFundArr);// 额外添加的基金

  // 修改原始数组的内容
  filter_data.length = 0;
  filter_data.push(...newArr);
  console.log(`符合关键词关键词的有${newArr.length}个基金`);
}


// 获取买卖费率
async function getFundTradeRulesPageInfo(fund_code) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};

    return datas;
  } catch (err) {
    console.log('error => ', err);
    return null;
  }
}

function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str;
}
// 获取基金实时涨幅
async function getFundGz(fundCode) {
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fundCode}.js?rt=${+new Date()}`;
    let response = await fetch(u);
    const res = (await response.text()) || {};
    let str = realTimeInformation(res);
    let obsData = JSON.parse(str || '{}');
    return obsData.hasOwnProperty('gszzl');
  } catch (err) {
    return false;
  }
}
// 获取京东金融基本信息
async function getJingdongBaseInfo(fundCode) {
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fundCode}","itemId":"","clientVersion":"","channel":"9"}`;
    let response = await fetch(u);
    const res = (await response.json()) || {};
    let resultData = res.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}

// 获取京东金融回撤修复
async function getFundDetailChartPageInfo(fund_code) {
  try {
    let base_url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?`;
    let u = `${base_url}reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}


// 导出所有方法
module.exports = {
  queryResilienceInfo, // 获取所有基金代码
  filter_keywords, // 过滤关键词
  getFundGz, // 获取基金实时涨幅
  getJingdongBaseInfo, // 获取京东金融基本信息
  getFundDetailChartPageInfo, // 获取京东金融回撤修复
  getFundTradeRulesPageInfo, // 获取基金买卖费率
};
