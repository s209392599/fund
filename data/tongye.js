const fetch = require('node-fetch');
const fs = require('fs');

// https://fund.eastmoney.com/data/fundsearch.html?spm=search&key=%E5%90%8C%E4%B8%9A%E5%AD%98%E5%8D%95#key%E5%90%8C%E4%B8%9A%E5%AD%98%E5%8D%95

async function AnnualIncome(fundCode) {
  let data = {};
  try {
    let u = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx?m=1&key=同业存单&pageindex=0&pagesize=300`;

    let response = await fetch(u, {
      "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "script",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://fund.eastmoney.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    const res = await response.text() || '{}';
    console.log(res)

  } catch (err) {
    console.log('err', err);
    // console.log(`年收益--{${fundCode}}--err => `);
  }
  // console.log(`年收益--{${fundCode}}--${rate}`);
  return data;
}

// AnnualIncome();


fetch("https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx?m=1&key=%E5%90%8C%E4%B8%9A%E5%AD%98%E5%8D%95&pageindex=0&pagesize=300&_=1730696278824", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "script",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://fund.eastmoney.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then(response => response.text()).then(res => {
  console.log(JSON.parse(res).Datas.length)
}).catch(err => {
  console.log('err', err);
});
