const fetch = require('node-fetch');
const fs = require('fs');

async function fetchFundData() {
  try {
    const url = `https://choicegw.eastmoney.com/app/report/web/homePage/getInformationList?count=100`;

    const response = await fetch(`${url}`, {
      headers: {
        'appid': 'UHc7QTQqgQe0JtUsK7cdWaBIrRJYmmsJ@MOBILEAPP'
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const responseData = await response.json();

    if (!responseData) {
      throw new Error('服务器返回了空响应');
    }

    const records = responseData?.data?.records || [];
    const turnData = records.map(item => {
      return {
        infocode: item.code,// 新闻ID
        showtime: item.data.showtime,// 更新时间
        simdigest: item.data.simdigest,// 新闻标题
        from: item.data.from,// 来源

      };
    });

    // console.log('基金数据:', JSON.stringify(responseData, null, 2));

    fs.writeFileSync('zzz_data.json', JSON.stringify(turnData, null, 2));
    console.log('基金数据已保存到 fund_data.json 文件');

  } catch (error) {
    console.error('错误:', error.message);
  }
}

// 执行函数
fetchFundData();
