const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('../utils/noText.js'); // 排除的关键词
const noFundCode = require('../utils/noFundCode.js'); // 排除的基金代码
console.log('noText',noText)
console.log('noFundCode',noFundCode)
/*
https://fund.eastmoney.com/data/fundranking.html
pn: 请求多少条数据，应该是page number
pi: 页码
sd: start date  后面的自定义搜索
ed: end date

*/

const pn = 1000;
// 日增长率
const url_1 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=rzdf&st=desc&sd=2024-09-28&ed=2025-09-28&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=0.1487653330314005`;
// 周
const url_2 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&sd=2024-07-28&ed=2025-09-28&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=0.905523524272557`;
// 月
const url_3 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=1yzf&st=desc&sd=2024-07-28&ed=2025-09-28&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=0.8641197374389376`;

const pageObj = {
  data_1: [],// 日增长率
  data_2: [],// 周增长率
  data_3: [],// 月数据
}

function getData(url,key){

}


fetch(
  url_3,
  {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua':
        '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'script',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'same-origin',
      referer: 'https://fund.eastmoney.com/data/fundranking.html',
    },
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }
)
  .then((res) => res.text())
  .then((res) => {
    // console.log('Response Text:', res);
    // fs.writeFileSync(path.join(__dirname, 'a1.txt'), res);

    const match = res.match(/var\s+rankData\s*=\s*(\{[\s\S]*?\});/);
    if (match) {
      const rankData = eval('(' + match[1] + ')');
      let arr_1 = (rankData.datas || []).filter(item => {
        const [code, name] = item.split(',');
        if (name.endsWith('A')) return false;
        if (noText.some(kw => name.includes(kw))) return false;
        if (noFundCode.some(kw => code.includes(kw))) return false;
        return true;
      });
      rankData.datas = arr_1;
      fs.writeFileSync(
        'rankData.json',
        JSON.stringify(rankData, null, 2),
        'utf8'
      );
    }

    // const jsonString = res.substring(res.indexOf('{'), res.lastIndexOf('}') + 1);
    // const jsonObject = JSON.parse(jsonString);
  })
  .catch((err) => {
    console.error('Error fetching fund data:', err);
  });
