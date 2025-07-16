// https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx?m=1&key=港股&pageindex=0&pagesize=100000
// 基金搜索

const newArr = arr.map(v => {
  return {
    code: v.CODEM,
    name: v.NAME
  }
})
console.log(newArr)
