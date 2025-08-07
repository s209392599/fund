exports.handler = (event, context, callback) => {
  // 1. 解析查询参数
  const queryParams = event.queryStringParameters || {};
  const codes = queryParams.code ? queryParams.code.split(',') : [];
  const hasZhi = queryParams.zhi === 'true' || queryParams.zhi === '1';
  const zhis = queryParams.zhicode ? queryParams.zhicode.split(',') : [];

  // 2. 生成基金图片HTML
  const generateFundImages = () => {
    const defaultFunds = [
      { code: '007467', name: '华泰柏瑞中证红利低波ETF联接C' },
      { code: '020989', name: '南方恒生科技指数发起(QDII)C' },
      { code: '023918', name: '华夏国证自由现金流ETF发起式联接C' },
      { code: '008087', name: '华夏中证5G通信主题ETF联接C' },
      { code: '021030', name: '汇添富国证港股通创新药ETF发起式联接A' },
      { code: '017057', name: '嘉实国证绿色电力ETF发起联接C' },
      { code: '023521', name: '博时上证科创板人工智能ETF发起式联接C' },
    ];

    const fundsToShow =
      codes.length > 0
        ? codes.map((code) => ({ code, name: '' }))
        : defaultFunds;

    return fundsToShow
      .map(
        (fund) =>
          `<img src="https://j4.dfcfw.com/charts/pic6/${fund.code}.png" alt="${
            fund.name || fund.code
          }">`
      )
      .join('');
  };

  // 3. 生成指数HTML（如果有base参数）
  const generateIndexImages = () => {
    if (!hasZhi) return '';

    const indices = [
      {
        code: 'zs000001',
        name: '上证指数',
        allURL: 'https://quote.eastmoney.com/zs000001.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.000001',
      },
      {
        code: 'zs399006',
        name: '创业板',
        allURL: 'https://quote.eastmoney.com/zs399006.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=0.399006',
      },
      {
        code: 'zs000300',
        name: '沪深300',
        allURL: 'https://quote.eastmoney.com/zs000300.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.000300',
      },
      {
        code: 'zs000016',
        name: '上证50',
        allURL: 'https://quote.eastmoney.com/zs000016.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.000016',
      },
      {
        code: 'zs000688',
        name: '科创50',
        allURL: 'https://quote.eastmoney.com/zs000688.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.000688',
      },
      {
        code: 'zs399001',
        name: '深证成指',
        allURL: 'https://quote.eastmoney.com/zs399001.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=0.399001',
      },
      {
        code: 'sh515450',
        name: '红利低波50ETF',
        allURL: 'https://quote.eastmoney.com/sh515450.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.515450',
      },
      {
        code: 'zs899050',
        name: '北证50',
        allURL: 'https://quote.eastmoney.com/zs899050.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=0.899050',
      },
      {
        code: 'spx500',
        name: '标普500',
        allURL: 'https://quote.eastmoney.com/gb/zsSPX.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=100.SPX',
      },
      {
        code: 'ndaq',
        name: '纳斯达克',
        allURL: 'https://quote.eastmoney.com/gb/zsNDX.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=100.NDX',
      },
      {
        code: 'dji',
        name: '道琼斯',
        allURL: 'https://quote.eastmoney.com/gb/zsDJIA.html',
        imgURL:
          'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=100.DJIA',
      },
    ];

    let arr_zhi = [];
    // 从indices中读取zhis
    if (zhis.length > 0) {
      zhis.forEach((zhi) => {
        let index = indices.find((index) => index.code === zhi);
        if (index) {
          arr_zhi.push(index);
        }
      });
    }

    let endArr = indices;
    if (zhis.length) {
      endArr = arr_zhi;
    }

    return endArr
      .map((index) => `<img src="${index.imgURL}" alt="${index.name}">`)
      .join('');
  };

  // 4. 生成 HTML 响应
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>涨幅速览</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #imgbox {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  img {
    display: block;
    border: 1px solid #ddd;
    margin: 2px;
    height: 160px;
    width: calc(50% - 4px);
  }
  @media (min-width: 1440px) {
    img {
      width: calc(33.33% - 4px);
    }
  }
  @media (min-width: 1920px) {
    img {
      width: calc(25% - 4px);
    }
  }
</style>
</head>
<body>
<div id="imgbox">
  ${generateFundImages()}
  ${generateIndexImages()}
</div>
</body>
</html>`;
  /* ${generateIndexImages()}  指数 */

  // 5. 返回响应
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
    body: html,
  });
};
