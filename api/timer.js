const schedule = require('node-schedule'); // 定时器
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('./CustomFn.js');
// 交叉排行
const {
  jiaochapaihang,
} = require('./data/pai_hang_jiao_cha/paiHangJiaoCha.js');
// 基金数据
const { getFundcodeSearch } = require('./data/fund_all/update_all.js');

/* 参数解释
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └── 星期 (0-7) (0和7都表示周日)
│    │    │    │    └───── 月 (1-12)
│    │    │    └────────── 日 (1-31)
│    │    └─────────────── 时 (0-23)
│    └──────────────────── 分 (0-59)
└───────────────────────── 秒 (0-59)
*/

// 每天晚上12点进行 交叉排行更新
schedule.scheduleJob('0 0 0 * * *', async () => {
  try {
    await jiaochapaihang();
    // console.log('1111', new Date().toLocaleString());
  } catch (error) {
    console.error('交叉排行任务执行失败:', error);
  }
});
// 基金数据更新
schedule.scheduleJob('1 0 0 * * *', async () => {
  try {
    await getFundcodeSearch();
    // console.log('2222', new Date().toLocaleString());
  } catch (error) {
    console.error('基金数据任务执行失败:', error);
  }
});

// schedule.scheduleJob('6 * 14-15 * * *', logCleanupTask); // 14:00-15:59每分钟第6秒
