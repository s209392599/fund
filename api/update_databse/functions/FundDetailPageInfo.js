const fs = require('fs');
const fetch = require('node-fetch');
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
async function getBaseInfo(fundCode){
    let res = await getFundInfo(fundCode); // 获取基金详情
    fs.writeFileSync(`../logs/getFundDetailPageInfo_${fundCode}.json`, JSON.stringify(res, null, 2));

    if (res.bottomButtonOfItem) {
      const purchaseButton = res.bottomButtonOfItem.purchaseButton || {};
      if (!purchaseButton.dis_scale) {
        // 京东金融可售卖
        const fundProfileOfItem = res.fundProfileOfItem || {};
        const fundScale = fundProfileOfItem.fundScale || ''; // 资金规模
        if (fundScale) {
            console.log('fundScale',fundScale);
            
        }else{
            console.log('no scale');
        }
      }
    }else{
        console.log('no base')
    }
}
getBaseInfo('018561');