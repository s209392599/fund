const fetch = require('node-fetch');
const noText = require('./api/other/a04-关键词筛选/utils/noText.js'); // 假设路径
const noFundCode = require('./api/other/a04-关键词筛选/utils/noFundCode.js'); // 假设路径

// 模拟 methods/index.js 中的逻辑
async function queryResilienceInfo(search_data) {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;
    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);

    // 简单过滤
    let mappedData = [];
    for (let i = 0; i < fundArray.length; i++) {
      let item = fundArray[i];
      // 这里省略 noText 和 noFundCode 的检查，因为我可能没有这两个文件
      // 假设用户环境有，但我为了快速验证，只做基本检查
      mappedData.push({
        fund_code: item[0],
        fund_name: item[2],
        fund_type: item[3],
      });
    }
    search_data.push(...mappedData);
    console.log(`总基金数: ${fundArray.length}`);
  } catch (err) {
    console.log('err => ', err);
  }
}

async function run() {
    const search_data = [];
    await queryResilienceInfo(search_data);
    
    const params_keywords = {
        keyword_arr: ['趋势'],
        noFundType: ['债券', '货币', '指数', 'QDII'],
        noEndWith: ['A', 'ETF', '(后端)'],
    };

    let count = 0;
    for (let item of search_data) {
        let fund_name = item.fund_name;
        let fund_type = item.fund_type;
        
        // 包含趋势
        if (!fund_name.includes('趋势')) continue;
        
        // 排除类型
        if (params_keywords.noFundType.some(v => fund_type.includes(v))) continue;
        
        // 排除结尾
        if (params_keywords.noEndWith.some(v => fund_name.endsWith(v))) continue;
        
        count++;
        // console.log(item.fund_code, item.fund_name);
    }
    console.log(`包含“趋势”且符合条件的基金数量: ${count}`);
}

run();
