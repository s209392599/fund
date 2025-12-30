const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function queryFundAllEtf() {
  let etf_arr= [];
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);
    fundArray.forEach((item) => {
      let fund_code = item[0]; // 基金代码
      let fund_name = item[2]; // 基金名称
      let fund_type = item[3]; // 基金类型

      let endsArr = ['ETF', 'ETF(QDII)','(QDII-ETF)'];
      let flag_3 = endsArr.some((item) => fund_name.endsWith(item));// 不以ETF结尾
      if(flag_3) {
        etf_arr.push({
          fund_code: fund_code || '',
          fund_name: fund_name || '',
          fund_type: fund_type || '',
        });
      }
    });
    // ["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]
  } catch (err) {
    console.log('err => ', err);
  }finally{
    return etf_arr;
  }
}

// 场内交易基金排行
// https://fund.eastmoney.com/data/fbsfundranking.html#tct;c0;r;s1nzf;ddesc;pn10000;
async function queryResilienceInfo() {
  let fund_data = [];
  try {
    let u = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=fb&ft=ct&rs=&gs=0&sc=1nzf&st=desc&pi=1&pn=10000`;

    let response = await fetch(u, {
      headers: {
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        Referer: 'https://fund.eastmoney.com/data/fbsfundranking.html',
      },
      body: null,
      method: 'GET',
    });
    const res = (await response.text()) || '{data:[]}';
    // console.log('res => ', res);
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    const fundArray = JSON.parse(arrayStr);

    fund_data = fundArray.map(v => {
      let cur_arr = v.split(',');
      return {
        fund_code: cur_arr[0],
        fund_name: cur_arr[1],
      }
    })
  } catch (err) {
    console.log('err => ', err);
  }finally{
    return fund_data;
  }
}

async function queryEtf(){
  try{
    let arr_1 = await queryFundAllEtf();// 请求全部基金数据过滤ETF
    let arr_2 = await queryResilienceInfo();// 请求场内交易基金排行数据

    console.log('arr_1',arr_1.length);
    console.log('arr_2',arr_2.length);

    let jsonData = [...arr_1];
    arr_2.forEach((item) => {
      let fund_code = item.fund_code || '';
      let fund_name = item.fund_name || '';
      let flag_1 = jsonData.some((v) => v.fund_code === fund_code);
      if(!flag_1) {
        jsonData.push({
          fund_code: fund_code || '',
          fund_name: fund_name || '',
          fund_type: '',
        });
      }
    });

    console.log('增加之后有',jsonData.length);


    fs.writeFileSync(
      path.join(__dirname, './data/filter.json'),
      JSON.stringify(jsonData, null, 2),
      'utf8'
    );
  }catch(err){
    console.log('err => ', err);
  }
}
queryEtf();
