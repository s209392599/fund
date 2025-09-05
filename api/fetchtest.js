const fetch = require('node-fetch');

async function fetchFundData() {
  try {
    const text = encodeURIComponent(`中证A500`);
    const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx`;
    const params = `m=1&key=${text}&pageindex=0&pagesize=1000`;

    const response = await fetch(`${url}?${params}&t=${Date.now()}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://fund.eastmoney.com/',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const data = await response.json(); // 直接解析为JSON
    console.log('获取到的数据:', data);

    // // 处理数据
    // if (data.ErrCode === 0 && data.Datas) {
    //   console.log(`找到 ${data.Datas.length} 个基金`);
    //   data.Datas.forEach((fund) => {
    //     console.log(`基金代码: ${fund.CODE}, 名称: ${fund.NAME}`);
    //   });
    // } else {
    //   console.log('未找到基金数据或API返回错误');
    // }
  } catch (error) {
    console.error('错误:', error.message);
  }
}

// 执行函数
fetchFundData();
