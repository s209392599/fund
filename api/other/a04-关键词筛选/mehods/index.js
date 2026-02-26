const fetch = require('node-fetch');
const fs = require('fs');
const noText = require('../../../utils/noText.js'); // 排除的关键词
const noFundCode = require('../../../utils/noFundCode.js'); // 排除的基金代码

// 获取所有基金代码
async function queryResilienceInfo(search_data) {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u, { timeout: 15000 });
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);

    // 清空原数组并添加新数据，这样会修改原始数组
    search_data.length = 0; // 清空数组
    let mappedData = [];
    let len_1 = fundArray.length;
    for (let i = 0; i < len_1; i++) {
      let item = fundArray[i];
      // 不能包含 noText 中的关键词
      if (noText.some((v) => item[2].includes(v))) {
        continue;
      }
      // 不能包含 noFundCode 中的基金代码
      if (noFundCode.includes(item[0])) {
        continue;
      }
      mappedData.push({
        fund_code: item[0],
        fund_name: item[2],
        fund_type: item[3],
      });
    }

    search_data.push(...mappedData); // 将新数据推入原数组
    console.log(`一共有${fundArray.length}个基金需要过滤`);
  } catch (err) {
    console.log('err => ', err);
  }
}

async function filter_keywords(obj) {
  let filter_data = obj.filter_data || [];
  const {
    keyword_arr = [],// 包含的关键词
    noFundType = [],// 不要的基金类型关键词
    noEndWith = [],// 不以什么结尾
    extraFundNameArr = [],// 额外去除的关键词或者基金名称
    extraFundCodeArr = [],// 额外去除的基金代码
    extraAddFundArr = [],// 额外添加的基金代码
  } = obj;
  // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  let newArr = [];
  let all_fund_len = filter_data.length;
  for (let i = 0; i < all_fund_len; i++) {
    let item = filter_data[i];
    let fund_code = item.fund_code; // 基金代码
    let fund_name = item.fund_name; // 基金名称
    let fund_type = item.fund_type; // 基金类型
    // 需要包含 量化、策略、灵活、因子、增强、绝对收益、动量、成长、趋势、绩优、智选、优选、精选
    if (keyword_arr.length > 0) {
      if (!keyword_arr.some((v) => fund_name.includes(v))) {
        continue;
      }
    }

    // 基金类型中不能有货币、债券
    if (fund_type) {
      if (noFundType.some((v) => fund_type.includes(v))) {
        continue;
      }
    }
    // 不能以 A、ETF、(后端) 结尾
    if (noEndWith.some((v) => fund_name.endsWith(v))) {
      continue;
    }
    // 额外去除的关键词或者基金名称
    if (extraFundNameArr.some((v) => fund_name.includes(v))) {
      continue;
    }
    // 额外去除的基金代码
    if (extraFundCodeArr.includes(fund_code)) {
      continue;
    }

    newArr.push({
      fund_code: item.fund_code,
      fund_name: item.fund_name,
      fund_type: item.fund_type,
    });
  }
  newArr = newArr.concat(extraAddFundArr);// 额外添加的基金

  // 修改原始数组的内容
  filter_data.length = 0;
  filter_data.push(...newArr);
  console.log(`符合关键词关键词的有${newArr.length}个基金`);
}

