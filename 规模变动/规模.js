// 份额 / 净资产规模变动详情;
fetch(
  'https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=gmbd&mode=0&code=400030&rt=0.9133656282307885',
  {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'sec-ch-ua':
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'script',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'same-origin',
    },
    referrer: 'https://fundf10.eastmoney.com/gmbd_400030.html',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }
);
