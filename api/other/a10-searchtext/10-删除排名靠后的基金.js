/*
 * 删除不可买的基金
 */
const fs = require('fs').promises;
const path = require('path');
const filterJson = require('./data/filter.json');

let len_filter = filterJson.length;
const deleteList = [];

async function main() {
  // 并行读取所有基金详情文件
  const promises = [];
  for (let index = 0; index < len_filter; index++) {
    const item = filterJson[index];
    const fund_code = item.fund_code;

    promises.push(
      fs.readFile(`./FundDetailPageInfo/${fund_code}.json`, 'utf-8')
        .then(content => {
          const fundDetailPageInfoJson = JSON.parse(content);
          if (!fundDetailPageInfoJson.isForSale) {
            deleteList.push(fund_code);
          }
        })
        .catch(error => {
          console.log(`${item.fund_code} -- ${item.fund_name} -- 读取文件失败`);
        })
    );
  }

  // 等待所有读取操作完成
  await Promise.all(promises);

  // 创建要删除基金的Set，提高查找效率
  const deleteSet = new Set(deleteList);

  // 使用filter一次性过滤出不需要删除的基金
  const remainingFilterJson = filterJson.filter(item => !deleteSet.has(item.fund_code));

  // 并行删除所有不需要的基金详情文件
  const deleteFilePromises = deleteList.map(fund_code =>
    fs.unlink(`./FundDetailPageInfo/${fund_code}.json`).catch(err => {
      console.log(`删除文件失败 ${fund_code}.json:`, err.message);
    })
  );

  await Promise.all(deleteFilePromises);

  // 写入更新后的filter.json
  await fs.writeFile(
    './data/filter.json',
    JSON.stringify(remainingFilterJson, null, 2),
    'utf-8'
  );

  console.log(deleteList);
  console.log(`删除基金数量: ${deleteList.length}`);
  console.log(`剩余基金数量: ${remainingFilterJson.length}`);
}

main().catch((err) => {
  console.error('执行失败:', err && err.message ? err.message : err);
});
