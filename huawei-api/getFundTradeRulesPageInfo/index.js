const fetch = require('node-fetch');
exports.handler = function (event, context, callback) {
  const error = null;
  let requestData = {};

  if (event.httpMethod === 'POST') {
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    requestData = JSON.parse(decodedBody);
  } else if (event.httpMethod === 'GET') {
    requestData = event.queryStringParameters;
  }

  const code = requestData.code || '400030';
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo`;

  fetch(u, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: `reqData={"fundCode":"${code}","orderLimit":"","channel":"9"}`,
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      let data = res.resultData.dates;
      const output = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
        body: JSON.stringify({ success: true, ...data }),
      };
      callback(error, output);
    })
    .catch((err) => {
      callback(error, { success: false, message: err.message });
    });
};

/* 京东金融基金详情页 -- [交易规则]查看详情
https://lc.jr.jd.com/finance/fund/latestdetail/buySellInfo/?activeIndex=0&fundCode=400030

下面是基金网站的返回值:
{
  "resultCode": 0,
  "resultMsg": "操作成功",
  "resultData": {
    "code": "0000",
    "datas": {
      "isNewFund": false,
      "purchaseRule": {
        "purchaseProcess": [
          {
            "title": "买入",
            "info": "09-24 15:00前"
          },
          {
            "title": "确认份额",
            "info": "09-25(周三)"
          },
          {
            "title": "查看盈亏",
            "info": "09-25(周三)净值更新后"
          }
        ],
        "purcheseDescribeList": [],
        "dayLimitAmount": "1000.00元",
        "depositFeeRatio": "0.20%(每年)",
        "manageFeeRatio": "0.70%(每年)",
        "purchaseStatus": "开放申购",
        "aipMinAmount": "10.00元",
        "purchaseMinAmount": "1.00元",
        "purchaseFeeRatio": [
          {
            "discountedRate": "0.08%",
            "rate": "0.80%",
            "divideIntervalDesc": "申购金额＜50万元"
          },
          {
            "discountedRate": "0.05%",
            "rate": "0.50%",
            "divideIntervalDesc": "50万元≤申购金额＜500万元"
          },
          {
            "discountedRate": "0.03%",
            "rate": "0.30%",
            "divideIntervalDesc": "500万元≤申购金额＜1000万元"
          },
          {
            "discountedRate": "1000.00元/笔",
            "divideIntervalDesc": "申购金额≥1000万元"
          }
        ],
        "aipStatus": "可定投",
        "saleServiceFeeRatio": "0.00%(每年)"
      },
      "redeemRule": {
        "redeemFeeRatio": [
          {
            "rate": "1.50%",
            "divideIntervalDesc": "持有期限＜7日"
          },
          {
            "rate": "0.30%",
            "divideIntervalDesc": "7日≤持有期限＜180日"
          },
          {
            "rate": "0.10%",
            "divideIntervalDesc": "180日≤持有期限＜365日"
          },
          {
            "rate": "0.05%",
            "divideIntervalDesc": "365日≤持有期限＜730日"
          },
          {
            "rate": "0.00%",
            "divideIntervalDesc": "持有期限≥730日"
          }
        ],
        "redeemMinPortion": "1.00份",
        "redeemBankProcess": [
          {
            "title": "赎回",
            "info": "09-24 15:00前"
          },
          {
            "title": "确认份额",
            "info": "09-25(周三)"
          },
          {
            "title": "预计到账",
            "info": "09-27(周五)"
          }
        ],
        "redeemStatus": "开放赎回",
        "redeemHoldPortion": "1.00份",
        "redeemText": [],
        "redeemXjkProcess": [
          {
            "title": "赎回",
            "info": "09-24 15:00前"
          },
          {
            "title": "确认份额",
            "info": "09-25(周三)"
          },
          {
            "title": "预计到账",
            "info": "09-25(周三)"
          }
        ],
        "isSupportFastRedeem": 0
      }
    },
    "success": true,
    "info": "成功"
  },
  "channelEncrypt": 0
}
*/
