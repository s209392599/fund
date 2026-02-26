const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');
const { default: pLimit } = require('p-limit');
// const limit = pLimit(5); // 设置并发数为5
const limit = pLimit(os.cpus().length * 2); // CPU核心数
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


async function yanzheng(params) {
  try {
    const result = await getFundDiagnosisPageInfo(params);
    console.log('result => ', JSON.stringify(result));
  } catch (error) {
    console.log('error => ', error);
  }
}

yanzheng('1022004')
