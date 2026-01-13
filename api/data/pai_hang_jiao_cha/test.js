const {filterBuyableFunds} = require('./mai.js');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const hisData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
const cur_day = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd');
const rizhouDaata = JSON.parse(hisData)[cur_day].all_jiaocha_ri_zhou_yue;
console.log(rizhouDaata.length, '交叉排行总数');

const info = {
  tableList: [],
};

async function test() {
  let { result=[], no_hege=[] } = await filterBuyableFunds(rizhouDaata);
  info['入选'] = result.length;
  info['不满足'] = no_hege.length;
  info.tableList = result;
  info.no_hege = no_hege;

  console.log(info.tableList.length, '可买入交叉排行总数');
  console.log(info.no_hege.length, '不满足条件的基金总数');

  fs.writeFileSync(
    path.join(__dirname, 'test.json'),
    JSON.stringify(info, null, 2),
    'utf8'
  );
}
test();
