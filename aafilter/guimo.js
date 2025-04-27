// 获取所有初步基金进行数据过滤
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('./noText');// 排除的关键词
const noFundCode = require('./noFundCode');// 排除的基金代码

emptyDirectory('./data_guimo/data_guimo_da');// 先清空文件夹
emptyDirectory('./data_guimo/data_guimo_xiao');// 先清空文件夹

fetch("https://ms.jr.jd.com/gw2/generic/life/h5/m/getChangesInNetAssets", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/x-www-form-urlencoded"
  },
  "body": `reqData={"fundCode":"000667","tabName":1,"channel":"9"}`,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(res => res.json()).then(data => {
  const histogramList = data.resultData.histogramList;// 获取规模

})
.catch(err => {
  console.error(err);
});



// 存放分类数据
let obj = {
  // "混合型-灵活":[]
};
// 京东金融不可买的基金
let dis_fundData = [];

// 获取基金信息
const getFundInfo = async (fundCode) => {
  let obj = {};
  try{
    const response = await fetch("https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailPageInfo", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": `reqData={"itemId":"","createOrdermaket":"","fundCode":"${fundCode}","clientVersion":null,"channel":"9"}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    const res = (await response.json()) || {};
    obj = res?.resultData?.datas || {};
  }catch(err){
    console.log(err)
  }
  return obj;
}


/*
["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
["970212","ZXJTYX12GYCYQZQC","中信建投悠享12个月持有期债券C","债券型-混合一级","ZHONGXINJIANTOUYOUXIANG12GEYUECHIYOUQIZHAIQUANC"]

https://ms.jr.jd.com/gw2/generic/life/h5/m/getChangesInNetAssets 规模变动
*/
async function fenxi(arr = []) {
  for(let i = 0;i<arr.length;i++){
    let res = await getFundInfo(arr[i][0]);// 获取基金详情
    if(res.bottomButtonOfItem){
      const purchaseButton = res.bottomButtonOfItem.purchaseButton || {};
      if(!purchaseButton.dis_scale){// 京东金融可售卖
        const fundProfileOfItem = res.fundProfileOfItem || {};
        const fundScale = fundProfileOfItem.fundScale || '';// 资金规模
        if(fundScale){
          // "10.92亿元" "5456.44万元"
          // trendChartOfItem.chartTitleList 同类均值
        }
      }else{
        dis_fundData.push(arr[i]);// 京东金融上不可买的基金
      }
    }else{
      continue;
    }
  }

  let count = 0;// 统计数量
  arr.forEach((item, index) => {
    const flag_2 = !noText.some(text => item[2].includes(text));// 滤除 定期 等周期长的基金
    const flag_3 = !noFundCode.some(text => item[0].includes(text));// 排除的基金号

    if (flag_2 && flag_3) {
      const xing = item[3];// 什么类型
      if (!obj[xing]) {
        obj[xing] = [];
      }
      obj[xing].push(item);
      count++;
    }
  });

  // 创建data文件夹(如果不存在)
  const fs = require('fs');
  if (!fs.existsSync('./data_all')) {
    fs.mkdirSync('./data_all');
  }

  // 遍历obj的每个key，创建对应的json文件
  Object.keys(obj).forEach(key => {
    const fileName = `./data_all/${key}.json`;
    const content = JSON.stringify({
      count: obj[key].length,
      data: obj[key]
    }, null, 2);
    fs.writeFileSync(fileName, content, 'utf8');
    console.log(`已创建文件: ${fileName}`);
  });
  console.log(`初步筛选了${Object.keys(obj).length}种类型 共${count}个基金`);
}

async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = await response.text() || {};
    // console.log(res.substring(0, 50));// 截取前50个字符
    // 提取数组部分的字符串
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    // 将字符串转换为数组
    const fundArray = JSON.parse(arrayStr);
    console.log(`一共有${fundArray.length}个基金`);
    fenxi(fundArray);
  } catch (err) {
    console.log('err => ', err);
  }
}
queryResilienceInfo();

// 清空文件夹函数
function emptyDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const curPath = path.join(directory, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        emptyDirectory(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}
