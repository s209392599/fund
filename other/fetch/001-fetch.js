const fetch = require('node-fetch');
const fs = require('fs');


/*
https://www.10jqka.com.cn/

fetch("https://news.10jqka.com.cn/app/flash/flashnews/v1/list?seq=675213881&tagId=62857", {
  "headers": {
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://www.10jqka.com.cn/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});

*/
async function fetchFundData() {
  try {

    const response = await fetch("https://news.10jqka.com.cn/app/flash/flashnews/v1/list?seq=675228198&tagId=62857", {
      headers: {
        accept: "application/json, text/plain, */*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        // 其它可选
      },
      method: "GET",
      // mode/credentials/cors 在 node-fetch 里不要用
    });

    if (!response.ok) throw new Error(`请求失败: ${response.status}`);

    const text = await response.text();
    console.log('body length', text.length, 'content-type', response.headers.get('content-type'));
    if (!text.trim()) throw new Error('服务器返回了空响应（实际 body 为空）');

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn('非 json 内容，直接保存 text');
      data = text;
    }

    fs.writeFileSync('zzz_data.json', JSON.stringify(data, null, 2));
    console.log('基金数据已保存到 fund_data.json 文件');

  } catch (error) {
    console.error('错误:', error.message);
  }
}

fetchFundData();
