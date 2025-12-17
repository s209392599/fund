/* 是否有基金预测 */
const fs = require('fs').promises;
const filterJson = require('./data/filter.json');

let len_filter = filterJson.length;
const deleteList = []; // 要删除的基金
let middle_filterJson = [...filterJson];

function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str || '{}';
}

async function main() {
  for (let index = 0; index < len_filter; index++) {
    const item = filterJson[index];
    const fund_code = item.fund_code;

    try {
      let u = `https://fundgz.1234567.com.cn/js/${fund_code}.js?rt=${+new Date()}`;
      const res = await fetch(u, {});
      if (!res.ok) {
        throw new Error(`${fund_code} 获取失败!!!!!!!!!!!!!!!!!!!!`);
      }
      let data = realTimeInformation(await res.text());
      let obsData = JSON.parse(data);
      console.log('fundCode', fund_code, obsData.name || '获取不到');
      if (!obsData.name) {
        deleteList.push(fund_code);
      }
    } catch (err) {
      console.log(err.message || err.msg);
    }
  }

  let len_deleteList = deleteList.length;
  for (let index = 0; index < len_deleteList; index++) {
    const fund_code = deleteList[index];
    middle_filterJson = middle_filterJson.filter(
      (item) => item.fund_code !== fund_code
    );
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
