const fs = require('fs');
// 创建data文件夹(如果不存在)
if (!fs.existsSync('./data_all')) {
  fs.mkdirSync('./data_all');
}
emptyDirectory('./data_all'); // 清空文件夹函数

var arr = [
  {
    code: '020989',
    name: '南方恒生科技指数发起C',
    zhang_img: 'https://j4.dfcfw.com/charts/pic6/020989.png',
  },
  {
    code: '023918',
    name: '华夏国证自由现金流C',
    zhang_img: 'https://j4.dfcfw.com/charts/pic6/023918.png',
  },
  {
    code: '008164',
    name: '南方红利低波50ETFC',
    // 实时涨幅预览图片转接
    zhang_img:
      'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=1.515450',
  },
  {
    code: '007467',
    name: '华泰柏瑞中证红利低波C',
    zhang_img: 'https://j4.dfcfw.com/charts/pic6/007467.png',
  },
  {
    code: '018561',
    name: '中信保诚多策略混合(LOF)C',
    zhang_img: null, // 找不到预览图
  },
  {
    code: '019260',
    name: '富国恒生红利ETF联接A',
    zhang_img: 'https://j4.dfcfw.com/charts/pic6/019260.png',
  },
  {
    code: '016870',
    name: '景顺长城稳健增益C',
    zhang_img: null, // 债券分类不提供
  },
];

// 清空文件夹函数
function emptyDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const curPath = path.join(directory, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        emptyDirectory(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

// 下载历史数据
async function NetValue(fundCode) {
  let netValueList = '';
  try {
    let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo`;

    let response = await fetch(u, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body:
        'reqData={"fundCode":"' +
        fundCode +
        '","pageNum":1,"pageSize":999999,"channel":"9"}',
      method: 'POST',
    });
    const res = (await response.json()) || {};
    netValueList = res?.resultData?.datas?.netValueList || [];
  } catch (err) {
    console.log(`累计净值--{${fundCode}}--err => `);
  }
  return netValueList;
}
