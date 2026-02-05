// 财联社
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码


/*
https://www.cls.cn/finance 看盘(app)
https://x-quote.cls.cn/v2/quote/a/stock/emotion?app=CailianpressWeb&os=web&sv=8.4.6
https://x-quote.cls.cn/v2/quote/a/stock/emotion?app=cailianpress&channel=0 市场,与上面等同

https://www.cls.cn/quotation 涨跌分布(PC)
https://x-quote.cls.cn/quote/index/home?app=CailianpressWeb&os=web&sv=8.4.6
https://x-quote.cls.cn/quote/index/home?app=cailianpress&channel=0 市场,与上面等同
*/
router.post('/fund_cls_kanpan_app', (req, res) => {
  try {
    let u = `https://x-quote.cls.cn/v2/quote/a/stock/emotion?app=cailianpress`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = {...data.data};
        delete resultData.limit_up_board;
        res.send({
          code: 200,
          msg: '成功',
          data: resultData,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `获取看盘异常`,
      data: [],
    });
  }
});


/*
https://www.cls.cn/quotation - 主力净流入排行榜
*/
router.post('/fund_cls_zhuliu', (req, res) => {
  const {main_fund_diff=0} = req.body;
  try {
    let u = `https://x-quote.cls.cn/web_quote/web_stock/index_stock_list`;
    fetch(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        os: 'web',
        // sv: '8.4.6',
        app: 'CailianpressWeb',
        main_fund_diff: main_fund_diff,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        let main_fund_diff = data?.data?.main_fund_diff || [];
        let turnData = main_fund_diff.map((item) => {
          return {
            "secu_name": item.secu_name,
            "secu_code": item.secu_code,
            "last_px": item.last_px,
            "change": item.change,
            "main_fund_diff": item.main_fund_diff,
          }
        });
        res.send({
          code: 200,
          msg: '成功',
          data: turnData,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `获取主力流出异常`,
      data: [],
    });
  }
})



module.exports = router;
