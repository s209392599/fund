// 过滤基金
const fetch = require('node-fetch');
const fs = require('fs');

let EligibleList = []; // 符合条件的基金列表

/* 获取天天基金 近1年 收益排行榜前300个 https://fund.eastmoney.com/trade/zq.html */
async function getPageMutilDataNotLogin() {
  let productList = [];
  try {
    let u = `https://fund.eastmoney.com/data/fundtradenewapi.aspx?op=ph&dt=kf&ft=zq&rs=&gs=0&sc=1nzf&st=desc&sd=2024-03-11&ed=2025-03-11&qdii=|&tabSubtype=,,053,,,&pi=1&pn=50&dx=1`;

    let response = await fetch(u, {
      headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'sec-ch-ua':
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
      },
      referrer: 'https://fund.eastmoney.com/trade/zq.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
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
    console.log(50,obj);
    productList = obj.datas.map((v) => {
      const itemArr = v.split('|');
      return {
        productCode: itemArr[0],
        productName: itemArr[1],
        rate: {
          value: (itemArr[10] || 0) + '%',
        },
      };
    });
    console.log(62,productList);
  } catch (err) {
    console.log('err => ', err);
  } finally {
    return productList;
  }
}

getPageMutilDataNotLogin();

