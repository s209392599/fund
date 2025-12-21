// 京东金融的一些接口
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码

/*
获取基金的基本信息
https://lc.jr.jd.com/finance/funddetail/home/?fundCode=007467
*/
router.post('/fund_jd_detailPageInfoWithNoPin', (req, res) => {
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
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fund_code}","itemId":"","clientVersion":"","channel":"9"}`;
    fetch(u, {})
      .then((data) => data.json())
      .then((data) => {
        let resultData = data.resultData || {};
        let datas = resultData.datas || {};
        delete datas.bottomButtonOfItem;
        delete datas.commonAttributeNoPin;
        delete datas.noticeList;
        delete datas.purchaseProcessOfItem;
        delete datas.question;
        delete datas.noticeOfItem; // 分红公告等

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
router.post('/fund_jd_getFundTradeRulesPageInfo', (req, res) => {
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
router.post('/fund_jd_getFundDividendPageInfo', (req, res) => {
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
router.post('/fund_jd_InvestmentDistributionPageInfo', (req, res) => {
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
router.post('/fund_jd_getFundDetailChartPageInfo', (req, res) => {
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
    let u = `
https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
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

module.exports = router;
