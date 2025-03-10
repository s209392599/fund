const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('./config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/*
code:基金代码
name:基金名称
createDateTime:添加时间
fundtType:基金类型(指数型、债券型、股票型、混合型、QDII、FOF、货币型、其它)
fundtTwoType:基金二级分类 ( 长期纯债 短期纯债 混合债基 定期开放债券 可转债 等)
localType:本地分类(已买、观察、废弃等)
marker:备注
noticeHight:提示点位-高(用于高于某个基金净值时提示)
noticeLow:提示点位-低(用于低于某个基金净值时提示)
order:排序
own:
*/

// 插入单条数据
async function insertFund(fundData) {
  try {
    await client.connect();
    const database = client.db("fund");
    const result = await database.collection('baseinfo').insertOne(fundData);
    console.log("插入成功:", result);
    return result;
  } catch (error) {
    console.error("插入失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// 查询基金
async function findFunds(query = {}) {
  try {
    await client.connect();
    const database = client.db("fund");
    const result = await database.collection('baseinfo').find(query).toArray();
    console.log("查询结果:", result);
    return result;
  } catch (error) {
    console.error("查询失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// 使用示例
async function example() {
  const testFund = {
    order: 5,
    fundCode: "000005",// 基金代号
    fundName: "兴华安裕利率债C",// 基金名称
    createDateTime: '2025-03-07 10:00:00',// 创建时间
    updateTime: '2025-03-07 11:00:00',// 信息更新时间
    fundType: "债券型",// 基金类型
    fundtTwoType: "长债",// 基金二级分类
    localType: "已买",// 本地分类(已买、观察、废弃等)
    marker: "比较猛",// 备注
    noticeHigh: 1.2,// 提示点位-高(用于高于某个基金净值时提示)
    noticeLow: 1.06,// 提示点位-低(用于低于某个基金净值时提示)
    userId: 'boxue',// 人员ID
  };
  await insertFund(testFund);

  // 查询所有基金
  await findFunds();

  // 查询特定基金
  await findFunds({ fundCode: "016659" });
}

// 运行示例
example().catch(console.error);

