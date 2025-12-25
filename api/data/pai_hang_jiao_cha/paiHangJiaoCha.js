/*
过滤交叉排名重叠的部分
*/
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
// console.log('noText', noText);
// console.log('noFundCode', noFundCode);
const hisData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
/*
https://fund.eastmoney.com/data/fundranking.html
pn: 请求多少条数据，应该是page number
pi: 页码
sd: start date  后面的自定义搜索
ed: end date
*/

const cur_day = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');
// 去年的今天
const year_day = CustomFn.CustomDateFtt(new Date(cur_day - 365 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

const pn = 500; // 请求500条数据
// 日增长率
const url_1 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=rzdf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1`;
// 周
const url_2 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1`;
// 月
const url_3 = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=1yzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1`;

const info = {
  data_1: [], // 日增长率
  data_2: [], // 周增长率
  data_3: [], // 月数据

  jiaocha_ri_zhou: [], // 日周交叉
  jiaocha_zhou_yue: [], // 周月交叉
  jiaocha_ri_zhou_yue: [], // 日周月交叉

  // 全部
  all_pn: 500,
  all_url: {
    ri:``,
    zhou:``,
    yue:``,
  },
  // 指数型
  zhishu_pn: 500,
  zhishu_url: {
    ri:``,
    zhou:``,
    yue:``,
  },
  // 股票型
  guopiao_pn: 500,
  guopiao_url: {
    ri:``,
    zhou:``,
    yue:``,
  },
  // 混合型
  huihe_pn: 500,
  huihe_url: {
    ri:``,
    zhou:``,
    yue:``,
  },
  // 债券型
  zhaiquan_pn: 500,
  zhaiquan_url: {
    ri:``,
    zhou:``,
    yue:``,
  },
  // // QDII
  // qdii_pn: 500,
  // qdii_url: {
  //   ri:``,
  //   zhou:``,
  //   yue:``,
  // },
  // // FOF
  // fof_pn: 500,
  // fof_url: {
  //   ri:``,
  //   zhou:``,
  //   yue:``,
  // },
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
      info[key] = arr_1.map((item) => {
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

async function jiaochapaihang() {
  await getData(url_1, 'data_1'); // 日
  await getData(url_2, 'data_2'); // 周
  await getData(url_3, 'data_3'); // 月

  {
    const sameItems = getIntersection(info.data_1, info.data_2);
    info.jiaocha_ri_zhou = sameItems.map((v) => {
      return { fund_code: v[0], fund_name: v[1] };
    });
  }

  {
    const sameItems = getIntersection(info.data_2, info.data_3);
    const wx = sameItems.map((v) => `${v[0]}--${v[1]}`).join('\n');
    info.jiaocha_zhou_yue = sameItems.map((v) => {
      return { fund_code: v[0], fund_name: v[1] };
    });
  }

  {
    const sameItems = getIntersection(info.data_1, info.data_2, info.data_3);
    info.jiaocha_ri_zhou_yue = sameItems.map((v) => {
      return { fund_code: v[0], fund_name: v[1] };
    });
  }

  const curDay = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');

  let jsonData = { ...JSON.parse(hisData) };
  let stamp = 10 * 24 * 60 * 60 * 1000; // 只保留10天内的数据
  for (let key in jsonData) {
    if (new Date(key).getTime() < new Date(curDay).getTime() - stamp)
      delete jsonData[key];
  }
  jsonData[curDay] = {
    jiaocha_ri_zhou: info.jiaocha_ri_zhou,
    jiaocha_zhou_yue: info.jiaocha_zhou_yue,
    jiaocha_ri_zhou_yue: info.jiaocha_ri_zhou_yue,
  };
  fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    JSON.stringify(jsonData, null, 2),
    'utf8'
  );
}
// jiaochapaihang();
module.exports = { jiaochapaihang };
// const { jiaochapaihang } = require('./api/data/pai_hang_jiao_cha/paiHangJiaoCha.js');
