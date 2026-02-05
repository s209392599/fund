// choice
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码


/*
https://choicew2z.eastmoney.com/info/information/detail.html?infocode=NW202602053642706328

[
  {
    "infocode": "NW202602053642763595",
    "showtime": "今天 16:25",
    "simdigest": "【“走势扭转”！免税店大扩容 高增长潜力票曝光】周四，大消费延续走强态势，免税概念领涨，茂业商业、杭州解百等涨停，百大集团、广百股份等跟涨。",
    "from": "东方财富研究中心"
  },
  {
    "infocode": "NW202602053642753441",
    "showtime": "今天 16:19",
    "simdigest": "白酒行业龙头贵州茅台（600519.SH）股价迎来反弹。2月5日，贵州茅台股价盘中逆势拉升涨超2%，总市值时隔8个多月重新站上2万亿元关口。",
    "from": "界面新闻"
  },
]
*/
router.post('/fund_choice_zixun_app', (req, res) => {
  try {
    const u = `https://choicegw.eastmoney.com/app/report/web/homePage/getInformationList?count=100`;

    fetch(u, {
      headers: {
        'appid': 'UHc7QTQqgQe0JtUsK7cdWaBIrRJYmmsJ@MOBILEAPP'
      },
    })
      .then((data) => data.json())
      .then((data) => {
        let resultData = { ...data.data };
        delete resultData.limit_up_board;

        const records = data?.data?.records || [];
        const turnData = records.map(item => {
          return {
            infocode: item.code,// 新闻ID
            showtime: item.data.showtime,// 更新时间
            simdigest: item.data.simdigest,// 新闻标题
            from: item.data.from,// 来源

          };
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
      msg: `获取异常`,
      data: [],
    });
  }
});

module.exports = router;
