/* 需要去除掉带这些code的基金 */

//
const arr_1 = [];
// 京东不卖
const arr_2 = [
  '021778', // 广发纳指100ETF联接(QDII)人民币F
  '018738', // 博时标普500ETF联接E(人民币)
];
// 只有机构能购买
const arr_3 = [
  '005637', // 国联聚业定期开放债券 只有机构持有
  '003929', // 只有机构持有
];

const noFundCode = [...arr_1, ...arr_2, ...arr_3];

module.exports = noFundCode;
