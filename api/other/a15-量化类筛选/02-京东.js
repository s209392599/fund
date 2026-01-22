const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../utils/noFundCode.js'); // 排除的基金代码

const filter_data = require('./data/filter.json');

const info  = {
  // filter_data: filter_data
  filter_data: [
    {
    "fund_code": "000063",
    "fund_name": "长盛电子信息主题灵活配置混合",
    "fund_type": "混合型-灵活"
  },
  {
    "fund_code": "000165",
    "fund_name": "国投瑞银策略精选混合",
    "fund_type": "混合型-灵活"
  },
  {
    "fund_code": "000404",
    "fund_name": "易方达新兴成长灵活配置",
    "fund_type": "混合型-灵活"
  },
  {
    "fund_code": "000545",
    "fund_name": "中邮核心竞争力灵活配置混合",
    "fund_type": "混合型-灵活"
  },
  {
    "fund_code": "000594",
    "fund_name": "大摩进取优选股票",
    "fund_type": "股票型"
  }
  ]
}

async function getHisData(fundCode) {
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fundCode}","itemId":"","clientVersion":"","channel":"9"}`;
    let response = await fetch(u);
    const res = (await response.json()) || {};
    let resultData = res.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}

async function jingdongBaseInfo() {
  let new_data = [];
  for (let i = 0; i < info.filter_data.length; i++) {
    let item = info.filter_data[i];
    console.log(`第 ${i + 1} 个 ${item.fund_code}-${item.fund_name} 的基本信息...`);
    try {
      let datas = await getHisData(item.fund_code);
      if (datas) {
        // 跳过不可买
        if (!datas.isForSale) {
          continue;
        }

        // 跳过成立不到1年的基金
        const fundProfileOfItem = datas.fundProfileOfItem || {};
        const establishedDate = fundProfileOfItem.establishedDate || '';
        if (establishedDate && Date.now() - new Date(establishedDate).getTime() < 365 * 24 * 60 * 60 * 1000) {
          continue;
        }
        // 跳过规模不到一亿
        const fundScale = fundProfileOfItem.fundScale || '';
        if (!fundScale.includes('亿元')) {
          continue;
        }

        // 跳过近 1月、3月、6月排名靠后的
        const obj_1 = datas.performanceOfItem || {};
        const obj_2 = obj_1.historyPerformanceMap || {};
        const obj_3 = obj_2.historyPerformanceList || [];
        const rank_1 = (obj_3[1] || {}).rank || '';
        const rank_3 = (obj_3[2] || {}).rank || '';
        const rank_6 = (obj_3[3] || {}).rank || '';
        if (rank_1.includes('/') && rank_3.includes('/') && rank_6.includes('/')) {
          let rank_1_num = Number(rank_1.split('/')[0]) / Number(rank_1.split('/')[1]);
          let rank_3_num = Number(rank_3.split('/')[0]) / Number(rank_3.split('/')[1]);
          let rank_6_num = Number(rank_6.split('/')[0]) / Number(rank_6.split('/')[1]);

          console.log('rank_1_num',rank_1_num,rank_1.split('/')[0],rank_1.split('/')[1]);
          console.log('rank_3_num',rank_3_num,rank_3.split('/')[0],rank_3.split('/')[1]);
          console.log('rank_6_num',rank_6_num,rank_6.split('/')[0],rank_6.split('/')[1]);

          if (rank_1_num > 0.5 && rank_3_num > 0.5 && rank_6_num > 0.5) {
            continue;
          }
        }

        // 近1年年化大于20
        const rate_12 = (obj_3[4] || {}).rate || 0;
        if (parseFloat(rate_12) < 20) {
          continue;
        }

        new_data.push(item);
      } else {
        new_data.push(item);
      }
    } catch (err) {
      new_data.push(item);
    }
  }
  info.filter_data = new_data;
  console.log(`符合京东金融能读取基本信息的基金有 ${info.filter_data.length} 个`);
}


async function main() {
  try {

    // 京东金融基本信息
    await jingdongBaseInfo();


    // fs.writeFileSync('./data/filter_jingdong.json', JSON.stringify(info.filter_data));

  } catch (err) {
    console.log('err => ', err);
  }
}
main();
