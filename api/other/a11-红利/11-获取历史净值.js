const fetch = require('node-fetch');
const fs = require('fs');
const filterJson = require('./data/filter.json');

const len_filter = filterJson.length;
let index_start = 0;
const his_day = 245 * 5; // 每次获取260天的净值

// 获取时间 2025-11-16 15:32：00的函数
function getTime() {
  const date = new Date('2025-11-16 15:32:00');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function getHisData(fundCode) {
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?`;
  u += `reqData={"fundCode":"${fundCode}","pageNum":1,"pageSize":${his_day},"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = (datas.netValueList || []).reverse();

      const fileName = `${fundCode}.json`;
      fs.writeFileSync(
        `./HistoryNetValue/${fileName}`,
        JSON.stringify(netValueList, null, 2)
      );
    });
}

async function processInLoop() {
  while (index_start < len_filter) {
    // 等待300ms，防止请求过快
    await new Promise((resolve) => setTimeout(resolve, 300));
    const item = filterJson[index_start];
    const fund_code = item.fund_code;
    const fund_name = item.fund_name;
    console.log(
      `${fund_code} -- ${fund_name} -- ${getTime()} -- 第${index_start + 1}个`
    );
    await getHisData(fund_code);
    index_start++;
  }
}
processInLoop(); // 开始获取数据
