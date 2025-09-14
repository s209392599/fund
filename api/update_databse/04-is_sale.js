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


        if(isForSale){
          /**
           * 头部标签区
           */
          var header_highlights = '';// 特色亮点   注意007467的晨星5星评级  headerOfItem.highlights.tagList  highlights.morningstarRating
          var header_userFocus = '';// 用户关注  headerOfItem.tagList
          var header_themeNameList = '';// 投资方向  headerOfItem.
          // 下面的注意下 rankList 这个字段，难道还有多个的？
          var header_wealthRank = '';// 榜单  headerOfItem.wealthRank  参考基金002112--领涨先锋 · 第1名 008327--领涨先锋 · 第10名

          var headerOfItem = datas.headerOfItem || {};
          var highlights = headerOfItem.highlights || {};
          var tagList = highlights.tagList || [];


          // 设想：下面的合并为一个字段，京东返回啥就写啥，然后在前端自己解析？ 坏处就是传输的时候量大了一些

          /**
           * 更新历史业绩
           */
          var zhang_zhou = '';// 周涨幅
          var zhang_yue_1 = '';// 月涨幅
          var zhang_yue_3 = '';// 3月涨幅
          var zhang_yue_6 = '';// 6月涨幅
          var zhang_nian_1 = '';// 1年涨幅
          var zhang_nian_3 = '';// 3年涨幅
          // var zhang_nian_5 = '';// 5年涨幅
          var zhang_jin_nian = '';// 今年以来
          var zhang_cheng_li = '';// 成立以来

          var tong_zhou = '';// 同类-周排名
          var tong_yue_1 = '';// 同类-月排名
          var tong_yue_3 = '';// 同类-3月排名
          var tong_yue_6 = '';// 同类-6月排名
          var tong_nian_1 = '';// 同类-1年排名
          var tong_nian_3 = '';// 同类-3年排名
          // var tong_nian_5 = '';// 同类-5年排名
          var tong_jin_nian = '';// 同类-今年以来
          var tong_cheng_li = '';// 同类-成立以来

          var rank_zhou = '';// 周排名
          var rank_yue_1 = '';// 月排名
          var rank_yue_3 = '';// 3月排名
          var rank_yue_6 = '';// 6月排名
          var rank_nian_1 = '';// 1年排名
          var rank_nian_3 = '';// 3年排名
          // var rank_nian_5 = '';// 5年排名
          var rank_jin_nian = '';// 今年以来
          var rank_cheng_li = '';// 成立以来

          var performanceOfItem = datas.performanceOfItem || {};
          var historyPerformanceMap = performanceOfItem.historyPerformanceMap || {};
          var historyPerformanceList = historyPerformanceMap.historyPerformanceList || [];
          historyPerformanceList.forEach((item,index) => {
            if(item.name === '近1周'){
              zhang_zhou = item.rate || '';
              tong_zhou = item.avg || '';
              rank_zhou = item.rank_zhou || '';
            }else if(item.name === '近1月'){
              zhang_yue_1 = item.rate || '';
              tong_yue_1 = item.avg || '';
              rank_yue_1 = item.rank_zhou || '';
            }else if(item.name === '近3月'){
              zhang_yue_3 = item.rate || '';
              tong_yue_3 = item.avg || '';
              rank_yue_3 = item.rank_zhou || '';
            }else if(item.name === '近6月'){
              zhang_yue_6 = item.rate || '';
              tong_yue_6 = item.avg || '';
              rank_yue_6 = item.rank_zhou || '';
            }else if(item.name === '近1年'){
              zhang_nian_1 = item.rate || '';
              tong_nian_1 = item.avg || '';
              rank_nian_1 = item.rank_zhou || '';
            }else if(item.name === '今年以来'){
              zhang_jin_nian = item.rate || '';
              tong_jin_nian = item.avg || '';
              rank_jin_nian = item.rank_zhou || '';
            }else if(item.name === '近3年'){
              zhang_nian_3 = item.rate || '';
              tong_nian_3 = item.avg || '';
              rank_nian_3 = item.rank_zhou || '';
            }else if(item.name === '成立以来'){
              zhang_cheng_li = item.rate || '';
              tong_cheng_li = item.avg || '';
              rank_cheng_li = item.rank_zhou || '';
            }
          })


          /**
           * 基金综合诊断
           */
          var fundDiagnosisOfItem = datas.fundDiagnosisOfItem || {};
          var fundDiagnosisData = fundDiagnosisOfItem.fundDiagnosisData || {};
          var diagnosis_tab1 = fundDiagnosisData.tab1 || {};
          var diagnosis_tab2 = fundDiagnosisData.tab2 || {};
          var diagnosis_tab3 = fundDiagnosisData.tab3 || {};
          var diagnosis_tab4 = fundDiagnosisData.tab4 || {};

          var diagnosis_num_1 = '' + diagnosis_tab1.overSameTypePercent || '';// 收益能力
          var diagnosis_num_2 = '' + diagnosis_tab2.overSameTypePercent || '';// 投资性价比
          var diagnosis_num_3 = '' + diagnosis_tab3.overSameTypePercent || '';// 抗下跌能力
          var diagnosis_num_4 = '' + diagnosis_tab4.overSameTypePercent || '';// 抗波动能力
          

          /**
           * 基金持仓
           */
          var investmentDistributionNewOfItem = datas.investmentDistributionNewOfItem || {};
          var investmentDistribution = investmentDistributionNewOfItem.investmentDistribution || {};
          var proportionList = investmentDistribution.proportionList || [];
          var obj_2 = {
            '股票':'-',
            '债券':'-',
            '现金':'-',
            '基金':'-',
            '其他':'-',
          };
          for(let i = 0;i < proportionList.length;i++){
            let item = proportionList[i];
            if(item.name === '股票'){
              obj_2['股票'] = item.fundValue || '-';
            }else if(item.name === '债券'){
              obj_2['债券'] = item.fundValue || '-';
            }else if(item.name === '现金'){
              obj_2['现金'] = item.fundValue || '-';
            }else if(item.name === '基金'){
              obj_2['基金'] = item.fundValue || '-';
            }else if(item.name === '其他'){
              obj_2['其他'] = item.fundValue || '-';
            }
          }
          var proportion = `${obj_2['股票']}|${obj_2['债券']}|${obj_2['现金']}|${obj_2['基金']}|${obj_2['其他']}`;// 持仓比例
          var totalAsset = '' + investmentDistribution.totalAsset || '-';

          var chi_stock = '';// 股票(018561中信)
          var chi_bond = '';// 债券(007540华子)
          var chi_fund = '';// 对应ETF等(比如007467)
          if(investmentDistribution.hasOwnProperty('stock')){
            var stock_list = investmentDistribution.stock || [];
          }
          if(investmentDistribution.hasOwnProperty('bond')){

          }
          if(investmentDistribution.hasOwnProperty('fund')){

          }


          /**
           * 基金档案
           */
          // 持仓规模 持有人结构 

          /**
           * 基金经理
           */

          /**
           * 基金公司
           */

          /**
           * 交易规则
           */


          // 锁定期限 锁定原因  有些基金，不需要更新那么多；或者某一类的；
          // 数据更新日期也要写上
          // 获取中金公司的

          /*
          release_date 解锁日期
          reason_lockout 锁定原因 
      
          */

          
          // fundDiagnosisOfItem.fundDiagnosisData  收益能力 夏普比率 最大回撤 波动率
        }else{
          // 京东金融上不可买
          const updateQuery = 'UPDATE fund SET no_sale = ? WHERE fund_code = ?';
          try {
            await connection.query(updateQuery, ['y', item.fund_code]);
            console.log(`成功更新: ${item.fund_code} - ${item.fund_name}`);
          } catch (error) {
            console.error(`更新失败: ${item.fund_code}, 原因:`, error.message);
          }
        }

        /** 
         * 回撤修复
         * 回撤、修复
         */
        // -- 回撤修复
        //

        // 历史业绩
        // 近一周 涨跌幅 同类均值 同类排名
        // 近一月
        // 近三月
        // 近六月
        // 近一年
        // 近三年
        // 近5年
        // 今年以来
        // 成立以来


        // 基金综合诊断  也可以直接点进去看详细的数据
        var fundDiagnosisOfItem = datas.fundDiagnosisOfItem || {};
        var fundDiagnosisData = fundDiagnosisOfItem.fundDiagnosisData || {};
        // 收益能力
        // 投资性价比
        // 抗下跌能力
        // 抗波动能力

        // --基金持仓
        // 重仓股票
        // 基金规模
        // 机构占比

        // 交易规则  买卖规则

        var investmentDistributionNewOfItem = datas.investmentDistributionNewOfItem || {};
        var investmentDistribution = investmentDistributionNewOfItem.investmentDistribution || {};
        var proportionList = investmentDistribution.proportionList || [];

        /*
          {
            "avg": "0.19",
            "rate": "-0.08",
            "name": "近1周",
            "jumpData": {
              "level": "3",
              "text": "一般"
            },
            "rank": "2564/4305"
          }
        */
        var performanceOfItem = datas.performanceOfItem || {};
        var historyPerformanceMap = performanceOfItem.historyPerformanceMap || {};
        var historyPerformanceList = historyPerformanceMap.historyPerformanceList || [];

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
