// 基金历史净值 初始化文件
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

// 读取历史数据的基金号
var codeArr = [
  // ''
];

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);

  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=007467&disclosureType=1&activeIndex=0
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":99999,"channel":"9"}`;
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

async function fetchFunds() {
  for (let index = 0; index < codeArr.length; index++) {
    const fundData = await getFund(codeArr[index], index);

    const apiDir = path.join(__dirname, '../'); // 回退到 /api 目录
    let fileDir = path.join(apiDir, `data/his_val`);
    let filePath = path.join(fileDir, `${codeArr[index]}.json`);

    // 检查文件夹在不在，不在的话创建一个
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        JSON.stringify({ length: 0, data: [] }, null, 2)
      );
    }

    // 读取文件内容
    // let fileContent = fs.readFileSync(filePath, 'utf8');
    // let data = JSON.parse(fileContent);

    // 将更新后的内容写回文件
    fs.writeFileSync(filePath, JSON.stringify({ data: fundData }, null, 2));
  }
}

fetchFunds();
