/*
过滤交叉排名重叠的部分
*/
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('../utils/noText.js'); // 排除的关键词
const noFundCode = require('../utils/noFundCode.js'); // 排除的基金代码
console.log('noText', noText);
console.log('noFundCode', noFundCode);
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
  data_1: [], // 日增长率
  data_2: [], // 周增长率
  data_3: [], // 月数据
};

async function getData(url, key) {
  try {
    const res = await fetch(url, {
      headers: {
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        referer: 'https://fund.eastmoney.com/data/fundranking.html',
      },
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    const cur_text = await res.text();
    const match = cur_text.match(/var\s+rankData\s*=\s*(\{[\s\S]*?\});/);
    if (match) {
      const rankData = eval('(' + match[1] + ')');
      let arr_1 = (rankData.datas || []).filter((item) => {
        const [code, name] = item.split(',');
        if (name.endsWith('A')) return false;
        if (noText.some((kw) => name.includes(kw))) return false;
        if (noFundCode.some((kw) => code.includes(kw))) return false;
        return true;
      });
      pageObj[key] = arr_1.map((item) => {
        const [code, name] = item.split(',');
        return [code, name];
        // return [item[0], item[1]];
      });

      rankData.datas = arr_1;
    }
  } catch (err) {
    console.log('err', err);
  }
}

async function init() {
  await getData(url_1, 'data_1');
  await getData(url_2, 'data_2');
  await getData(url_3, 'data_3');

  {
    const arr_1 = [];

    function getIntersection(...arrays) {
      if (arrays.length === 0) return [];
      let result = arrays[0];
      for (let i = 1; i < arrays.length; i++) {
        const codes = new Set(arrays[i].map((item) => item[0]));
        result = result.filter((item) => codes.has(item[0]));
      }
      return result;
    }

    // 调用
    const sameItems = getIntersection(pageObj.data_1, pageObj.data_2);
    console.log(`交叉了${sameItems.length}个`);
    // sameItems.forEach(item => console.log(`${item[0]}--${item[1]}`));

    const wx = sameItems.map(v => `${v[0]}--${v[1]}`).join('\n');
    fs.writeFileSync('rankData_2.txt', wx, 'utf8');
    // fs.writeFileSync('rankData_2.json', JSON.stringify(wx, null, 2), 'utf8');
  }

  {
    const arr_1 = [];

    function getIntersection(...arrays) {
      if (arrays.length === 0) return [];
      let result = arrays[0];
      for (let i = 1; i < arrays.length; i++) {
        const codes = new Set(arrays[i].map((item) => item[0]));
        result = result.filter((item) => codes.has(item[0]));
      }
      return result;
    }

    // 调用
    const sameItems = getIntersection(pageObj.data_1, pageObj.data_2, pageObj.data_3);
    console.log(`交叉了${sameItems.length}个`);
    // sameItems.forEach(item => console.log(`${item[0]}--${item[1]}`));
    const wx = sameItems.map(v => `${v[0]}--${v[1]}`).join('\n');
    fs.writeFileSync('rankData_3.txt', wx, 'utf8');
    // fs.writeFileSync('rankData_3.txt', JSON.stringify(wx, null, 2), 'utf8');
  }
}
init();


/*
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
*/
