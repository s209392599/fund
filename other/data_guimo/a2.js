const fs = require('fs');
const path = require('path');

// 读取fund.json文件
const fundData = require('./allfund.json');
console.log('6', fundData.length);

let index_start = 0;
let index_end = fundData.length;
// index_end = 50;// 临时模拟

let arr_info_failed = []; // 没有请求到详情的基金
let arr_no_year = []; // 数据不够一年的
let arr_err_jisuan = []; // 数据计算错误的
let arr_success = []; // 成功的

// 存放分类数据
let obj = {
  // "混合型-灵活":[]
};

// 获取基金信息
const getFundInfo = async (fundCode) => {
  let obj = [];
  try {
    const response = await fetch(
      'https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `reqData={"fundCode":"${fundCode}","pageNum":1,"pageSize":260,"channel":"9"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      }
    );
    const res = (await response.json()) || {};
    obj = (res?.resultData?.datas.netValueList || []).reverse() || [];
  } catch (err) {
    console.log(err);
  }
  return obj;
};

async function fenxi(arr = []) {
  let count = 0; // 计数
  while (index_start < index_end) {
    const item = arr[index_start];
    if (!item) {
      index_start++;
      continue;
    }

    console.log(
      `已完成第${index_start + 1} - ${count}个基金数据请求，${item[0]} - ${
        item[1]
      }`
    );
    let res = await getFundInfo(item[0]); // 获取基金详情

    if (res.length) {
      const len = res.length;
      if (len >= 260) {
        try {
          let num_001 = Number(res[0].totalNetValue);
          let num_130 = Number(res[129].totalNetValue);
          let num_260 = Number(res[259].totalNetValue);

          let rate_1 = num_130 / num_001; // 计算比率
          let rate_2 = num_260 / num_001;

          let flag_1 = rate_1 > 1.01; // 半年增长率要大于 1%
          let flag_2 = rate_2 > 1.03; // 一年增长率要大于 3%
          let flag_3 = num_260 > num_130;// 必须是增长
          if (flag_1 && flag_2 && flag_3) {
            if (!obj[item[3]]) {
              obj[item[3]] = [];
            }
            obj[item[3]].push([item[0], item[1], item[2], rate_2]); // 成功的
            count++; // 计算请求成功的个数
          }
        } catch (err) {
          arr_err_jisuan.push([item[0], item[1]]); // 数据计算错误的
        }
      } else {
        arr_no_year.push([item[0], item[1]]); // 数据不够一年的
      }

    } else {
      arr_info_failed.push([item[0], item[1]]); // 请求详情失败的
    }
    index_start++;
  }

console.log('95',obj)
  // 遍历obj的每个key，创建对应的json文件
  Object.keys(obj).forEach((key) => {
    const fileName = `./data_filter/${key}.json`;
    // 根据年收益排序
    obj[key].sort((a, b) => {
      return b[3] - a[3];
    });

    let existingData = {
      count: 0,
      data: [],
    };

    // 如果文件已存在，读取现有数据
    if (fs.existsSync(fileName)) {
      try {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        console.error(`读取文件 ${fileName} 失败:`, error);
      }
    }

    // 合并现有数据和新数据
    existingData.data = existingData.data.concat(obj[key]);
    existingData.count = existingData.data.length;

    // 写入合并后的数据
    fs.writeFileSync(fileName, JSON.stringify(existingData, null, 2), 'utf8');
    console.log(`已更新文件: ${fileName}`);
  });

  const path_1 = './data_filter/arr_err_jisuan.json';
  const path_2 = './data_filter/arr_no_year.json';
  const path_3 = './data_filter/arr_info_failed.json';

  fs.writeFileSync(
    path_1,
    JSON.stringify(
      {
        length: arr_err_jisuan.length,
        data: arr_err_jisuan,
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path_2,
    JSON.stringify(
      {
        length: arr_no_year.length,
        data: arr_no_year,
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path_3,
    JSON.stringify(
      {
        length: arr_info_failed.length,
        data: arr_info_failed,
      },
      null,
      2
    )
  );
  console.log(`初步筛选了 共${count}个基金`);
}

fenxi(fundData);
