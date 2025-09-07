/*
https://m.1234567.com.cn/index.html?page=jjph&tab=qb -- 全部基金排行
*/
fetch("https://condition.tiantianfunds.com/condition/conditionFund/fundSelect", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://m.1234567.com.cn/",
  "body": "orderField=5_1_-1&pageIndex=1&pageNum=30&pageType=5&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&abnormal=3&rankSy=1",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});


/*
https://fund.eastmoney.com/trade/hh.html#zwf_,sc_z,st_desc
*/
fetch("https://fund.eastmoney.com/data/fundtradenewapi.aspx?ft=hh&sc=z&st=desc&pi=1&pn=150&cp=&ct=&cd=&ms=&fr=&plevel=&fst=&ftype=&fr1=&fl=0&isab=1", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://fund.eastmoney.com/trade/hh.html",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});



/*
布林带+均线+KDJ+macd
历史推荐管理

firewall-cmd --reload  刷新防火墙


*/

