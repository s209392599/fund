const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');
const { default: pLimit } = require('p-limit');
// const limit = pLimit(5); // 设置并发数为5
// const limit = pLimit(os.cpus().length * 2); // CPU核心数
const limit = pLimit(os.cpus().length); // CPU核心数
const limit_2 = pLimit(2);

const {
  queryResilienceInfo,// 获取所有基金
  filter_keywords,// 过滤关键词
  getFundGz, // 获取基金实时涨幅
  getJingdongBaseInfo, // 获取京东金融基本信息
  getFundDetailChartPageInfo, // 获取京东金融回撤修复
  getFundTradeRulesPageInfo, // 获取基金买卖费率
  getFundFeatureData, // 获取基金特色数据(波动率、夏普率、最大回撤等)
  getFundDiagnosisPageInfo, // 获取基金综合诊断
} = require('./mehods/index.js');



const info = {
  filter_data: [], // 过滤后的数据
};


async function main() {
  const startTime = Date.now();
  try {
    // 请求基金数据
    await queryResilienceInfo(info.filter_data);

    // 过滤出来包含关键词的基金
    await filter_keywords({
      filter_data: info.filter_data,
      ...params_keywords,
    });

    fs.writeFileSync('./data/filter.json', JSON.stringify(info.filter_data, null, 2));

  } catch (err) {
    console.log('err => ', err);
  } finally {
    const endTime = Date.now();
    const diffTime = endTime - startTime;
    const minutes = Math.floor(diffTime / 60000);
    const seconds = Math.floor((diffTime % 60000) / 1000);
    const milliseconds = diffTime % 1000;
    console.log(`整体耗时: ${minutes} 分 ${seconds} 秒 ${milliseconds} 毫秒`);
  }
}
main();
