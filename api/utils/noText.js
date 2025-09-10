/* 需要去除掉带这些名字的基金 */
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
  '1年A',
  '1年C',
  '两年',
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
];

module.exports = noText;

/*
depts = [
  {
    name: '科技成长',
    value: '000001',
    childlist: [
      {
        name: '科技成长2',
        value: '0000013',
      }
    ]
  }
]
freemarker script中 遍历depts成js中的数组depts
var arr = [];
<#list depts as dept>
  var childlist = [];
  <#assign safeChildlist = dept.childlist![]>
  <#if safeChildlist?size == 0>
      <#assign safeChildlist = []>
  </#if>
  arr.push({
    name: dept.name,
    value: dept.value,
    childlist: ${safeChildlist?json_string},
  })
</#list>

*/
