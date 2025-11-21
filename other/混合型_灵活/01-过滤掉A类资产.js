const JSON_DATA = require('./base.json');
const noText = [
  '个月',
  '60天',
  '90天',
  '180天',
  '封闭',
  '定期',
  '定开',
  '年持有', // 1年持有期 三年持有 等
  '60天持有',
  '90天持有',
  '120天持有',
  '180天持有',
  '一年',
  '两年',
  '三年',
  '五年',
  '1年',
  '套利',
  '后端',
  '房地产',
  '滚动',
  '不动产',
  '白银期货',
  '养老',
  'REIT',
  '货币',
  '(后端)',
  '人民币',
  '绝对收益',
  'A/B',
  'A',
];
const arr_1 = JSON_DATA.data || [];
const arr_2 = [];
arr_1.forEach(item => {
  const fund_name = item[1] || '';
  let flag = true;
  noText.forEach(text => {
    if (fund_name.includes(text)) {
      flag = false;
    }
  });
  if (flag) {
    arr_2.push(item);
  }
});

console.log(`初步过滤后基金数量: ${arr_2.length} 个`);
