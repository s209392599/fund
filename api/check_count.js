const fetch = require('node-fetch');
const noText = require('./utils/noText.js');
const noFundCode = require('./utils/noFundCode.js');

async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;
    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);

    let mappedData = [];
    for (let i = 0; i < fundArray.length; i++) {
      let item = fundArray[i];
      if (noText.some((v) => item[2].includes(v))) {
        continue;
      }
      if (noFundCode.includes(item[0])) {
        continue;
      }
      mappedData.push({
        fund_code: item[0],
        fund_name: item[2],
        fund_type: item[3],
      });
    }
    return mappedData;
  } catch (err) {
    console.log('err => ', err);
    return [];
  }
}

async function run() {
    console.log('开始获取基金数据...');
    const search_data = await queryResilienceInfo();
    console.log(`总共获取到 ${search_data.length} 个基金（已排除 noText 和 noFundCode）`);
    
    const params_keywords = {
        keyword_arr: ['趋势'],
        noFundType: ['债券', '货币', '指数', 'QDII'],
        noEndWith: ['A', 'ETF', '(后端)'],
    };

    let count = 0;
    let filtered = [];
    for (let item of search_data) {
        let fund_name = item.fund_name;
        let fund_type = item.fund_type;
        
        // 包含趋势
        if (!params_keywords.keyword_arr.some(v => fund_name.includes(v))) continue;
        
        // 排除类型
        if (fund_type && params_keywords.noFundType.some(v => fund_type.includes(v))) continue;
        
        // 排除结尾
        if (params_keywords.noEndWith.some(v => fund_name.endsWith(v))) continue;
        
        count++;
        filtered.push(item);
    }
    console.log(`包含“趋势”且符合条件的基金数量: ${count}`);
}

run();
