const fs = require('fs').promises;
const filterJson = require('./data/filter.json');
// 机构占比过滤
const max_instPurchaseRatio = 0.5;

let len_filter = filterJson.length;
const deleteList = [];
let middle_filterJson = [...filterJson];

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
      const obj_1 = fund_data.fundProfileOfItem || {};
      const num_1 = obj_1.instPurchaseRatio || 0; // 机构占比
      // const num_2 = obj_1.purchaseRatio || 0; // 个人占比

      if (num_1 > max_instPurchaseRatio) {
        deleteList.push(fund_code);
      }
    } catch (error) {
      console.log(`${item.fund_code} -- ${item.fund_name} -- 读取文件失败`);
    }
  }

  let len_deleteList = deleteList.length;
  for (let index = 0; index < len_deleteList; index++) {
    const fund_code = deleteList[index];
    middle_filterJson = middle_filterJson.filter(
      (item) => item.fund_code !== fund_code
    );
    // 删除FundDetailPageInfo 中的文件
    await fs.unlink(`./FundDetailPageInfo/${fund_code}.json`);
  }

  fs.writeFile(
    './data/filter.json',
    JSON.stringify(middle_filterJson, null, 2),
    'utf-8'
  );

  console.log(deleteList);
  console.log(`删除基金数量: ${len_deleteList}`);
  console.log(`剩余基金数量: ${middle_filterJson.length}`);
}

main().catch((err) => {
  console.error('执行失败:', err && err.message ? err.message : err);
});
