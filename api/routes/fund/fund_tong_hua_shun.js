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
    "id": 4080349,
    "seq": 675235068,
    "title": "特朗普：美国正密切关注霍尔木兹海峡局势",
    "url": "https://news.10jqka.com.cn/20260312/c675235068.shtml",
    "appUrl": "https://news.10jqka.com.cn/m675235068/",
    "shareUrl": "https://news.10jqka.com.cn/tapp/news/share/675235068/",
    "stocks": [],
    "fields": [],
    "tags": [],
    "type": 1,
    "createTime": 1773275292,
    "updateTime": 1773275448,
    "summary": "当地时间3月11日，美国总统特朗普表示，美国在对伊朗的战争中处于“有利地位”，美国将重点关注霍尔木兹海峡局势。特朗普还表示，美国知道伊朗的“秘密组织”在哪里，他们都在密切监控中。本周早些时候，特朗普在接受采访时谈到霍尔木兹海峡，称他“正在考虑占领它”。（央视新闻）",
    "picUrl": null,
    "source": null,
    "readAmount": 28942,
    "shareAmount": 66
  },
]
https://www.10jqka.com.cn/ PC上“重要”的接口

*/
router.post('/fund_tonghusshun_flashnews', (req, res) => {
  const { seq = '0', pageSize = 10 } = req.body;
  try {
    const u = `https://news.10jqka.com.cn/app/flash/flashnews/v1/list?seq=${seq}&tagId=62857`;
    fetch(u, {
      headers: {
        accept: "application/json, text/plain, */*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        // 其它可选
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        const records = data?.data?.list || [];
        // fs.writeFileSync(path.join(__dirname, '../../data/choice_zixun_app.json'), JSON.stringify(records));

        const turnData = records.map(item => {
          return {
            infocode: item.code,// 新闻ID
            showtime: item.data.showtime,// 更新时间
            simdigest: item.data.simdigest || item.data.title,// 新闻标题
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
