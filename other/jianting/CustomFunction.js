const fs = require('fs');
const path = require('path');

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

// https://ms.jr.jd.com/gw2/generic/life/h5/m/getChangesInNetAssets 规模变动



module.exports = {
  emptyDirectory,// 清空文件夹
  getFundInfo,// 获取基金详情

};
// 调用示例
// const { getFundInfo } = require('./CustomFunction');
