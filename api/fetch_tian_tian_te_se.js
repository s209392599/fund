// 天天基金特色数据接口，包含波动率、夏普率、最大回撤、跟踪误差等数据

const fetch = require('node-fetch');
const fs = require('fs');

const params = {
  // deviceid: '6f30ee0f6eb7f60f3bb8ffaa38b18858',
  // version: '9.9.9',
  // appVersion: '6.5.5',
  product: 'EFund',
  plat: 'Web',
  uid: '',
  fcode: '007467',
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

// 特色数据

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

async function fetchFundData() {
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

    const wrobj = {
      raw: responseData,
      result,
    }
    fs.writeFileSync('zzz_data.json', JSON.stringify(wrobj, null, 2));
    console.log('基金数据已保存到 zzz_data.json 文件');

  } catch (error) {
    console.error('错误:', error.message);
  }
}

// 执行函数
fetchFundData();
