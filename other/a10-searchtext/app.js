const fetch = require('node-fetch');
// 量化、策略、灵活、因子、增强、绝对收益、动量、成长、趋势、绩优、（永赢）智选、优选
var keyword_arr = [
  '量化',
  '策略',
  '灵活',
  '因子',
  '增强',
  '绝对收益',
  '动量',
  '成长',
  '趋势',
  '绩优',
  '智选',
  '优选',
];
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
    // 将字符串转换为数组
    const fundArray = JSON.parse(arrayStr);
    info.search_data = fundArray;
    console.log(`一共有${fundArray.length}个基金`);
    fenlei();
  } catch (err) {
    console.log('err => ', err);
  }
}
queryResilienceInfo();

function fenlei() {
  // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  info.search_data.forEach((item) => {
    let fund_name = item[2];
    for (let i = 0; i < keyword_len; i++) {
      let flag_1 = fund_name.indexOf(keyword_arr[i]) !== -1;// 基金名称中包含关键词
      let flag_2 = !info.filter_code.includes(item[0]);// 基金代码不在过滤数组中
      if (flag_1 && flag_2) {
        info.filter_code.push(item[0]);
        info.filter_data.push([item[0], item[2], item[2]]);
        break;
      }
    }
  });
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
