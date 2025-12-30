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
const diff_year = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
const year_day = CustomFn.CustomDateFtt(new Date(diff_year), 'yyyy-MM-dd');

const info = {
  // 全部
  all_data_1: [], // 日增长率
  all_data_2: [], // 周增长率
  all_data_3: [], // 月数据
  all_jiaocha_ri_zhou: [], // 日周交叉
  all_jiaocha_zhou_yue: [], // 周月交叉
  all_jiaocha_ri_zhou_yue: [], // 日周月交叉
  all_pn: 500,
  all_url: {
    ri:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=rzdf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    zhou:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    yue:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=1yzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
  },

  // 指数型
  zhishu_data_1: [], // 日增长率
  zhishu_data_2: [], // 周增长率
  zhishu_data_3: [], // 月数据
  zhishu_jiaocha_ri_zhou: [], // 日周交叉
  zhishu_jiaocha_zhou_yue: [], // 周月交叉
  zhishu_jiaocha_ri_zhou_yue: [], // 日周月交叉
  zhishu_pn: 500,
  zhishu_url: {
    ri:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zs&rs=&gs=0&sc=rzdf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    zhou:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zs&rs=&gs=0&sc=zzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    yue:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zs&rs=&gs=0&sc=1yzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
  },

  // 股票型
  gupiao_data_1: [], // 日增长率
  gupiao_data_2: [], // 周增长率
  gupiao_data_3: [], // 月数据
  gupiao_jiaocha_ri_zhou: [], // 日周交叉
  gupiao_jiaocha_zhou_yue: [], // 周月交叉
  gupiao_jiaocha_ri_zhou_yue: [], // 日周月交叉
  gupiao_pn: 300,
  gupiao_url: {
    ri:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=gp&rs=&gs=0&sc=rzdf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=300&dx=1`,
    zhou:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=gp&rs=&gs=0&sc=zzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=300&dx=1`,
    yue:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=gp&rs=&gs=0&sc=1yzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=300&dx=1`,
  },

  // 混合型
  hunhe_data_1: [], // 日增长率
  hunhe_data_2: [], // 周增长率
  hunhe_data_3: [], // 月数据
  hunhe_jiaocha_ri_zhou: [], // 日周交叉
  hunhe_jiaocha_zhou_yue: [], // 周月交叉
  hunhe_jiaocha_ri_zhou_yue: [], // 日周月交叉
  hunhe_pn: 500,
  hunhe_url: {
    ri:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=hh&rs=&gs=0&sc=rzdf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    zhou:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=hh&rs=&gs=0&sc=zzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    yue:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=hh&rs=&gs=0&sc=1yzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
  },

  // 债券型
  zhaiquan_data_1: [], // 日增长率
  zhaiquan_data_2: [], // 周增长率
  zhaiquan_data_3: [], // 月数据
  zhaiquan_jiaocha_ri_zhou: [], // 日周交叉
  zhaiquan_jiaocha_zhou_yue: [], // 周月交叉
  zhaiquan_jiaocha_ri_zhou_yue: [], // 日周月交叉
  zhaiquan_pn: 500,
  zhaiquan_url: {
    ri:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zq&rs=&gs=0&sc=rzdf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    zhou:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zq&rs=&gs=0&sc=zzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
    yue:`https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zq&rs=&gs=0&sc=1yzf&st=desc&sd=${year_day}&ed=${cur_day}&qdii=&tabSubtype=,,,,,&pi=1&pn=500&dx=1`,
  }
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
  var arr = ['all', 'zhishu', 'gupiao', 'hunhe', 'zhaiquan'];
  for (let i = 0; i < arr.length; i++) {
    // console.log('---------------------------------------------');
    // console.log(info[arr[i] + '_url'].ri, arr[i] + '_data_1');
    // console.log(info[arr[i] + '_url'].zhou, arr[i] + '_data_2');
    // console.log(info[arr[i] + '_url'].yue, arr[i] + '_data_3');

    await getData(info[arr[i] + '_url'].ri, arr[i] + '_data_1'); // 日
    await getData(info[arr[i] + '_url'].zhou, arr[i] + '_data_2'); // 周
    await getData(info[arr[i] + '_url'].yue, arr[i] + '_data_3'); // 月

    {
      const sameItems = getIntersection(info[arr[i] + '_data_1'], info[arr[i] + '_data_2']);
      info[arr[i] + '_jiaocha_ri_zhou'] = sameItems.map((v) => {
        return { fund_code: v[0], fund_name: v[1] };
      });
    }
    {
      const sameItems = getIntersection(info[arr[i] + '_data_2'], info[arr[i] + '_data_3']);
      info[arr[i] + '_jiaocha_zhou_yue'] = sameItems.map((v) => {
        return { fund_code: v[0], fund_name: v[1] };
      });
    }
    {
      const sameItems = getIntersection(info[arr[i] + '_data_1'], info[arr[i] + '_data_2'], info[arr[i] + '_data_3']);
      info[arr[i] + '_jiaocha_ri_zhou_yue'] = sameItems.map((v) => {
        return { fund_code: v[0], fund_name: v[1] };
      });
    }
  }

  const curDay = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');

  let jsonData = { ...JSON.parse(hisData) };
  let stamp = 2 * 24 * 60 * 60 * 1000; // 只保留2天内的数据
  for (let key in jsonData) {
    if (new Date(key).getTime() < new Date(curDay).getTime() - stamp)
      delete jsonData[key];
  }

  jsonData[curDay] = {
    // 全部
    all_jiaocha_ri_zhou: info.all_jiaocha_ri_zhou,
    all_jiaocha_zhou_yue: info.all_jiaocha_zhou_yue,
    all_jiaocha_ri_zhou_yue: info.all_jiaocha_ri_zhou_yue,

    // 指数
    zhishu_jiaocha_ri_zhou: info.zhishu_jiaocha_ri_zhou,
    zhishu_jiaocha_zhou_yue: info.zhishu_jiaocha_zhou_yue,
    zhishu_jiaocha_ri_zhou_yue: info.zhishu_jiaocha_ri_zhou_yue,

    // 股票
    gupiao_jiaocha_ri_zhou: info.gupiao_jiaocha_ri_zhou,
    gupiao_jiaocha_zhou_yue: info.gupiao_jiaocha_zhou_yue,
    gupiao_jiaocha_ri_zhou_yue: info.gupiao_jiaocha_ri_zhou_yue,

    // 混合
    hunhe_jiaocha_ri_zhou: info.hunhe_jiaocha_ri_zhou,
    hunhe_jiaocha_zhou_yue: info.hunhe_jiaocha_zhou_yue,
    hunhe_jiaocha_ri_zhou_yue: info.hunhe_jiaocha_ri_zhou_yue,

    // 债券
    zhaiquan_jiaocha_ri_zhou: info.zhaiquan_jiaocha_ri_zhou,
    zhaiquan_jiaocha_zhou_yue: info.zhaiquan_jiaocha_zhou_yue,
    zhaiquan_jiaocha_ri_zhou_yue: info.zhaiquan_jiaocha_ri_zhou_yue,
  };
  fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    JSON.stringify(jsonData, null, 2),
    'utf8'
  );
  // fs.writeFileSync(
  //   path.join(__dirname, 'info.json'),
  //   JSON.stringify(info, null, 2),
  //   'utf8'
  // );
}
// jiaochapaihang();
module.exports = { jiaochapaihang };
