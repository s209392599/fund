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

https://www.cls.cn/quotation 涨跌分布(PC)
https://x-quote.cls.cn/quote/index/home?app=CailianpressWeb&os=web&sv=8.4.6
*/
router.post('/fund_cls_detailPageInfoWithNoPin', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;

  if (!fund_code) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://x-quote.cls.cn/v2/quote/a/stock/emotion?app=CailianpressWeb&os=web&sv=8.4.6`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        res.send({
          code: 200,
          msg: '成功',
          data: data.data,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fund_code}未能正确获取到值`,
      data: [],
    });
  }
});

/* 获取基金历史净值
https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=007467&disclosureType=1&activeIndex=4
https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"007467","pageNum":1,"pageSize":20,"channel":"9"}
*/
router.post('/fund_cls_HistoryNetValuePageInfo', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;

  if (!fund_code) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${fund_code}","pageNum":1,"pageSize":${pageSize},"channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        datas.netValueList = datas.netValueList.reverse();
        res.send({
          code: 200,
          msg: '成功',
          data: datas,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fund_code}未能正确获取到值`,
      data: [],
    });
  }
});

// 获取基金的买卖规则
router.post('/fund_cls_getFundTradeRulesPageInfo', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;

  if (!fund_code) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        res.send({
          code: 200,
          msg: '成功',
          data: datas,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fund_code}未能正确获取到值`,
      data: [],
    });
  }
});

// 获取基金分红
router.post('/fund_cls_getFundDividendPageInfo', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;

  if (!fund_code) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDividendPageInfo?reqData={"fundCode":"${fund_code}","pageNum":1,"pageSize":20,"channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        res.send({
          code: 200,
          msg: '成功',
          data: datas,
        });
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fund_code}未能正确获取到值`,
      data: [],
    });
  }
});

// 获取基金持仓
router.post('/fund_cls_InvestmentDistributionPageInfo', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;

  if (!fund_code) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundInvestmentDistributionPageInfo?reqData={"itemId":"111934","fundCode":"${fund_code}","reportDate":"","channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        if (!data.success) {
          res.send({
            code: 400,
            msg: `${fund_code}服务器获取出错`,
            data: [],
          });
        } else {
          let resultData = data.resultData || {};
          let datas = resultData.datas || {};
          res.send({
            code: 200,
            msg: '成功',
            data: datas.investmentDistribution || {},
          });
        }
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fund_code}未能正确获取到值`,
      data: [],
    });
  }
});

// 基金修复
router.post('/fund_cls_getFundDetailChartPageInfo', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;

  if (!fund_code) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let base_url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?`;
    let u = `${base_url}reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        if (!data.success) {
          res.send({
            code: 400,
            msg: `${fund_code}服务器获取出错`,
            data: [],
          });
        } else {
          let resultData = data.resultData || {};
          let datas = resultData.datas || {};
          delete datas.restorePointList;
          delete datas.retracementPointList;
          delete datas.chartName;
          res.send({
            code: 200,
            msg: '成功',
            data: datas || {},
          });
        }
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `${fund_code}未能正确获取到值`,
      data: [],
    });
  }
});

// https://show.jd.com/m/ZL5vVEgDqrY4lBKr/?pageKey=ZL5vVEgDqrY4lBKr&rankCode=432126255181888
// 获取京东金融上面的“今日加仓榜”
router.post('/fund_cls_getWealthDatas', (req, res) => {
  const { reqData = {} } = req.body;
  console.log('reqData',reqData);

  try {
    let u = `https://ms.jr.jd.com/gw2/generic/opdataapi/newh5/m/getWealthDatas`;
    fetch(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        reqData:reqData
      })
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data.success) {
          res.send({
            code: 400,
            msg: `服务器获取出错`,
            data: [],
          });
        } else {
          let resultData = data.resultData || {};
          let obj_1 = resultData.data || {};
          let obj_2 = obj_1.data || [];
          res.send({
            code: 200,
            msg: '成功',
            data: obj_2 || [],
          });
        }
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `未能正确获取到值`,
      data: [],
    });
  }
});


// https://show.jd.com/m/ZL5vVEgDqrY4lBKr/?pageKey=ZL5vVEgDqrY4lBKr&rankCode=432126255181888 进阶基金榜单
router.post('/fund_cls_getInvestResearchRank', (req, res) => {
  const { reqData = {} } = req.body;
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/jj/newh5/m/getInvestResearchRank`;
    fetch(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        reqData: reqData
      })
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data.success) {
          res.send({
            code: 400,
            msg: `服务器获取出错`,
            data: [],
          });
        } else {
          let resultData = data.resultData || {};
          let obj_1 = resultData.datas || {};
          const productTabList = obj_1.productTabList || [];
          const productList = (productTabList[0] || {}).productList || [];
          res.send({
            code: 200,
            msg: '成功',
            data: productList,
          });
        }
      });
  } catch (err) {
    res.send({
      code: 400,
      msg: `未能正确获取到值`,
      data: [],
    });
  }
});

module.exports = router;
