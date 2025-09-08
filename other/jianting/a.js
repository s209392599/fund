const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
var arr = [
  {
    code: '018561',
    name: '中信保诚多策略混合(LOF)C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 100,
    type: '量化',
  },
  {
    code: '002112',
    name: '德邦鑫星价值灵活配置混合C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '量化',
  },
  {
    code: '018957',
    name: '中航机遇领航混合发起C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '量化',
  },
  {
    code: '016371',
    name: '信澳业绩驱动混合C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '科技成长',
  },
  {
    code: '016858',
    name: '国金量化多因子股票C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '9月29日卖出 2025年08月25日15:23:19',
    fixed: 50,
    type: '量化',
  },
  {
    code: '018729',
    name: '华夏智胜新锐股票C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '9月29日卖出 2025年08月25日15:23:16',
    fixed: 50,
    type: '量化',
  },
  {
    code: '002834',
    name: '华夏新锦绣混合C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '10月9日卖出 2025年09月02日14:26:29',
    fixed: 100,
    type: '量化',
  },
  {
    code: '023350',
    name: '诺安多策略混合C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '10月9日卖出 2025年09月02日14:26:29',
    fixed: 50,
    type: '量化',
  },
  {
    code: '020726',
    name: '建信灵活配置混合C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '10月9日卖出 2025年09月04日15:03:33',
    fixed: 100,
    type: '量化',
  },
  {
    code: '007467',
    name: '华泰柏瑞中证红利低波ETF联接C',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '流动仓-长期存在',
    fixed: 30,
    type: '红利',
  },
  {
    code: '019260',
    name: '富国恒生红利ETF联接A',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '流动仓',
    fixed: 30,
    type: '红利',
  },
  {
    code: '023918',
    name: '华夏国证自由现金流ETF联接C',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '流动仓',
    fixed: 30,
    type: '现金流',
  },
  {
    code: '023521',
    name: '博时上证科创板人工智能ETF联接C',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '人工智能',
  },
  {
    code: '020973',
    name: '易方达机器人ETF联接C',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '机器人',
  },
  {
    code: '022691',
    name: '华安医药生物股票发起式C',
    zhang_url: '服务器监听',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '医药',
  },

  {
    code: '017437',
    name: '华宝纳斯达克精选股票发起式',
    zhang_url: '不提供',
    point_line_top: null,
    point_line_down: null,
    desc: '',
    fixed: 50,
    type: '美股',
  },
  {
    code: '012863',
    name: '汇添富中证电池主题ETF发起式联接C',
    type: '电池',
    zhang_url: '',
    fixed: '50',
    point_line_down: '0.6',
    point_line_top: '0.9',
    desc: '09-05：开启两周的小定投，11月份出货',
  },
  {
    code: '012322',
    name: '东财云计算增强C',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '9月16日卖出',
    fixed: 50,
    type: '云计算',
  },
  {
    code: '019103',
    name: '景顺长城恒生消费ETF联接',
    zhang_url: '',
    point_line_top: null,
    point_line_down: null,
    desc: '9-19卖出',
    fixed: 50,
    type: '消费',
  },
];

let count = 0;
async function getData() {
  let fundCode = arr[count].code;
  let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fundCode}","itemId":"","clientVersion":"","channel":"9"}`;

  console.log(
    `正在进行第 ${count + 1} 个基金 ${fundCode} - ${
      arr[count].name
    } 的持仓请求 ~~~`
  );

  let response = await fetch(u, {});
  const res = (await response.json()) || {};
  let resultData = res.resultData || {};
  let datas = resultData.datas || {};

  // 获取投资方向
  let headerOfItem = datas.headerOfItem || {};
  let themeNameList = headerOfItem.themeNameList || []; // 投资方向
  arr[count].themeNameList = themeNameList;

  // 获取持仓
  let a_2 = datas.investmentDistributionNewOfItem || {};
  let investmentDistribution = a_2.investmentDistribution || {};
  let stock = investmentDistribution.stock || []; // 持仓
  let stockDistribution = investmentDistribution.stockDistribution || []; // 行业分布
  arr[count].stock = stock;
  arr[count].stockDistribution = stockDistribution;

  if (count < arr.length - 1) {
    count++;
    getData();
  } else {
    console.log('全部请求完毕，写入最终的cang.json');

    /*
    tableData.map(v => {
      return {
        code:v.code,
        name:v.name,
        themeNameList: v.themeNameList.map(r => r.themeName),
        stock: (v.stock || []).map(r => {
          return {
            name:r.name,
            industryName:r.industryName,
            ratio:r.ratio
          }
        }),
        stockDistribution: v.stockDistribution.length > 0 ? [v.stockDistribution[0]] : []
      }
    })
    */
    fs.writeFileSync('./cang.json', JSON.stringify(arr, null, 2));
    return;
  }
}
getData();
