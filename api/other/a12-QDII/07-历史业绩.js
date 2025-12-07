const fs = require('fs').promises;
const filterJson = require('./data/filter.json');

var max_month_3 = 0.5; // 3个月内收益率要大于
var max_month_6 = 1; // 近3月
var max_year_1 = 6; // 近1年
var max_year_3 = max_year_1 * 3; // 近3年
var tong_ming = 0.5; // 同类型排名不能超过50%

let len_filter = filterJson.length;
const deleteList = [];
let middle_filterJson = [...filterJson];

// len_filter = 3;
async function main() {
  for (let index = 0; index < len_filter; index++) {
    const item = filterJson[index];
    const fund_code = item.fund_code;

    try {
      const fundDetailPageInfo = await fs.readFile(
        `./FundDetailPageInfo/${fund_code}.json`,
        'utf-8' // 明确指定编码
      );
      const fund_data = JSON.parse(fundDetailPageInfo);

      if (!fund_data.hasOwnProperty('performanceOfItem')) {
        continue;
      }
      const obj_1 = fund_data.performanceOfItem || {};

      if (!obj_1.hasOwnProperty('historyPerformanceMap')) {
        continue;
      }
      const obj_2 = obj_1.historyPerformanceMap || {};

      if (!obj_2.hasOwnProperty('historyPerformanceList')) {
        continue;
      }
      const obj_3 = obj_2.historyPerformanceList || {};

      const rate_month_3 = Number((obj_3[2] || {}).rate || 0);
      const rate_month_6 = Number((obj_3[3] || {}).rate || 0);
      const rate_year_1 = Number((obj_3[4] || {}).rate || 0);

      // 成立时间要大于1年，所以先进行判断
      if (rate_year_1 < max_year_1) {
        if (!deleteList.includes(fund_code)) {
          deleteList.push(fund_code);
        }
        continue;
      }

      // 近6月
      if (rate_month_6 < max_month_6) {
        if (!deleteList.includes(fund_code)) {
          deleteList.push(fund_code);
        }
        continue;
      }

      // 近3月
      if (rate_month_3 < max_month_3) {
        if (!deleteList.includes(fund_code)) {
          deleteList.push(fund_code);
        }
        continue;
      }

      // 排名不能是后50%
      if (obj_3[2].rank && obj_3[3].rank && obj_3[4].rank) {
        let [num_11, num_12] = (obj_3[2].rank || '0/0').split('/');
        let [num_21, num_22] = (obj_3[3].rank || '0/0').split('/');
        let [num_31, num_32] = (obj_3[4].rank || '0/0').split('/');

        let flag_1 = Number(num_11 || 0) / Number(num_12 || 1) >= tong_ming;
        let flag_2 = Number(num_21 || 0) / Number(num_22 || 1) >= tong_ming;
        let flag_3 = Number(num_31 || 0) / Number(num_32 || 1) >= tong_ming;
        if (flag_1 && flag_2 && flag_3) {
          if (!deleteList.includes(fund_code)) {
            deleteList.push(fund_code);
          }
          continue;
        }
      }
    } catch (error) {
      console.log(error);
      console.log(`${item.fund_code} -- ${item.fund_name} -- 读取文件失败`);
    }
  }

  let len_deleteList = deleteList.length;
  for (let index = 0; index < len_deleteList; index++) {
    const fund_code = deleteList[index];
    // 删除FundDetailPageInfo 中的文件
    await fs.unlink(`./FundDetailPageInfo/${fund_code}.json`);
    middle_filterJson = middle_filterJson.filter(
      (item) => item.fund_code !== fund_code
    );
  }
  if (len_deleteList) {
    fs.writeFile(
      './data/filter.json',
      JSON.stringify(middle_filterJson, null, 2),
      'utf-8'
    );

    console.log(deleteList);
    console.log(`删除基金数量: ${len_deleteList}`);
    console.log(`剩余基金数量: ${middle_filterJson.length}`);
  } else {
    console.log('不需要删除');
  }
}

main().catch((err) => {
  console.error('执行失败:', err && err.message ? err.message : err);
});

/* 新成立基金的历史业绩
[
  {"name": "近1周"},
  {"name": "近1月"},
  {"name": "近3月"},
  {"name": "近6月"},
  {"name": "近1年"},
  {"rate": "0.05","name": "今年以来"},
  {"name": "近3年"},
  {"rate": "0.05","name": "成立以来"}
]
*/
