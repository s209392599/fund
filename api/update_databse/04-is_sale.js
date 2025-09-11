/*
是否可买，以及更新其它信息
*/
const mysql = require('mysql2/promise');
const noText = require('../utils/noText.js'); // 排除的关键词
const noFundCode = require('../utils/noFundCode.js'); // 排除的基金代码

const {
  database_host,
  database_user,
  database_password,
} = require('../setting/database.js');

// 数据库配置
const dbConfig = {
  host: database_host,
  user: database_user,
  password: database_password,
  database: 'fund',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 连接超时时间（毫秒）
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 获取数据库连接并执行查询的异步函数
async function queryDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    const query = 'SELECT * FROM fund';
    const [results] = await Promise.race([
      connection.query(query),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 10000)
      ), // 查询超时时间（毫秒）
    ]);

    console.log(`数据库中一共有${results.length}个基金`);

    /*
    {
      fund_code: '000055',
      fund_name: '广发纳斯达克100ETF联接美元(QDII)A',
      fund_type_name: '指数型-海外股票',
      include_no_keyword: null,
      no_fundgz: 'y',
      no_sale: null,
      stock: null,
      stock_distribution: null,
      user_focus: null,
      highlights: null,
      his_weak_own: null,
      tag_list: null
    }
    */

    var arr = [];
    results.forEach((item_1, index_1) => {
      let flag_1 = item_1.include_no_keyword === 'y';
      let flag_2 = item_1.no_fundgz === 'y';
      let flag = flag_1 || flag_2;
      if (!flag) {
        arr.push({
          fund_code: item_1.fund_code,
          fund_name: item_1.fund_name,
        });
      }
    });
    console.log(`一共有${arr.length}个基金需要更新`);

    let index = 20;
    let len = results.length;
    let str_1 = 'https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?';
    while (index < len) {
      let item = results[index];
      if (item.include_no_keyword !== 'y') {
        let u = `reqData={"itemId":"","fundCode":"${item.fund_code}","clientVersion":"","channel":"9"}`;
        let response = await fetch(str_1 + u);
        const res = (await response.json()) || {};

        let resultData = res.resultData || {};
        let datas = resultData.datas || {};

        var isForSale = datas.isForSale || false; // 是否可买
        console.log('isForSale', `${item.fund_code} - ${item.fund_name} - ${isForSale}`);
        
        // // 获取投资方向
        // let headerOfItem = datas.headerOfItem || {};
        // let themeNameList = headerOfItem.themeNameList || []; // 投资方向
        // arr[count].themeNameList = themeNameList;

        // // 获取持仓
        // let a_2 = datas.investmentDistributionNewOfItem || {};
        // let investmentDistribution = a_2.investmentDistribution || {};
        // let stock = investmentDistribution.stock || []; // 持仓
        // let stockDistribution = investmentDistribution.stockDistribution || []; // 行业分布
        // arr[count].stock = stock;
        // arr[count].stockDistribution = stockDistribution;

        // const updateQuery = 'UPDATE fund SET no_fundgz = ? WHERE fund_code = ?';
        // try {
        //   await connection.query(updateQuery, ['y', results[index].fund_code]);
        //   console.log(`成功更新: ${results[index].fund_code} - ${results[index].fund_name}`);
        // } catch (error) {
        //   console.error(`更新失败: ${results[index].fund_code}, 原因:`, error.message);
        // }
      }
      index++;
    }

    // if(arr.length){
    //   await updateFundData(connection, arr);
    // }
  } catch (error) {
    console.error('数据库操作失败:', error.message);
  } finally {
    console.log(`操作完毕，退出程序`);
    if (connection) connection.release(); // 确保连接被释放
    process.exit(0);
  }
}
queryDatabase();

// 更新数据库的函数
async function updateFundData(connection, data) {
  console.log('开始更新服务器数据~~~');
  const updateQuery = 'UPDATE fund SET include_no_keyword = ? WHERE fund_code = ?';
  const failedItems = [];

  for (const item of data) {
    try {
      await connection.query(updateQuery, ['y', item.fund_code]);
      console.log(`成功更新: ${item.fund_code} - ${item.fund_name}`);
    } catch (error) {
      console.error(`更新失败: ${item.fund_code}, 原因:`, error.message);
      failedItems.push({
        fund_code: item.fund_code,
        error: error.message
      });
    }
  }

  // 输出所有失败的记录
  if (failedItems.length > 0) {
    console.error('以下记录更新失败:', JSON.stringify(failedItems, null, 2));
  } else {
    console.log('所有记录更新成功！');
  }
  process.exit(0);// 0表示正常退出，1表示异常退出
}
