const fetch = require('node-fetch');
const fs = require('fs');
const filterJson = require('./data/filter.json');

const len_filter = filterJson.length;
let index_start = 0;

// 获取时间 2025-11-16 15:32:00的函数
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

/*
{"chartType":7,"fundCode":"020256","dataCycle":4,"establishedDate":"2024-01-17",
"clientVersion":"","navDate":"2025-12-12","fundType":207,"disclosureType":1}
*/
function getHisData(fundCode) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?reqData={"chartType":7,"fundCode":"${fundCode}","dataCycle":4,"clientVersion":"","disclosureType":1}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        const fileName = `${fundCode}.json`;
        fs.writeFileSync(
          `./Fund_xiu_fu/${fileName}`,
          JSON.stringify(datas, null, 2)
        );
      });
  } catch (err) {
    console.log(err.message || err.msg);
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
    await getHisData(fund_code);
    index_start++;
  }
}
processInLoop(); // 开始获取数据
// getHisData('007467');// 测试一个

