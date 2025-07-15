const fetch = require("node-fetch");

// https://lc.jr.jd.com/finance/fund/latestdetail/buySellInfo/?activeIndex=0&fundCode=007769

// 下面的也可以直接请求 2024年09月19日10:26:42
// https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"400030","pageChannel":"detail","channel":"9"}
exports.handler = (req, resp, context) => {
  console.log('req.queries', req.queries)
  var code = req.queries.code || '400030';
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;
  fetch(u, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded",
    },
    "body": `reqData={"fundCode":"${code}","orderLimit":"","channel":"9"}`,
    "method": "POST",
  })
    .then(res => res.json())
    .then(res => {
      // console.log('res',res);
      var resultData = res.resultData || {};
      var datas = resultData.datas || {};
      resp.send(JSON.stringify(datas));
    }).catch(err => {
      resp.send(JSON.stringify('error'));
    })
}

/*
{
   "isNewFund": false,
   "purchaseRule": {
      "purchaseProcess": [
         {
            "title": "买入",
            "info": "03-22 15:00前"
         },
         {
            "title": "确认份额",
            "info": "03-25(周一)"
         },
         {
            "title": "查看盈亏",
            "info": "03-25(周一)净值更新后"
         }
      ],
      "purcheseDescribeList": [],
      "dayLimitAmount": "无限额",
      "depositFeeRatio": "0.20%(每年)",
      "manageFeeRatio": "0.70%(每年)",
      "purchaseStatus": "开放申购",
      "aipMinAmount": "100.00元",
      "purchaseMinAmount": "1.00元",
      "purchaseFeeRatio": [
         {
            "discountedRate": "0.00%",
            "divideIntervalDesc": "任意金额"
         }
      ],
      "aipStatus": "可定投",
      "saleServiceFeeRatio": "0.40%(每年)"
   },
   "redeemRule": {
      "redeemFeeRatio": [
         {
            "rate": "1.50%",
            "divideIntervalDesc": "持有期限＜7日"
         },
         {
            "rate": "0.10%",
            "divideIntervalDesc": "7日≤持有期限＜30日"
         },
         {
            "rate": "0.00%",
            "divideIntervalDesc": "持有期限≥30日"
         }
      ],
      "redeemMinPortion": "1.00份",
      "redeemBankProcess": [
         {
            "title": "赎回",
            "info": "03-22 15:00前"
         },
         {
            "title": "确认份额",
            "info": "03-25(周一)"
         },
         {
            "title": "预计到账",
            "info": "03-27(周三)"
         }
      ],
      "redeemStatus": "开放赎回",
      "redeemHoldPortion": "1.00份",
      "redeemText": [],
      "redeemXjkProcess": [
         {
            "title": "赎回",
            "info": "03-22 15:00前"
         },
         {
            "title": "确认份额",
            "info": "03-25(周一)"
         },
         {
            "title": "预计到账",
            "info": "03-25(周一)"
         }
      ],
      "isSupportFastRedeem": 0
   }
}
 */ 
