// 开启服务前手动去准备一下模拟的服务器数据

const fs = require('fs');
const path = require('path');
const CustomFn = require('./CustomFn.js');
// 交叉排行
const {
  jiaochapaihang,
} = require('./data/pai_hang_jiao_cha/index.js');
// 基金数据
const { getFundcodeSearch } = require('./data/fund_all/index.js');

// 交叉排行更新
async function fn_jiaocha_01(){
  try{
    await jiaochapaihang();
    console.log('交叉排行任务执行成功');
  } catch (error) {
    console.error('交叉排行任务执行失败:', error);
  }
}

// 基金数据更新
async function fn_fund_01(){
  try{
    await getFundcodeSearch();
    console.log('基金数据任务执行成功');
  } catch (error) {
    console.error('基金数据任务执行失败:', error);
  }
}

async function initData(){
  await fn_jiaocha_01();// 交叉排行
  await fn_fund_01();// 基金数据
  console.log('数据已更新完毕');
}
initData();
