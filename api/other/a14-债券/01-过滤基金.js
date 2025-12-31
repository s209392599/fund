const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码

const minRate = 2; // 年收益最低要求
let ewai_arr = ['可转债'];// 不要可转债等

/* 获取天天基金
https://fund.eastmoney.com/trade/zq.html
*/
async function getPageMutilDataNotLogin() {
  let productList = [];

  try {
    // 全部
    // let u = `https://fund.eastmoney.com/data/fundtradenewapi.aspx?ft=zq&sc=1n&st=desc&pi=1&pn=3000&cp=&ct=&cd=&ms=&fr=&plevel=&fst=&ftype=&fr1=&fl=0&isab=1`;
    // 长期纯债
    let u = `https://fund.eastmoney.com/data/fundtradenewapi.aspx?ft=zq&sc=1n&st=desc&pi=1&pn=3000&cp=&ct=&cd=&ms=&fr=041&plevel=&fst=&ftype=&fr1=&fl=0&isab=1`;

    let response = await fetch(u, {
     "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "script",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://fund.eastmoney.com/trade/zq.html",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    const str_1 = (await response.text()) || {};
    const str_2 = str_1.slice(15);
    const str_3 = str_2.slice(0, str_2.length - 1);

    const formattedStr = str_3
      .replace(/(\w+):/g, '"$1":') // 将键用双引号包裹
      .replace(/'/g, '"') // 将单引号替换为双引号
      .replace(/([a-zA-Z_]\w*)\s*:\s*\[/g, '"$1":[') // 确保数组键正确
      .replace(/;/g, ','); // 替换分号为逗号（如果有的话）

    // 解析为对象
    let obj;
    try {
      obj = JSON.parse(formattedStr);
    } catch (error) {
      obj = { datas: [] };
      console.error('JSON解析错误:', error);
    }
    let len_1 = obj.datas.length || 0;
    // console.log('len_1 => ', len_1);
    fs.writeFileSync('./data/objdatas.json', JSON.stringify(obj.datas, null, 2));

    let num_bumanzu = 0;// 不满足的个数
    for(let i = 0; i < len_1; i++){
      const v = obj.datas[i];
      const itemArr = v.split('|');
      // console.log('itemArr',itemArr);
      const fund_code = itemArr[0];
      const fund_name = itemArr[1];

      if(noText.some((v) => fund_name.includes(v))){
        num_bumanzu++;
        continue;
      }
      // 过滤掉可转债等
      if(ewai_arr.some((v) => fund_name.includes(v))){
        num_bumanzu++;
        continue;
      }
      if(noFundCode.includes(fund_code)){
        num_bumanzu++;
        continue;
      }
      // 过滤掉年收益小于minRate的基金
      const rate = itemArr[10] || 0;
      if(Number(rate) < minRate){
        num_bumanzu++;
        continue;
      }
      const r_6 = itemArr[9] || 0;
      if(Number(r_6) < minRate/2){
        num_bumanzu++;
        continue;
      }

      productList.push({
        fund_code,
        fund_name,
        rate: rate,
      });
    }

    console.log('筛选 => ', `${len_1} - ${num_bumanzu} = ${len_1 - num_bumanzu}个  productList: ${productList.length}个`);
  } catch (err) {
    console.log('err => ', err);
  } finally {
    fs.writeFileSync('./data/filter.json', JSON.stringify(productList, null, 2));
  }
}

getPageMutilDataNotLogin();
