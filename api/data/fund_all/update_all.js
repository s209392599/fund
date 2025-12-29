/*
每天进行基本基金的更新
*/
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
// console.log('noText', noText);
// console.log('noFundCode', noFundCode);
const hisData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');

const cur_day = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');
// 去年的今天
const diff_year = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
const year_day = CustomFn.CustomDateFtt(new Date(diff_year), 'yyyy-MM-dd');

const info = {
  type_arr: [],
  write_arr: [],
};

async function getFundcodeSearch() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);
    fundArray.forEach((item) => {
      let fund_code = item[0]; // 基金代码
      let fund_name = item[2]; // 基金名称
      let fund_type = item[3]; // 基金类型
      info.write_arr.push([fund_code, fund_name, fund_type]);
      if (!info.type_arr.includes(fund_type)) {
        info.type_arr.push(fund_type);
      }
    });
    // 写入
    fs.writeFileSync(
      path.join(__dirname, 'data.json'),
      JSON.stringify(info.write_arr),
      'utf8'
    );
    // 写入类型
    fs.writeFileSync(
      path.join(__dirname, 'type.json'),
      JSON.stringify(info.type_arr, null, 2),
      'utf8'
    );
    // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  } catch (err) {
    console.log('err => ', err);
  }
}
// getFundcodeSearch();
module.exports = { getFundcodeSearch };
