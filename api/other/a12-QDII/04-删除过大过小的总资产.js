const fs = require('fs').promises;
const filterJson = require('./data/filter.json');
// 删除总资产小于1亿或大于150亿的基金
const min_totalAsset = 1 * 10000 * 10000; // 1亿
const max_totalAsset = 5000 * 10000 * 10000; // 5000亿

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
      const obj_1 = fund_data.investmentDistributionNewOfItem || {};
      const obj_2 = obj_1.investmentDistribution || {};
      const totalAsset = obj_2.totalAsset || 0;
      if (!fundScale.includes('亿')) {
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
