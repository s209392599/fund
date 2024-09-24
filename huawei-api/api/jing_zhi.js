/* 累计、单位净值、涨跌幅 */
const fetch = require('node-fetch');

exports.handler = async function (requestData) {
  const code = requestData.code || '400030';
  const size = requestData.size || 2;
  const url = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":${size},"channel":"9"}`;

  try {
    const res = await fetch(url, {});
    const data = await res.json();
    var resultData = data.resultData || {};
    var datas = resultData.datas || {};
    var netValueList = datas.netValueList || [];
    return {
      success: true,
      data: netValueList,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
