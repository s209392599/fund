/*
是否可买，以及更新其它信息
*/
const noText = require('../utils/noText.js'); // 排除的关键词
const noFundCode = require('../utils/noFundCode.js'); // 排除的基金代码
const { pool } = require('../setting/pool.js');// 引入mysql连接池
const {CustomDateFtt} = require('../CustomFn.js');

// 获取数据库连接并执行查询的异步函数
async function queryDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    var query = 'SELECT fund_code, fund_name, no_keyword, is_fundgz FROM fund';// 只查询这几个字段
    const [results] = await Promise.race([
      connection.query(query),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 15 * 1000)
      ), // 查询超时时间（毫秒）
    ]);
    console.log(`数据库中一共有${results.length}个基金`);

    let index = 0;
    let len = results.length;
    let str_1 = 'https://ms.jr.jd.com/gw2/generic/life/h5/m/getFundDetailPageInfoWithNoPin?';
    // len = index + 3;// 只更新某几个
    while (index < len) {
      let item = results[index];
      var is_sale = false; // 是否可买
      console.log('----------------------------');
      console.log(`正在更新 ${index + 1} /${len} --- ${results[index].fund_code} - ${results[index].fund_name}`);
      if (item.no_keyword === 'y' && item.is_fundgz === 'y') {
        let u = `reqData={"itemId":"","fundCode":"${item.fund_code}","clientVersion":"","channel":"9"}`;
        let response = await fetch(str_1 + u);
        const res = (await response.json()) || {};

        let resultData = res.resultData || {};
        let datas = resultData.datas || {};

        var bottomButtonOfItem = datas.bottomButtonOfItem ||{};
        var purchaseButton = bottomButtonOfItem.purchaseButton || {};
        
        is_sale = purchaseButton.text === "买入"; // 是否可买
        if (is_sale) {
          /**
           * 头部标签区
           */
          var headerOfItem = datas.headerOfItem || {};
          // 榜单  headerOfItem.wealthRank  参考基金002112--领涨先锋 · 第1名 008327--领涨先锋 · 第10名
          var rankList = (headerOfItem.rankList || []).map(v => v.wealthRank);
          // 特色亮点   注意007467的晨星5星评级-highlights.morningstarRating  headerOfItem.highlights.tagList
          var highlights = headerOfItem.highlights || {};
          // 用户关注
          var userFocus = (headerOfItem.userFocus || []).map(v => v.title);
          // 投资方向
          var themeNameList = (headerOfItem.themeNameList || []).map(v => v.themeName);
          var obj_1 = {
            rankList: rankList,
            highlights: highlights,
            userFocus: userFocus,
            themeNameList: themeNameList
          }
          var jd_header_tag = JSON.stringify(obj_1);

          /**
           * 更新历史业绩
           */
          var performanceOfItem = datas.performanceOfItem || {};
          var historyPerformanceMap = performanceOfItem.historyPerformanceMap || {};
          var historyPerformanceList = historyPerformanceMap.historyPerformanceList || [];
          historyPerformanceList.forEach((item, index) => {
            delete item.jumpData;
          })
          var jd_historyPerformance = JSON.stringify(historyPerformanceList);
          // 检查历史业绩数据长度，如果超过10000字符则截断
          if (jd_historyPerformance.length > 10000) {
            jd_historyPerformance = jd_historyPerformance.substring(0, 10000);
            console.warn(`基金${item.fund_code}历史业绩数据过长，已截断`);
          }



          /**
           * 基金综合诊断
           */
          var fundDiagnosisOfItem = datas.fundDiagnosisOfItem || {};
          var fundDiagnosisData = fundDiagnosisOfItem.fundDiagnosisData || {};

          var diagnosis_tab1 = fundDiagnosisData.tab1 || {};
          var diagnosis_tab2 = fundDiagnosisData.tab2 || {};
          var diagnosis_tab3 = fundDiagnosisData.tab3 || {};
          var diagnosis_tab4 = fundDiagnosisData.tab4 || {};

          var diagnosis_num_1 = '' + (diagnosis_tab1.overSameTypePercent || '');// 收益能力
          var diagnosis_num_2 = '' + (diagnosis_tab2.overSameTypePercent || '');// 投资性价比
          var diagnosis_num_3 = '' + (diagnosis_tab3.overSameTypePercent || '');// 抗下跌能力
          var diagnosis_num_4 = '' + (diagnosis_tab4.overSameTypePercent || '');// 抗波动能力
          var jd_fundDiagnosis = `${diagnosis_num_1}|${diagnosis_num_2}|${diagnosis_num_3}|${diagnosis_num_4}`;


          /**
           * 基金持仓
           */
          var investmentDistributionNewOfItem = datas.investmentDistributionNewOfItem || {};
          var investmentDistribution = investmentDistributionNewOfItem.investmentDistribution || {};
          var proportionList = investmentDistribution.proportionList || [];
          var obj_2 = {
            '股票': '-',
            '债券': '-',
            '现金': '-',
            '基金': '-',
            '其他': '-',
          };
          for (let i = 0; i < proportionList.length; i++) {
            let item = proportionList[i];
            if (item.name === '股票') {
              obj_2['股票'] = item.fundValue || '-';
            } else if (item.name === '债券') {
              obj_2['债券'] = item.fundValue || '-';
            } else if (item.name === '现金') {
              obj_2['现金'] = item.fundValue || '-';
            } else if (item.name === '基金') {
              obj_2['基金'] = item.fundValue || '-';
            } else if (item.name === '其他') {
              obj_2['其他'] = item.fundValue || '-';
            }
          }
          var jd_proportion = `${obj_2['股票']}|${obj_2['债券']}|${obj_2['现金']}|${obj_2['基金']}|${obj_2['其他']}`;// 持仓比例
          var jd_totalAsset = '' + (investmentDistribution.totalAsset || '');

          var obj_3 = {
            stock: [],
            bond: [],
            fund: [],
          };
          if (investmentDistribution.hasOwnProperty('stock')) {
            var stock_list = investmentDistribution.stock || [];// 股票(018561中信)
            obj_3.stock = stock_list.map(item => {
              return {
                name: item.name,
                industryName: item.industryName,// 元件、通信设备、半导体等标签
                ratio: item.ratio,
              }
            })
          }
          if (investmentDistribution.hasOwnProperty('bond')) {
            var bond_list = investmentDistribution.bond || [];// 债券(007540华子)
            obj_3.bond = bond_list.map(item => {
              return {
                name: item.name,
                industryName: item.industryName,// 国债 等标签
                ratio: item.ratio,
              }
            })
          }
          if (investmentDistribution.hasOwnProperty('fund')) {
            var fund_list = investmentDistribution.fund || [];// 对应ETF等(比如007467)
            obj_3.fund = fund_list.map(item => {
              return {
                name: item.name || item.holdingFundName,
                industryName: item.holdingFundCode,
                ratio: item.navRatio,
              }
            })
          }
          var jd_chi_cang = JSON.stringify(obj_3);


          /**
           * 基金档案
           */
          var obj_4 = {
            "establishedDateByCn": "2015年11月16日",// 基金成立日期
            "company_name": "德邦基金管理有限公司",
            "fundScaleList": [],
            "instPurchaseRatio": '',// 机构持有占比
            "purchaseRatio": '',// 个人持有占比
            companyManageScale: '',// 基金公司管理规模
            manageNumber: '',// 基金公司的管理数量
          };
          var fundProfileOfItem = datas.fundProfileOfItem || {};
          obj_4.establishedDateByCn = fundProfileOfItem.establishedDateByCn || '';
          obj_4.company_name = fundProfileOfItem.company_name || '';
          obj_4.fundScaleList = fundProfileOfItem.fundScaleList || [];
          obj_4.instPurchaseRatio = '' + fundProfileOfItem.instPurchaseRatio || '';
          obj_4.purchaseRatio = '' + fundProfileOfItem.purchaseRatio || '';
          obj_4.companyManageScale = '' + fundProfileOfItem.companyManageScale || '';
          obj_4.manageNumber = '' + fundProfileOfItem.manageNumber || '';
          var jd_fund_archive = JSON.stringify(obj_4);

          /**
           * 基金经理
           */
          var fundManagerOfItem = datas.fundManagerOfItem || {};
          var managerInfoList = fundManagerOfItem.managerInfoList || [];
          managerInfoList.forEach(item => {
            if (item.hasOwnProperty('awardList')) {
              item.awardList = (item.awardList || []).map(v => {
                return {
                  awardTypeName: v.awardTypeName,
                }
              })
            }

            delete item.managerDetailJumpData;
            delete item.managerPicUrl;
            delete item.awardBackgroundUrl;
          })
          var jd_managerInfo = JSON.stringify(managerInfoList);

          const updateFields = {
            jd_header_tag: jd_header_tag,// 头部标签
            jd_historyPerformance: jd_historyPerformance,// 历史业绩
            jd_fundDiagnosis: jd_fundDiagnosis,// 综合诊断
            jd_proportion: jd_proportion,// 持仓分类占比
            jd_totalAsset: jd_totalAsset,// 资产
            jd_chi_cang: jd_chi_cang,// 持仓详情(股票占比)
            jd_fund_archive: jd_fund_archive,// 基金档案
            jd_managerInfo: jd_managerInfo,// 基金经理
            update_time: CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"),
          };
          const updateQuery_1 = 'UPDATE fund SET is_sale = ? WHERE fund_code = ?';
          try {
            await connection.query(updateQuery_1, ['y', item.fund_code]);

            console.log(`[成功]--[可买]: is_sale`);
          } catch (error) {// error.message
            console.error(`[！！！！失败]--[可买] -- is_sale`,);
            process.exit(1);// 0表示正常退出，1表示异常退出
          }

          const updateQuery = 'UPDATE fund SET ? WHERE fund_code = ?';
          try {
            await connection.query(updateQuery, [updateFields, item.fund_code]);
            console.log(`[成功]--[可买] 成功更新: jd_header_tag等`);
          } catch (error) {
            console.error(`[！！！！失败]--[可买] -- jd_header_tag等`,);
            process.exit(1);// 0表示正常退出，1表示异常退出
          }

          /**
           * 交易规则
           */

          // 回撤修复
          // 锁定期限 锁定原因  有些基金，不需要更新那么多；或者某一类的；
          // 数据更新日期也要写上
          // 获取中金公司的
          /*
            release_date 解锁日期
            reason_lockout 锁定原因
          */

          // fundDiagnosisOfItem.fundDiagnosisData  收益能力 夏普比率 最大回撤 波动率
        }
      }
      if (!is_sale) {
        // 京东金融上不可买，把这些字段置为 NULL

        // 定义更新语句，包括 is_sale 和 update_time 字段
        const updateQuery_1 = 'UPDATE fund SET is_sale = ?, update_time = ? WHERE fund_code = ?';
        const currentTime = CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss");
        try {
          await connection.query(updateQuery_1, ['n', currentTime, item.fund_code]);
          console.log(`[成功]--[不可买] -- 更新 is_sale 和 update_time 字段`);
        } catch (error) {
          console.error(`[！！！！失败][不可买] -- 更新 is_sale 和 update_time 字段`, error);
          process.exit(1); // 异常退出
        }

        const updateQuery =
          'UPDATE fund SET jd_header_tag = NULL, jd_historyPerformance = NULL, jd_fundDiagnosis = NULL, jd_proportion = NULL, jd_totalAsset = NULL, jd_chi_cang = NULL, jd_fund_archive = NULL, jd_managerInfo = NULL WHERE fund_code = ?';
        try {
          await connection.query(updateQuery, [item.fund_code]);
          console.log(`[成功]--[不可买] --- jd_header_tag 等字段`);
        } catch (error) {
          console.error(`[！！！！失败][不可买] -- jd_header_tag 等字段,`);
          process.exit(1);// 0表示正常退出，1表示异常退出
        }
      }

      index++;
    }
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
  const updateQuery = 'UPDATE fund SET no_keyword = ? WHERE fund_code = ?';
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
