// 获取带有 货币 的基金有多少
const fetch = require('node-fetch');
async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;
    let response = await fetch(u);
    const res = await response.text() || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);// 将字符串转换为数组
    const len = fundArray.length;
    // ["004700","QHLHHYHBB","前海联合汇盈货币B","货币型-普通货币","QIANHAILIANHEHUIYINGHUOBIB"]
    console.log(`一共有${fundArray.length}个基金`);
    const arr = [];
    for(let i = 0 ;i < len;i++){
        if(fundArray[i][3].includes('货币')){
          arr.push(fundArray[i]);
        }
    }
    console.log(`货币基金有${arr.length}个`);
  } catch (err) {
    console.log('err => ', err);
  }
}
queryResilienceInfo();
