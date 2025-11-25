/*
过滤交叉排名重叠的部分
*/
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
// console.log('noText', noText);
// console.log('noFundCode', noFundCode);
/*
https://fund.eastmoney.com/data/fundranking.html#tzq;c0;r;s3yzf;pn50;ddesc;qsd20241125;qed20251125;qdii;zq043;gg;gzbd;gzfs;bbzt;sfbb

https://fund.eastmoney.com/data/fundranking.html
pn: 请求多少条数据，应该是page number
pi: 页码
sd: start date  后面的自定义搜索
ed: end date

*/

const pn = 500;// 请求500条数据
const preurl = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zq&rs=&gs=0`;
// 近3月
const url_1 = `${preurl}&sc=3yzf&st=desc&sd=2024-11-25&ed=2025-11-25&qdii=043|&tabSubtype=043,,,,,&pi=1&pn=${pn}&dx=1&v=0.5059803374976325`;
// 近6月
const url_2 = `${preurl}&sc=6yzf&st=desc&sd=2024-11-25&ed=2025-11-25&qdii=043|&tabSubtype=043,,,,,&pi=1&pn=${pn}&dx=1&v=0.2638998625594018`;
// 近1年
const url_3 = `${preurl}&sc=1nzf&st=desc&sd=2024-11-25&ed=2025-11-25&qdii=043|&tabSubtype=043,,,,,&pi=1&pn=${pn}&dx=1&v=0.4249629859541093`;

// 债券类单独的一些关键词移除
const noKeyArr = [
  '可转债',
];

const pageObj = {
  data_1: [], //
  data_2: [], //
  data_3: [], //
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
        if (noKeyArr.some((kw) => name.includes(kw))) return false;
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

function getIntersection(...arrays) {
      if (arrays.length === 0) return [];
      let result = arrays[0];
      for (let i = 1; i < arrays.length; i++) {
        const codes = new Set(arrays[i].map((item) => item[0]));
        result = result.filter((item) => codes.has(item[0]));
      }
      return result;
    }

async function init() {
  await getData(url_1, 'data_1');// 近3月
  await getData(url_2, 'data_2');// 近6月
  await getData(url_3, 'data_3');// 近1年

  {
    const sameItems = getIntersection(pageObj.data_1, pageObj.data_2);
    console.log(`3月和6月 交叉了${sameItems.length}个`);
    // sameItems.forEach(item => console.log(`${item[0]}--${item[1]}`));

    // 存储文本
    const wx = sameItems.map(v => `${v[0]}--${v[1]}`).join('\n');
    fs.writeFileSync('rankData_1.txt', '3月和6月 交叉了' + sameItems.length + '个\n' + wx, 'utf8');

    // 存储json
    const json_data = sameItems.map(v => { return { fund_code: v[0], fund_name: v[1] } })
    fs.writeFileSync('jiaocha_1.json', JSON.stringify(json_data, null, 2), 'utf8');
  }

  {
    const sameItems = getIntersection(pageObj.data_2, pageObj.data_3);
    console.log(`6月和1年 交叉了${sameItems.length}个`);
    const wx = sameItems.map(v => `${v[0]}--${v[1]}`).join('\n');
    fs.writeFileSync('rankData_2.txt', '6月和1年 交叉了' + sameItems.length + '个\n' + wx, 'utf8');

    const json_data = sameItems.map(v => { return { fund_code: v[0], fund_name: v[1] } })
    fs.writeFileSync('jiaocha_2.json', JSON.stringify(json_data, null, 2), 'utf8');
  }

  {
    const sameItems = getIntersection(pageObj.data_1, pageObj.data_2, pageObj.data_3);
    console.log(`3月和6月和1年 交叉了${sameItems.length}个`);
    const wx = sameItems.map(v => `${v[0]}--${v[1]}`).join('\n');
    fs.writeFileSync('rankData_3.txt', '3月和6月和1年 交叉了' + sameItems.length + '个\n' + wx, 'utf8');

    const json_data = sameItems.map(v => { return { fund_code: v[0], fund_name: v[1] } })
    fs.writeFileSync('jiaocha_3.json', JSON.stringify(json_data, null, 2), 'utf8');
  }
}
init();
