const fs = require('fs');
const path = require('path');

// 基金数据
const { getFundcodeSearch } = require('./data/fund_all/index.js');

async function runTest() {
  try {
    await getFundcodeSearch();
    console.log('测试成功')
  } catch (error) {
    console.error('执行失败:', error);
  }
}

runTest();
