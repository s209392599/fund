// 获取所有初步基金进行数据过滤
let index_start = 0; // 多少期开始
let index_end = 23779; // 多少期结束

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const noText = require('./noText'); // 排除的关键词
const noFundCode = require('./noFundCode'); // 排除的基金代码
const {
  emptyDirectory, // 清空文件夹
  getFundInfo, // 获取基金详情
} = require('./CustomFunction');

if (!fs.existsSync('./data_guimo')) {
  fs.mkdirSync('./data_guimo');
}

// 过滤出来符合规模的基金
if (!fs.existsSync('./data_guimo/data_all')) {
  fs.mkdirSync('./data_guimo/data_all');
}
// 大于150亿 详细分类的文件夹
if (!fs.existsSync('./data_guimo/data_guimo_da')) {
  fs.mkdirSync('./data_guimo/data_guimo_da');
}
// 小于1亿 详细分类的文件夹
if (!fs.existsSync('./data_guimo/data_guimo_xiao')) {
  fs.mkdirSync('./data_guimo/data_guimo_xiao');
}
// 检查并初始化 JSON 文件
const jsonFiles = [
  './data_guimo/guimo_da.json', // 规模大于150亿的基金集合
  './data_guimo/guimo_xiao.json', // 规模小于1亿的基金集合
  './data_guimo/no_jd.json', // 不能在京东上购买的基金
  './data_guimo/fundinfo_fail.json', // 请求基金详情失败的
];

jsonFiles.forEach((file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          length: 0,
          data: [],
        },
        null,
        2
      ),
      'utf8'
    );
    console.log(`已创建并初始化文件: ${file}`);
  }
});

// 存放分类数据
let obj = {
  // "混合型-灵活":[]
};
let obj_da = {
  // "混合型-灵活":[]
};
let obj_xiao = {
  // "混合型-灵活":[]
};
let dis_fundData = []; // 京东金融不可买的基金
let arr_da = []; // 大于150亿
let arr_xiao = []; // 小于1亿
let arr_no_guimo = []; // 规模不是‘万元’ ‘亿元’
let arr_info_failed = []; // 请求基金详情失败的

