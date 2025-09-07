const fetch = require('node-fetch');

async function fetchFundData() {
  try {
    const text = encodeURIComponent(`中证A500`);
    const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx`;
    const params = `m=1&key=${text}&pageindex=0&pagesize=1000`;

    const response = await fetch(`${url}?${params}&t=${Date.now()}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Referer: 'https://fund.eastmoney.com/',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const responseText = await response.text();

    if (!responseText || responseText.trim() === '') {
      throw new Error('服务器返回了空响应');
    }

    try {
      const data = JSON.parse(responseText);
      console.log('获取到的数据:', data);

      // 处理数据
      if (data.ErrCode === 0 && data.Datas) {
        console.log(`找到 ${data.Datas.length} 个基金`);
        data.Datas.forEach((fund) => {
          console.log(`基金代码: ${fund.CODE}, 名称: ${fund.NAME}`);
        });
      } else {
        console.log('未找到基金数据或API返回错误');
      }
    } catch (parseError) {
      console.error('解析JSON数据失败:', parseError.message);
    }
  } catch (error) {
    console.error('错误:', error.message);
  }
}

// 执行函数
fetchFundData();
