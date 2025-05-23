// 根绝关键词来搜搜
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('./noText');// 排除的关键词
const noFundCode = require('./noFundCode');// 排除的基金代码

emptyDirectory('./data_search');// 先清空data文件夹

// 获取命令行参数，去掉前两个（node 和 脚本名），如果没有则默认搜索“红利低波”
let searchText = process.argv.slice(2);
if (searchText.length === 0) {
  searchText = ["红利低波"];
}
console.log('搜索的关键词 => ', searchText);

// 存放分类数据
let obj = {
  // "混合型-灵活":[]
};

/*
["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
["970212","ZXJTYX12GYCYQZQC","中信建投悠享12个月持有期债券C","债券型-混合一级","ZHONGXINJIANTOUYOUXIANG12GEYUECHIYOUQIZHAIQUANC"]
*/
function fenxi(arr = []) {
  let count = 0;// 统计数量
  arr.forEach((item, index) => {
    const flag_1 = searchText.every(text => item[2].includes(text));
    const flag_2 = !noText.some(text => item[2].includes(text));
    const flag_3 = !noFundCode.some(text => item[0].includes(text));// 排除的基金号
    if (flag_1 && flag_2 && flag_3) {
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
  if (!fs.existsSync('./data_search')) {
    fs.mkdirSync('./data_search');
  }

  // 遍历obj的每个key，创建对应的json文件
  Object.keys(obj).forEach(key => {
    const fileName = `./data_search/${key}.json`;
    const content = JSON.stringify({
      count: obj[key].length,
      data: obj[key],
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
