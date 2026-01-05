// 天天基金上的接口
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
router.post('/fund_jd_detailPageInfoWithNoPin11111111', (req, res) => {
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

function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str;
}
// 获取实时涨幅
router.post('/fund_amain_getfundgz', (req, res) => {
  const { fund_code = '', pageSize = 10 } = req.body;
  var isSixDigitNumber = /^\d{6}$/.test(fund_code); // 6位数字��类型
  if (!isSixDigitNumber) {
    res.send({
      code: 400,
      msg: '未正确获取到基金代码',
      data: [],
    });
    return;
  }
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fund_code}.js?rt=${+new Date()}`;
    fetch(u, {})
      .then((data) => data.text())
      .then((data) => {
        if (data.length > 250) {
          res.send({
            code: 400,
            msg: '此基金号可能暂未开放，请确认',
            data: [],
          });
        } else {
          let str = realTimeInformation(data);
          let obsData = JSON.parse(str || '{}');
          res.send({
            code: 200,
            msg: '成功',
            data: {
              fund_code: fund_code,
              fund_name: obsData.name || '',
              gszzl: obsData.gszzl || '',
              dwjz: obsData.dwjz || '',
              gsz: obsData.gsz || '',
              gztime: obsData.gztime || '',
            },
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