/*
["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"]

*/
async function fenxi(arr = []) {
  let count = 0; // 计数
  while (index_start < index_end) {
    const item = arr[index_start];
    if(!item){
      index_start++;
      continue;
    }

    // 排除一些不符合初步规则的基金
    const flag_2 = noText.some((text) => item[2].includes(text));
    const flag_3 = noFundCode.some((text) => item[0].includes(text)); // 排除的基金号
    if (flag_2 || flag_3) {
      index_start++;
      continue;
    }

    console.log(
      `已完成第${index_start + 1} - ${count}个基金数据请求，${item[0]} - ${item[2]}`
    );
    let res = await getFundInfo(item[0]); // 获取基金详情

    if (res.bottomButtonOfItem) {
      const purchaseButton = res.bottomButtonOfItem.purchaseButton || {};
      if (!purchaseButton.dis_scale) {
        // 京东金融可售卖
        const fundProfileOfItem = res.fundProfileOfItem || {};
        const fundScale = fundProfileOfItem.fundScale || ''; // 资金规模
        if (fundScale) {
          const xing = item[3]; // 什么类型
          if (fundScale.includes('万元')) {
            arr_xiao.push([item[0], item[2], fundScale]);
            if (!obj_xiao[xing]) {
              obj_xiao[xing] = [];
            }
            obj_xiao[xing].push([item[0], item[2], fundScale]);
          } else if (fundScale.includes('亿元')) {
            const num_val = parseFloat(fundScale.replace('亿元', ''));
            if (num_val > 150) {
              arr_da.push([item[0], item[2], fundScale]);
              if (!obj_da[xing]) {
                obj_da[xing] = [];
              }
              obj_da[xing].push([item[0], item[2], fundScale]);
            } else if (num_val < 1) {
              arr_xiao.push([item[0], item[2], fundScale]);
              if (!obj_xiao[xing]) {
                obj_xiao[xing] = [];
              }
              obj_xiao[xing].push([item[0], item[2], fundScale]);
            } else {
              if (!obj[xing]) {
                obj[xing] = [];
              }
              obj[xing].push([item[0], item[2], fundScale]);
              count++;
            }
          } else {
            arr_no_guimo.push([item[0], item[2]]); // 未知规模
          }
        }
      } else {
        dis_fundData.push([item[0], item[2]]); // 京东金融上不可买的基金
      }
    } else {
      // 请求详情失败的
      arr_info_failed.push([item[0], item[2]]);
    }
    index_start++;
  }

  // 遍历obj的每个key，创建对应的json文件
  Object.keys(obj).forEach(key => {
    const fileName = `./data_guimo/data_all/${key}.json`;

    let existingData = {
      count: 0,
      data: []
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
    fs.writeFileSync(
      fileName,
      JSON.stringify(existingData, null, 2),
      'utf8'
    );
    console.log(`已更新文件: ${fileName}`);
  });
  // 遍历obj_da的每个key，创建对应的json文件
  Object.keys(obj_da).forEach(key => {
    const fileName = `./data_guimo/data_guimo_da/${key}.json`;
    let existingData = {
      count: 0,
      data: []
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
    existingData.data = existingData.data.concat(obj_da[key]);
    existingData.count = existingData.data.length;
    // 写入合并后的数据
    fs.writeFileSync(
      fileName,
      JSON.stringify(existingData, null, 2),
      'utf8'
    );
    console.log(`已更新文件: ${fileName}`);

  })
  // 遍历obj_xiao的每个key，创建对应的json文件
  Object.keys(obj_xiao).forEach(key => {
    const fileName = `./data_guimo/data_guimo_xiao/${key}.json`;
    let existingData = {
      count: 0,
      data: []
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
    existingData.data = existingData.data.concat(obj_xiao[key]);
    existingData.count = existingData.data.length;
    // 写入合并后的数据
    fs.writeFileSync(
      fileName,
      JSON.stringify(existingData, null, 2),
      'utf8'
    );
    console.log(`已更新文件: ${fileName}`);
  })

  const path_1 = './data_guimo/guimo_da.json';
  const path_2 = './data_guimo/guimo_xiao.json';
  const path_3 = './data_guimo/no_jd.json';
  const path_4 = './data_guimo/fundinfo_fail.json';
  // 规模大于150亿
  if (arr_da.length > 0) {
    const fileContent = fs.readFileSync(path_1, 'utf8');
    const JsonData_1 = JSON.parse(fileContent);
    JsonData_1.data = JsonData_1.data.concat(arr_da);
    fs.writeFileSync(
      path_1,
      JSON.stringify(
        {
          length: JsonData_1.data.length,
          data: JsonData_1.data,
        },
        null,
        2
      )
    );
  }
  // 规模小于1亿
  if (arr_xiao.length > 0) {
    const fileContent = fs.readFileSync(path_2, 'utf8');
    const JsonData_2 = JSON.parse(fileContent);
    JsonData_2.data = JsonData_2.data.concat(arr_xiao);
    fs.writeFileSync(
      path_2,
      JSON.stringify(
        {
          length: JsonData_2.data.length,
          data: JsonData_2.data,
        }
      )
    )
  }
  // 不能在京东上购买的基金
  if (dis_fundData.length > 0) {
    const fileContent = fs.readFileSync(path_3, 'utf8');
    const JsonData_3 = JSON.parse(fileContent);
    JsonData_3.data = JsonData_3.data.concat(dis_fundData);
    fs.writeFileSync(
      path_3,
      JSON.stringify(
        {
          length: JsonData_3.data.length,
          data: JsonData_3.data,
        }
      )
    )
  }
  // 请求基金详情失败的
  if (arr_info_failed.length > 0) {
    const fileContent = fs.readFileSync(path_4, 'utf8');
    const JsonData_4 = JSON.parse(fileContent);
    JsonData_4.data = JsonData_4.data.concat(arr_info_failed);
    fs.writeFileSync(
      path_4,
      JSON.stringify(
        {
          length: JsonData_4.data.length,
          data: JsonData_4.data,
        }
      )
    )
  }

  console.log('京东上不可买的基金', dis_fundData);
  console.log('大于150亿', arr_da);
  console.log('小于1亿', arr_xiao);
  console.log('规模不规则', arr_no_guimo);
  console.log('获取基金详情失败的', arr_info_failed);

  console.log('obj_da',obj_da);
  console.log('obj_xiao',obj_xiao);

  console.log(`初步筛选了${Object.keys(obj).length}种类型 共${count}个基金`);
}

async function queryResilienceInfo() {
  try {
    let u = `https://fund.eastmoney.com/js/fundcode_search.js`;

    let response = await fetch(u);
    const res = (await response.text()) || {};
    // console.log(res.substring(0, 50));// 截取前50个字符
    // 提取数组部分的字符串
    const arrayStr = res.substring(res.indexOf('['), res.lastIndexOf(']') + 1);
    // 将字符串转换为数组
    const fundArray = JSON.parse(arrayStr);
    console.log(`一共有${fundArray.length}个基金`);
    index_end = fundArray.length;
    fenxi(fundArray);
  } catch (err) {
    console.log('err => ', err);
  }
}
// queryResilienceInfo();


var arr = [
  [
    "000796",
    "000796",
    "宝盈睿丰创新混合C"
  ],
  [
    "002156",
    "002156",
    "长盛盛世混合A"
  ],
  [
    "004109",
    "004109",
    "中信保诚稳泰债券C"
  ],
  [
    "004717",
    "004717",
    "万家天添宝货币A"
  ],
  [
    "006051",
    "006051",
    "鹏扬核心价值灵活配置A"
  ],
  [
    "006922",
    "006922",
    "华宝宝裕债券C"
  ],
  [
    "017416",
    "017416",
    "中泰元和价值精选混合C"
  ],
  [
    "019594",
    "019594",
    "嘉实稳宁纯债债券A"
  ],
  [
    "020063",
    "020063",
    "格林宏观回报混合C"
  ],
  [
    "164703",
    "164703",
    "汇添富纯债(LOF)A"
  ],
  [
    "515293",
    "515293",
    "天弘中证银行ETF"
  ],
  [
    "516163",
    "516163",
    "南方中证新能源ETF"
  ],
  [
    "870015",
    "870015",
    "广发资管昭利中短债"
  ],
  [
    "872025",
    "872025",
    "广发资管盛世精选混合"
  ],
  [
    "960034",
    "960034",
    "国投瑞银稳定增利债券H"
  ],
  [
    "960035",
    "960035",
    "易方达价值成长混合H"
  ],
  [
    "960036",
    "960036",
    "易方达价值成长混合I"
  ]
]
index_end = arr.length;
    fenxi(arr);

/* 规模从大到小排序(>150亿)
const sortedData = arr.sort((a, b) => {
    // 提取数字部分（去掉"亿元"）并转换为浮点数
    const valueA = parseFloat(a[2].replace('亿元', ''));
    const valueB = parseFloat(b[2].replace('亿元', ''));
    // 从大到小排序
    return valueB - valueA;
});

*/
