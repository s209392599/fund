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

const info = {
  type_arr: [],// 基金类型的数组
  write_arr: [],// 要写入的数据
};

async function getFundcodeSearch() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);
    // console.log('基金总数',fundArray.length);
    // let etf_arr= [];

    fundArray.forEach((item) => {
      let fund_code = item[0]; // 基金代码
      let fund_name = item[2]; // 基金名称
      let fund_type = item[3]; // 基金类型

      let flag_1 = noText.some((item) => fund_name.includes(item));
      let flag_2 = noFundCode.some((item) => fund_code.includes(item));
      flag_1 = false;
      flag_2 = false;

      let endsArr = ['ETF', 'ETF(QDII)','(QDII-ETF)'];
      let flag_3 = endsArr.some((item) => fund_name.endsWith(item));// 不以ETF结尾
      if(!flag_1 && !flag_2 && !flag_3) {
        info.write_arr.push([fund_code, fund_name, fund_type]);
      }else{
        // etf_arr.push({
        //   fund_code: fund_code || '',
        //   fund_name: fund_name || '',
        //   fund_type: fund_type || '',
        // });
      }

      if (!info.type_arr.includes(fund_type)) {
        info.type_arr.push(fund_type);
      }
    });
    // console.log('筛选后',info.write_arr.length);
    // console.log(`筛选掉 ${fundArray.length - info.write_arr.length} 个基金`);

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
    // 写入ETF
    // fs.writeFileSync(
    //   path.join(__dirname, 'etf.json'),
    //   JSON.stringify(etf_arr, null, 2),
    //   'utf8'
    // );
    // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  } catch (err) {
    console.log('err => ', err);
  }
}
getFundcodeSearch();
// module.exports = { getFundcodeSearch };
