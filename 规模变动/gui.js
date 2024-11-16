// 规模变动  https://fundf10.eastmoney.com/gmbd_017838.html
const fetch = require('node-fetch');

var code = '400030';
// var code = '007220';
// let u = `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jzcgm&code=${code}&rt=0.5640579564830954`;
let u = `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jzcgm&code=${code}`;

function realTimeInformation(str) {
  if (str.startsWith('var jzcgm_apidata=')) {
    str = str.slice(18);
  }
  // if (str.endsWith(');')) {
  //   str = str.substring(0, str.length - 2);
  // }
  return str;
}

fetch(u, {
  headers: {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'sec-ch-ua':
      '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'script',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-origin',
  },
  referrer: 'https://fundf10.eastmoney.com/gmbd_017838.html',
  referrerPolicy: 'strict-origin-when-cross-origin',
  body: null,
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
})
  .then((res) => res.text())
  .then((res) => {
    // var resultData = res.resultData || {};
    // var datas = resultData.datas || {};
    let data = realTimeInformation(res);
    let obsData = JSON.parse(data);
    console.log(`a001.js 71 [datas]`, obsData.length, obsData);
    // console.log(`a001.js 71 [datas]`, datas.purchaseRule.purchaseProcess);
  })
  .catch((err) => {
    console.log(`a001.js 73 [err]`, err);
  });
