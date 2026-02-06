// 同花顺
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码
const { parseString } = require('xml2js');

/*
同花顺app-资讯-基金
*/
router.post('/fund_tonghusshun_news_app', async (req, res) => {
  try {
    let turnData = [];

    const urls = [
      `https://news.10jqka.com.cn/494_mlist/1_0_0_1/`,
      `https://news.10jqka.com.cn/494_mlist/1_0_0_2/`,
      `https://news.10jqka.com.cn/494_mlist/1_0_0_3/`,
      `https://news.10jqka.com.cn/494_mlist/1_0_0_4/`,
      `https://news.10jqka.com.cn/494_mlist/1_0_0_5/`
    ];

    // 依次请求每个URL
    for (const url of urls) {
      console.log(`正在请求: ${url}`);

      const response = await fetch(`${url}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} - ${url}`);
      }

      const responseData = await response.text();

      if (!responseData) {
        throw new Error('服务器返回了空响应');
      }

      // 解析 XML 数据
      const parsedData = await new Promise((resolve, reject) => {
        parseString(responseData, { explicitArray: false }, (err, result) => {
          if (err) {
            reject(new Error('XML 解析失败: ' + err.message));
          } else {
            resolve(result);
          }
        });
      });

      // 提取当前页面的 items 并添加到 turnData
      const pageItems = parsedData.xmlColumn.pageItems.item;
      let itemsToAdd = [];

      if (Array.isArray(pageItems)) {
        // 移除每个项目的 hot 字段
        itemsToAdd = pageItems.map(item => {
          const newItem = { ...item };
          delete newItem.hot;
          return newItem;
        });
        turnData = turnData.concat(itemsToAdd);
      } else if (pageItems) {
        // 如果只有一个项目，确保它被包装成数组
        const newItem = { ...pageItems };
        delete newItem.hot;
        turnData.push(newItem);
      }
    }
    res.send({
      code: 200,
      msg: '成功',
      data: turnData,
    });
  } catch (err) {
    res.send({
      code: 400,
      msg: `获取同花顺-基金要闻异常`,
      data: [],
    });
  }
});


module.exports = router;
