// 基金实时涨幅
const fetch = require('node-fetch');

var arr = [
  { number: '400030', name: '东方添益(随时)' },
  { number: '006549', name: '国金惠盈纯债A' },
  { number: '485119', name: '工银信用(稳)' },
  { number: '006980', name: '国寿安保(限500)' },
  { number: '003547', name: '鹏华丰禄(限100)' },
  { number: '006760', name: '国金惠盈C(30)' },
  { number: '009604', name: '国金惠盈(7-1000)' },
  { number: '007214', name: '国泰惠丰(30天)' },
  { number: '000116', name: '嘉实丰益(1)' },
  { number: '519762', name: '交银裕通' },
  { number: '007540', name: '华泰保兴安A' },
  { number: '017593', name: '汇添富添C' },
  { number: '008799', name: '国金惠安利C' },
  { number: '010353', name: '南方崇元A' },
  { number: '006961', name: '南方中债7-10' },
  { number: '016658', name: '兴华安裕' },
  { number: '007492', name: '上银政策性' },
];

function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str;
}

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://fundgz.1234567.com.cn/js/400030.js?rt=1711363239864
  let u = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${+new Date()}`;
  return fetch(u, {})
    .then((res) => res.text())
    .then((res) => {
      let data = realTimeInformation(res);
      let obsData = JSON.parse(data);
      // {"fundcode":"008087","name":"华夏中证5G通信主题ETF联接C","jzrq":"2024-03-22","dwjz":"0.9686","gsz":"0.9416","gszzl":"-2.78","gztime":"2024-03-25 15:00"}
      return {
        code,
        name: obsData.name,
        gszzl: obsData.gszzl,
        dwjz: obsData.dwjz,
        gsz: obsData.gsz,
        gztime: obsData.gztime,
      };
    });
}

var IncreaseArr = [];

async function fetchFundData() {
  for (let i = 0; i < arr.length; i++) {
    let fundData = await getFund(arr[i].number, i);
    // IncreaseArr.push({ "number": fundData.code, "name": fundData.name, "gszzl": fundData.gszzl });
    IncreaseArr.push({
      代号: fundData.code,
      基金名称: fundData.name,
      gszzl: fundData.gszzl,
      单位净值: fundData.dwjz,
      累计净值: fundData.gsz,
      更新时间: fundData.gztime,
    });
  }
}

fetchFundData().then(() => {
  console.table(IncreaseArr);
});
