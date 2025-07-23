const fs = require('fs');
const path = require('path');
const { arr } = require('./databse');

// 创建data文件夹(如果不存在)
if (!fs.existsSync('./fundData')) {
  fs.mkdirSync('./fundData');
}
emptyDirectory('./fundData'); // 清空文件夹函数

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

// 下载历史数据
async function NetValue(fundCode) {
  let netValueList = '';
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo`;

    let response = await fetch(u, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body:
        'reqData={"fundCode":"' +
        fundCode +
        '","pageNum":1,"pageSize":999999,"channel":"9"}',
      method: 'POST',
    });
    const res = (await response.json()) || {};
    netValueList = res?.resultData?.datas?.netValueList || [];
    netValueList = netValueList.reverse();
  } catch (err) {
    console.log(`累计净值--{${fundCode}}--err => `);
  }
  return netValueList;
}

// 获取所有基金的历史累计净值数据
async function getHistoryArr(code) {
  for (let i = 0; i < arr.length; i++) {
    const netValueList = await NetValue(arr[i].code);

    fs.writeFile(`./fundData/${arr[i].code}.json`, JSON.stringify(netValueList,null,2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`【${arr[i].code || ''} - ${arr[i].name || ''}】success!`);
    });
  }
}

getHistoryArr();// 获取所有基金的历史累计净值数据
