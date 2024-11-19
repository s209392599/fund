const fetch = require('node-fetch');
const fs = require('fs');
var IncreaseArr = [];
let test = false;
// test = true; // 开启测试，则只请求3个
// 019984

// 天天基金同业存单数据
async function getAnnualIncome(fundCode) {
  let data = [];
  try {
    // let u = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx?m=1&key=同业存单&pageindex=0&pagesize=300`;
    let u = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx?m=1&key=%E5%90%8C%E4%B8%9A%E5%AD%98%E5%8D%95&pageindex=0&pagesize=300`;

    let response = await fetch(u, {
      headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'sec-ch-ua':
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-site',
      },
      referrer: 'https://fund.eastmoney.com/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    const res = (await response.text()) || '{}';
    data = JSON.parse(res).Datas || [];
    console.log(`一共有 ${data.length} 个基金符合条件`);
  } catch (err) {
    console.log('err', err);
  }
  return data;
}

async function getFund(code, index) {
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":300,"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      return netValueList.reverse();
    });
}

// arr:基金的数据，
function getInfoObj(arr) {
  let obj = {};
  obj.totalDays = 0; // 交易天数
  obj.totalGetValue = 0; // 累计收益
  obj.increaseDays = 0; // 涨的天数
  obj.increaseRate = 0; // 涨的比率
  obj.highestIncrease = 0; // 最高一天涨多少
  obj.highestDecrease = 0; // 最高一天跌多少
  obj.continuousIncreaseDays = 0; // 连涨天数
  obj.continuousDecreaseDays = 0; // 连跌天数
  // obj.dividend = 0;// 分红

  const cur_year = new Date().getFullYear() - 1;
  let cur_month = new Date().getMonth() + 1;
  cur_month = cur_month < 10 ? `0${cur_month}` : cur_month;
  let cur_day = new Date().getDate();
  if (cur_day < 10) cur_day = `0${cur_day}`;
  const cur_date = `${cur_year}-${cur_month}-${cur_day}`;
  const stamp_prev_year = new Date(cur_date).getTime();

  let count_zhang = 0;
  let count_die = 0;
  arr.forEach((item, index) => {
    const stamp_cur_date = new Date(item.date).getTime();
    if (stamp_cur_date > stamp_prev_year) {
      obj.totalDays += 1; // 交易天数
      // 向下入正
      const cur_totalNetValue = Math.floor(item.totalNetValue * 10000);
      const prev_totalNetValue = Math.floor(
        arr[index - 1].totalNetValue * 10000
      );
      // 计算差值
      const increase = cur_totalNetValue - prev_totalNetValue;
      obj.totalGetValue += Math.ceil(increase); // 累计收益
      if (increase >= 0) {
        obj.increaseDays += 1; // 涨的天数
        count_die = 0;
        count_zhang++;
        obj.continuousIncreaseDays = Math.max(
          obj.continuousIncreaseDays,
          count_zhang
        );
        obj.highestIncrease = Math.max(obj.highestIncrease, increase);
      } else {
        count_zhang = 0;
        count_die++;
        obj.continuousDecreaseDays = Math.max(
          obj.continuousDecreaseDays,
          count_die
        );
        obj.highestDecrease = Math.min(obj.highestDecrease, increase);
      }
    }
  });
  day_jiaoyi = obj.totalDays;
  // 涨的天数的比率
  obj.increaseRate =
    ((obj.increaseDays / obj.totalDays) * 100).toFixed(2) + '%';
  return obj;
}

async function fetchFundData(arr) {
  // {"_id":"014437","CODE":"014437","NAME":"鹏华中证同业存单AAA指数7天持有","STOCKMARKET":"","NEWTEXCH":""}
  const len = test ? 3 : arr.length;
  for (let i = 0; i < len; i++) {
    console.log(
      `正在请求第 ${i + 1} 个基金数据 ~~~ ${arr[i].CODE}--${arr[i].NAME}`
    );
    let data_1 = await getFund(arr[i].CODE, i); // 基金每天涨幅数据
    if (data_1.length < 260) {
      console.log(`${arr[i].CODE}--${arr[i].NAME},拿到的数据少于260条`);
      continue;
    }
    let obj = getInfoObj(data_1); // 基金的统计数据

    IncreaseArr.push({
      代号: arr[i].CODE,
      名称: arr[i].NAME,
      累计收益: obj.totalGetValue,
      '涨-跌-比率': `${obj.increaseDays}-${day_jiaoyi - obj.increaseDays}-(${
        obj.increaseRate
      })`,
      涨_最高: obj.highestIncrease,
      跌_最多: obj.highestDecrease,
      连涨_天: obj.continuousIncreaseDays,
      连跌_天: obj.continuousDecreaseDays,
    });
  }
}

// 同业存单排名
async function AnnualIncomeRank() {
  const res_1 = await getAnnualIncome(); // 天天基金同业存单数据
  await fetchFundData(res_1); // 基金数据
  IncreaseArr.sort((a, b) => b.累计收益 - a.累计收益); // 按累计收益排序

  let writeData = JSON.stringify(IncreaseArr, null, 2);
  let filePath = 'fund_tongye.json';
  try {
    fs.writeFileSync(filePath, writeData);
  } catch (err) {
    console.error('写入文件时发生错误:', err);
  }

  let top_05_arr = IncreaseArr.slice(0, 5).map((item) => {
    item['名称'] = item['名称'].replace(
      /同业存单|AAA|指数|7天|持有|期|月月乐/g,
      ''
    );
    return item;
  });
  console.log('TOP 5 同业存单排名：');
  console.table(top_05_arr);
}

AnnualIncomeRank(); // 同业存单排名

/*
let writeData = JSON.stringify(writeArr, null, 2);
let filePath = 'fund_filter.json';
try {
  fs.writeFileSync(filePath, writeData);
  console.log('数据成功写入文件');
} catch (err) {
  console.error('写入文件时发生错误:', err);
}

*/
