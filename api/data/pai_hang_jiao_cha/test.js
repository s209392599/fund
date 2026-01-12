const {filterBuyableFunds} = require('./mai.js');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const { table } = require('console');
const hisData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
const cur_day = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');
const rizhouDaata = JSON.parse(hisData)[cur_day].all_jiaocha_ri_zhou_yue;
console.log(rizhouDaata.length, '交叉排行总数');

const info = {
  tableList: [],
};

async function test() {
  let buyableFunds = await filterBuyableFunds(rizhouDaata);
  info.tableList = buyableFunds;
  console.log(info.tableList.length, '可买入交叉排行总数');
  fs.writeFileSync(
    path.join(__dirname, 'test.json'),
    JSON.stringify(info, null, 2),
    'utf8'
  );
}
test();

// let buyableFunds = await filterBuyableFunds(info.all_jiaocha_ri_zhou_yue);



