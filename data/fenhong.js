const fetch = require('node-fetch');
const fs = require('fs');

fetch("https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDividendPageInfo", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded",
    "priority": "u=1, i",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://lc.jr.jd.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": `reqData={"fundCode":"008164","pageNum":1,"pageSize":20,"channel":"9"}`,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(res => res.json())
  .then(data => {
    console.log(data.resultData.datas.dividendList);
    // fs.writeFile('data.json', JSON.stringify(data), (err) => {
    //   if (err) throw err;
    //   console.log('Data written to file');
    // });
  })
  .catch(err => {
    console.error(err);
  });
