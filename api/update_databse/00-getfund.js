const fetch = require('node-fetch');
const fs = require('fs');
/*
["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
["970212","ZXJTYX12GYCYQZQC","中信建投悠享12个月持有期债券C","债券型-混合一级","ZHONGXINJIANTOUYOUXIANG12GEYUECHIYOUQIZHAIQUANC"]
*/
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
