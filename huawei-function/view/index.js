/* 自定义基金号的涨幅预览和指数预览了
https://775477fdb4134cd5924c62381cf95ed0.apig.cn-east-3.huaweicloudapis.com/view?code=008701,021298&zhi=1&zhicode=zs000001,zs399006

code:后面用英文逗号分割(注意输入债券型没有意义)
zhi: 1或者true 是开启指数
zhicode: 是输入指数的code
*/

/*
长期推荐组合：
020989-南方恒生科技指数发起C
023918-华夏国证自由现金流C
008164-南方红利低波50ETFC
007467-华泰柏瑞中证红利低波C
006980-国寿安保泰恒纯债债券
016870-景顺长城稳健增益C

其它5+推荐：
007540-华泰保兴安悦债券A
007584-鹏华丰鑫债券A

*/
var arr = [
  /*
  007467  华泰柏瑞中证红利低波ETF联接C
008164 南方红利低波50ETF联接C
020989 南方恒生科技指数发起(QDII)C
008087 华夏中证5G通信主题ETF联接C
{ code: '023918', name: '华夏国证自由现金流ETF发起式联接C' },
{ code: '023521', name: '博时上证科创板人工智能ETF发起式联接C' },
015566 万家精选混合C
023918-华夏国证自由现金流C

  */
]
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
      { code: '008164', name: '南方红利低波50ETF联接C',url:'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.515450' },
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
        (item) =>{
          let altstr = item.name || item.code;
          if(!item.url){
            return `<img src="https://j4.dfcfw.com/charts/pic6/${item.code}.png" alt="${altstr}">`
          }else{
            return `<img src="${item.url}" alt="${altstr}">`
          }
        }
      )
      .join('');
  };

  // 3. 生成指数HTML（如果有base参数）
  const generateIndexImages = () => {
    if (!hasZhi) return '';

    const indices = [
      // {
      //   code: 'sh515450',
      //   name: '红利低波50ETF',
      //   allURL: 'https://quote.eastmoney.com/sh515450.html',
      //   imgURL:
      //     'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.515450',
      // },
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
    // isBase64Encoded: false
  });
};