// 获取买卖费率
async function getFundTradeRulesPageInfo(fund_code) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"${fund_code}"}`;
    const response = await fetch(u, { timeout: 15000 });
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};

    return datas;
  } catch (err) {
    console.log('error => ', err);
    return null;
  }
}

function realTimeInformation(str) {
  if (str.startsWith('jsonpgz(')) {
    str = str.slice(8);
  }
  if (str.endsWith(');')) {
    str = str.substring(0, str.length - 2);
  }
  return str;
}
// 获取基金实时涨幅
async function getFundGz(fundCode) {
  try {
    let u = `https://fundgz.1234567.com.cn/js/${fundCode}.js?rt=${+new Date()}`;
    let response = await fetch(u, { timeout: 15000 });
    const res = (await response.text()) || {};
    let str = realTimeInformation(res);
    let obsData = JSON.parse(str || '{}');
    return obsData.hasOwnProperty('gszzl');
  } catch (err) {
    return false;
  }
}
// 获取京东金融基本信息
async function getJingdongBaseInfo(fundCode) {
  try {
    let u = `https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?reqData={"fundCode":"${fundCode}","itemId":"","clientVersion":"","channel":"9"}`;
    let response = await fetch(u, { timeout: 15000 });
    const res = (await response.json()) || {};
    let resultData = res.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}

// 获取京东金融回撤修复
async function getFundDetailChartPageInfo(fund_code) {
  try {
    let base_url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDetailChartPageInfo?`;
    let u = `${base_url}reqData={"chartType":7,"fundCode":"${fund_code}","dataCycle":4,"disclosureType":1}`;
    const response = await fetch(u, { timeout: 15000 });
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    return null;
  }
}

function isEmpty(value) {
  function isArray(object) {
    return object instanceof Array;
  }
  return (value === null ||
    value === undefined ||
    (isArray(value) && value.length === 0) ||
    value === 'null' ||
    value === 'undefined' ||
    JSON.stringify(value) === '{}' ||
    JSON.stringify(value) === '[]' ||
    value === '' ||
    value === '--');
}
function handleFeatureData(params) {
  const { data, BTYPE } = params;

  const configMap = {
    volatility: ['波动较大', '波动尚可', '波动较低', '波动很小'],
    sharp: ['性价比较低', '性价比尚可', '性价比较高', '性价比很高'],
    maxReturn: ['回撤较大', '回撤尚可', '回撤较小', '回撤很低'],
    trackingError: ['跟踪误差大', '跟踪误差较大', '跟踪误差较小', '跟踪误差小'],
  };

  const descMap = {
    volatility: '波动率',
    sharp: '夏普比率',
    maxReturn: '最大回撤',
    trackingError: '跟踪误差',
  };
  const result = [];
  Object.keys(data).forEach((key) => {
    let empty = true;
    const item = data[key];
    const temp = [];
    Object.keys(item).forEach((key2) => {
      if (empty) {
        empty = isEmpty(item[key2].value);
      }

      let percent = 1 - (parseFloat(item[key2].rank) / parseFloat(item[key2].NumberOfSamples));
      if (percent * 100 < 0.5) {
        percent = 0.01;
      }
      if (percent * 100 > 99.5) {
        percent = 0.99;
      }
      let compare = isEmpty(percent) ? '--' : `优于${Number((percent) * 100).toFixed(0)}%同类`;
      if (Number.isNaN(percent)) {
        compare = '暂无排行';
      }
      const index = Math.floor(percent * 4);
      if (key2 !== 'trackingError' || BTYPE === '04') {
        let value = '';
        // if (key2 !== 'sharp') {
        //   value = isEmpty(item[key2].value) ? '--' : `${numeral(item[key2].value).format('0.00')}%`;
        // } else {
        //   value = isEmpty(item[key2].value) ? '--' : `${numeral(item[key2].value).format('0.00')}`;
        // }
        if (key2 !== 'sharp') {
          value = isEmpty(item[key2].value) ? '--' : item[key2].value.toFixed(2) + '%';
        } else {
          value = isEmpty(item[key2].value) ? '--' : item[key2].value.toFixed(2);
        }

        temp.push({
          key: key2,
          name: descMap[key2],
          value,
          valueRaw: item[key2].value,
          percent: isEmpty(percent) ? '' : percent,
          levelText: configMap[key2][index],
          compare,
        });
      }
    });
    result.push({
      isEmpty: empty,
      list: temp,
    });
  });
  return result;
}
function turnData(params) {
  const { uniqueInfo = {}, baseInfo = {} } = params;
  const BTYPE = baseInfo[0].BTYPE;
  const {
    STDDEV1,
    STDDEV_1NRANK,
    STDDEV_1NFSC,
    STDDEV3,
    STDDEV_3NRANK,
    STDDEV_3NFSC,
    STDDEV5,
    STDDEV_5NRANK,
    STDDEV_5NFSC,
    SHARP1,
    SHARP_1NRANK,
    SHARP_1NFSC,
    SHARP3,
    SHARP_3NRANK,
    SHARP_3NFSC,
    SHARP5,
    SHARP_5NRANK,
    SHARP_5NFSC,
    MAXRETRA1,
    MAXRETRA_1NRANK,
    MAXRETRA_1NFSC,
    MAXRETRA3,
    MAXRETRA_3NRANK,
    MAXRETRA_3NFSC,
    MAXRETRA5,
    MAXRETRA_5NRANK,
    MAXRETRA_5NFSC,
    TRKERROR1,
    TRKERROR_1NRANK,
    TRKERROR_1NFSC,
    TRKERROR3,
    TRKERROR_3NRANK,
    TRKERROR_3NFSC,
    TRKERROR5,
    TRKERROR_5NRANK,
    TRKERROR_5NFSC
  } = uniqueInfo[0] || {};

  const data = {
    oneYear: {
      volatility: {
        value: STDDEV1,
        rank: STDDEV_1NRANK,
        NumberOfSamples: STDDEV_1NFSC,
      },
      sharp: {
        value: SHARP1,
        rank: SHARP_1NRANK,
        NumberOfSamples: SHARP_1NFSC,
      },
      maxReturn: {
        value: MAXRETRA1,
        rank: MAXRETRA_1NRANK,
        NumberOfSamples: MAXRETRA_1NFSC,
      },
      trackingError: {
        value: TRKERROR1,
        rank: TRKERROR_1NRANK,
        NumberOfSamples: TRKERROR_1NFSC,
      },
    },
    threeYear: {
      volatility: {
        value: STDDEV3,
        rank: STDDEV_3NRANK,
        NumberOfSamples: STDDEV_3NFSC,
      },
      sharp: {
        value: SHARP3,
        rank: SHARP_3NRANK,
        NumberOfSamples: SHARP_3NFSC,
      },
      maxReturn: {
        value: MAXRETRA3,
        rank: MAXRETRA_3NRANK,
        NumberOfSamples: MAXRETRA_3NFSC,
      },
      trackingError: {
        value: TRKERROR3,
        rank: TRKERROR_3NRANK,
        NumberOfSamples: TRKERROR_3NFSC,
      },
    },
    fiveYear: {
      volatility: {
        value: STDDEV5,
        rank: STDDEV_5NRANK,
        NumberOfSamples: STDDEV_5NFSC,
      },
      sharp: {
        value: SHARP5,
        rank: SHARP_5NRANK,
        NumberOfSamples: SHARP_5NFSC,
      },
      maxReturn: {
        value: MAXRETRA5,
        rank: MAXRETRA_5NRANK,
        NumberOfSamples: MAXRETRA_5NFSC,
      },
      trackingError: {
        value: TRKERROR5,
        rank: TRKERROR_5NRANK,
        NumberOfSamples: TRKERROR_5NFSC,
      },
    },
  };

  return handleFeatureData({ data, BTYPE });
}
// 获取天天基金的特色数据(波动率、夏普率、最大回撤等)
// https://h5.1234567.com.cn/app/fund-details/?fCode=022004  天天基金手机端分享出来
async function getFundFeatureData(fund_code) {
  const params = {
    // deviceid: '6f30ee0f6eb7f60f3bb8ffaa38b18858',
    // version: '9.9.9',
    // appVersion: '6.5.5',
    product: 'EFund',
    plat: 'Web',
    uid: '',
    fcode: fund_code,
    indexfields: '_id,INDEXCODE,BKID,INDEXNAME,INDEXVALUA,NEWINDEXTEXCH,PEP100',
    fields:
      'BENCH,ESTDIFF,INDEXNAME,LINKZSB,INDEXCODE,NEWTEXCH,FTYPE,FCODE,BAGTYPE,RISKLEVEL,TTYPENAME,PTDT_FY,PTDT_TRY,PTDT_TWY,PTDT_Y,DWDT_FY,DWDT_TRY,DWDT_TWY,DWDT_Y,MBDT_FY,MBDT_TRY,MBDT_TWY,MBDT_Y,YDDT_FY,YDDT_TRY,YDDT_TWY,YDDT_Y,BFUNDTYPE,YMATCHCODEA,RLEVEL_SZ,RLEVEL_CX,ESTABDATE,JJGS,JJGSID,ENDNAV,FEGMRQ,SHORTNAME,TTYPE,TJDIN,FUNDEXCHG,LISTTEXCHMARK,FSRQ,ISSBDATE,ISSEDATE,FEATURE,DWJZ,LJJZ,MINRG,RZDF,PERIODNAME,SYL_1N,SYL_LN,SYL_Z,SOURCERATE,RATE,TSRQ,BTYPE,BUY,BENCHCODE,BENCH_CORR,TRKERROR,BENCHRATIO,NEWINDEXTEXCH,BESTDT_STRATEGY,BESTDT_Y,BESTDT_TWY,BESTDT_TRY,BESTDT_FY',
    fundUniqueInfo_fIELDS:
      'FCODE,STDDEV1,STDDEV_1NRANK,STDDEV_1NFSC,STDDEV3,STDDEV_3NRANK,STDDEV_3NFSC,STDDEV5,STDDEV_5NRANK,STDDEV_5NFSC,SHARP1,SHARP_1NRANK,SHARP_1NFSC,SHARP3,SHARP_3NRANK,SHARP_3NFSC,SHARP5,SHARP_5NRANK,SHARP_5NFSC,MAXRETRA1,MAXRETRA_1NRANK,MAXRETRA_1NFSC,MAXRETRA3,MAXRETRA_3NRANK,MAXRETRA_3NFSC,MAXRETRA5,MAXRETRA_5NRANK,MAXRETRA_5NFSC,TRKERROR1,TRKERROR_1NRANK,TRKERROR_1NFSC,TRKERROR3,TRKERROR_3NRANK,TRKERROR_3NFSC,TRKERROR5,TRKERROR_5NRANK,TRKERROR_5NFSC', // 特色数据
    fundUniqueInfo_fLFIELDS: 'FCODE,BUSINESSTYPE,BUSINESSTEXT,BUSINESSCODE,BUSINESSSUBTYPE,MARK', // 大数据榜单入口
    cfhFundFInfo_fields: 'INVESTMENTIDEAR,INVESTMENTIDEARIMG',
    ISRG: 0,
    relateThemeFields: 'FCODE,SEC_CODE,SEC_NAME,CORR_1Y,OL2TOP',
  }
  try {
    const response = await fetch("https://dgs.tiantianfunds.com/merge/m/api/jjxqy1_2", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "validmark": "6f30ee0f6eb7f60f3bb8ffaa38b18858"
      },
      "referrer": "https://h5.1234567.com.cn/",
      "body": new URLSearchParams(params),
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    const responseData = await response.json();
    if (!responseData) {
      throw new Error('服务器返回了空响应');
    }
    const records = responseData?.data || {};
    const result = turnData(records);
    return result;
  } catch (err) {
    console.log('err => ', err);
    return null;
  }
}

// 获取京东金融-基金综合诊断
async function getFundDiagnosisPageInfo(skuId) {
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundDiagnosisPageInfo?reqData={"skuId":"${skuId}","dataCycle":"12"}`;
    const response = await fetch(u);
    const data = await response.json();
    let resultData = data.resultData || {};
    let datas = resultData.datas || {};
    return datas;
  } catch (err) {
    console.log('error => ', err);
    return null;
  }
}

// 导出所有方法
module.exports = {
  queryResilienceInfo, // 获取所有基金代码
  filter_keywords, // 过滤关键词
  getFundGz, // 获取基金实时涨幅
  getJingdongBaseInfo, // 获取京东金融基本信息
  getFundDetailChartPageInfo, // 获取京东金融回撤修复
  getFundTradeRulesPageInfo, // 获取基金买卖费率
  getFundFeatureData, // 获取基金特色数据(波动率、夏普率、最大回撤等)
  getFundDiagnosisPageInfo, // 获取基金综合诊断
};
