const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码

// 包含的关键词
var keyword_arr = ['红利'];
// 不要的基金类型关键词
var noFundType = ['债券', '货币', '指数'];
// 不以什么结尾
var noEndWith = ['A', 'ETF', '(后端)'];

var keyword_len = keyword_arr.length;
const info = {
  search_data: [],
  filter_code: [], // 中间数组
  filter_data: [], // 过滤后的数据
};

async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);
    info.search_data = fundArray;
    console.log(`一共有${fundArray.length}个基金`);
    filter_fn();
  } catch (err) {
    console.log('err => ', err);
  }
}
queryResilienceInfo();

function filter_fn() {
  // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  let all_fund_len = info.search_data.length;
  for (let i = 0; i < all_fund_len; i++) {
    let item = info.search_data[i];
    let fund_code = item[0]; // 基金代码
    let fund_name = item[2]; // 基金名称
    let fund_type = item[3]; // 基金类型
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
    info.filter_code.push(item[0]);
    info.filter_data.push({
      fund_code: item[0],
      fund_name: item[2],
      fund_type: item[3],
    });
  }
  console.log(`过滤后一共有${info.filter_data.length}个基金`);
  fs.writeFileSync(
    './data/filter.json',
    JSON.stringify(info.filter_data, null, 2)
  );
}

/*
["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
["970212","ZXJTYX12GYCYQZQC","中信建投悠享12个月持有期债券C","债券型-混合一级","ZHONGXINJIANTOUYOUXIANG12GEYUECHIYOUQIZHAIQUANC"]
async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    // 将字符串转换为数组
    const fundArray = JSON.parse(arrayStr);
    const arr = fundArray.map(v => `${v[0]} | ${v[2]} | ${v[3]}`);
    // 写入JSON文件
    fs.writeFileSync('fund.json', JSON.stringify(arr, null, 2));
  } catch (err) {
    console.log('err => ', err);
  }
}
queryResilienceInfo();
*/
