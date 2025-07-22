// 获取在京东金融上的skuId
var arr = [
  "007540",
  "007925",
  "017593",
  "006549",
  "000306",
  "011376",
  "014767",
  "008798",
  "006760",
  "008799",
  "017045",
  "010353",
  "011249",
];
var nearArr = [];
for (let i = 0; i < arr.length; i++) {
  setTimeout(function () {
    var obj = { "itemId": "", "createOrdermaket": "", "fundCode": arr[i], "clientVersion": null, "channel": "9" };
    fetch("https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailPageInfo", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://lc.jr.jd.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "reqData=" + JSON.stringify(obj),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(res => res.json()).then(res => {
      var headerOfItem = res.resultData.datas.headerOfItem;
      var itemId = headerOfItem.itemId;
      var fundCode = headerOfItem.fundCode;
      var fundName = headerOfItem.fundName;
      var fundTypeName = headerOfItem.fundTypeName;
      var quotationsMap = headerOfItem.quotationsMap || [];
      var value = quotationsMap[0]?.value || '';
      console.log(res.resultData.datas.headerOfItem.itemId)
      nearArr[i] = { "number": fundCode, "name": fundName, "remarks": value, "notice": "", skuId: itemId };
      if (nearArr.length === arr.length) {
        console.log(nearArr)
      }
    })
  }, 100 * i)
}
