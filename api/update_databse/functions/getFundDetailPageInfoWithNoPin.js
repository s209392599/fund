const fs = require('fs');
const fetch = require('node-fetch');
// 获取基金信息
const getFundInfo = async (fundCode) => {
  let obj = {};
  try {
    let u_base = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin`;
    const response = await fetch(u_base,{
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": `reqData={"fundCode":"${fundCode}","itemId":"","clientVersion":"","channel":"9"}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    const res = (await response.json()) || {};
    obj = res?.resultData?.datas || {};
  } catch (err) {
    console.log(err)
  }
  return obj;
}
async function getBaseInfo(fundCode) {
  let res = await getFundInfo(fundCode); // 获取基金详情
  delete res.noticeList;
  delete res.question;
  fs.writeFileSync(`../logs/getFundDetailPageInfoWithNoPin_${fundCode}.json`, JSON.stringify(res, null, 2));

  if (res.fundProfileOfItem) {
    const fundScale = res.fundProfileOfItem.fundScale || '';
    if (fundScale) {
      console.log('fundScale', fundScale);
    } else {
      console.log('no scale');
    }
  } else {
    console.log('no base')
  }
}
let arr = [
  '018561',
  '007467',
  '019260',// 富国恒生红利ETF联接A
  '023521',// 博时上证科创板人工智能ETF
  '020973',// 易方达机器人ETF联接C
  '002112',// 德邦鑫星价值灵活配置混合C
  '018957',// 中航机遇领航混合发起C
  '016371',// 信澳业绩驱动混合C
  '012322',// 东财云计算增强C
  '160424',// 华安创业板50ETF联接
  '002834',// 华夏新锦绣混合C
  '022691',// 华安医药生物股票发起式C
  // '',//
  // '',//
]
arr.forEach((v,index) => {
  setTimeout(() => {
    getBaseInfo(v);
  }, 1000 * index)
})
