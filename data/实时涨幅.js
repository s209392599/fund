// 基金实时涨幅
const fetch = require("node-fetch");

var arr = [
  { "number": "007091", "name": "东兴兴福(1年)(7月1号)", "remarks": "", "notice": "" },
  { "number": "009461", "name": "东方臻萃(3月)(5月6号)", "remarks": "", "notice": "" },
  { "number": "400030", "name": "东方添益(随时)", "remarks": "", "notice": "" },
  { "number": "002988", "name": "平安鼎信(30天)", "remarks": "", "notice": "" },
  { "number": "007214", "name": "国泰惠丰(30天)", "remarks": "", "notice": "" },
  { "number": "008728", "name": "同泰恒利(30天)", "remarks": "", "notice": "" },
  { "number": "009604", "name": "国金惠盈(7天)(限1000)", "remarks": "", "notice": "" },
  { "number": "007235", "name": "广发聚利(30天)", "remarks": "", "notice": "" },
  { "number": "485119", "name": "工银信用(稳)", "remarks": "", "notice": "" },
  { "number": "003547", "name": "鹏华丰禄(限100)", "remarks": "", "notice": "" },
  { "number": "007769", "name": "东兴兴瑞(1年)(11-11)", "remarks": "", "notice": "" },
  { "number": "000116", "name": "嘉实丰益(1年)(10-21)", "remarks": "", "notice": "" },
  { "number": "005070", "name": "长江乐丰(3月)(6-11)", "remarks": "", "notice": "" },
  { "number": "006716", "name": "东方永泰(1年)(5-23)", "remarks": "", "notice": "" },
  { "number": "006980", "name": "国寿安保(限500)", "remarks": "", "notice": "" },
  { "number": "519762", "name": "交银裕通", "remarks": "", "notice": "" }
];

function realTimeInformation(str) {
  if (str.startsWith("jsonpgz(")) {
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
    .then(res => res.text())
    .then(res => {
      let data = realTimeInformation(res);
      let obsData = JSON.parse(data);
      // {"fundcode":"008087","name":"华夏中证5G通信主题ETF联接C","jzrq":"2024-03-22","dwjz":"0.9686","gsz":"0.9416","gszzl":"-2.78","gztime":"2024-03-25 15:00"}
      return { code, "name": obsData.name, "gszzl": obsData.gszzl, dwjz: obsData.dwjz, gsz: obsData.gsz, gztime: obsData.gztime };
    });
}

var IncreaseArr = [];

async function fetchFundData() {
  for (let i = 0; i < arr.length; i++) {
    let fundData = await getFund(arr[i].number, i);
    // IncreaseArr.push({ "number": fundData.code, "name": fundData.name, "gszzl": fundData.gszzl });
    IncreaseArr.push({
      "code": fundData.code,
      "name": fundData.name,
      "gszzl": fundData.gszzl,
      dwjz: fundData.dwjz,
      gsz: fundData.gsz,
      gztime: fundData.gztime
    });
  }
}

fetchFundData().then(() => {
  console.table(IncreaseArr);
});





