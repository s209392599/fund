// 获取分红信息
const fetch = require('node-fetch');
const fs = require('fs');
const filterJson = require('./data/filter.json');
const len_filter = filterJson.length;
let index_start = 0;

const info = {
  err_data: [], // 请求错误的基金号
};
// 获取时间 2025-11-16 15:32：00的函数
function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function getHisData(fundCode, fund_name) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDividendPageInfo?reqData={"fundCode":"${fundCode}","pageNum":1,"pageSize":20,"channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        const fileName = `${fundCode}.json`;
        fs.writeFileSync(
          `./FundFenhong/${fileName}`,
          JSON.stringify(datas, null, 2)
        );
      });
  } catch (err) {
    info.err_data.push(`${fundCode} -- ${fund_name}`);
  }
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
    await getHisData(fund_code, fund_name);
    index_start++;
  }
  if (info.err_data.length > 0) {
    console.log('错误数据：', info.err_data);
  }
}
processInLoop(); // 开始获取数据
