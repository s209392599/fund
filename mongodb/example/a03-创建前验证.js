const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// 更新基金信息
async function updateFund(fundCode, updateData) {
  try {
    await client.connect();
    const database = client.db("fund");
    const result = await database.collection('baseinfo').updateOne(
      { fundCode },
      { $set: updateData }
    );
    console.log("更新成功:", result);
    return result;
  } catch (error) {
    console.error("更新失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// 删除基金
async function deleteFund(fundCode) {
  try {
    await client.connect();
    const database = client.db("fund");
    const result = await database.collection('baseinfo').deleteOne({ fundCode });
    console.log("删除成功:", result);
    return result;
  } catch (error) {
    console.error("删除失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// 使用示例
async function example() {
  // 添加验证规则
  await addValidationRules();

  // 插入测试数据
  const testFund = {
    fundCode: "000001",
    fundName: "测试基金",
    createDateTime: new Date(),
    fundType: "混合型",
    localType: "观察",
    marker: "这是一个测试基金",
    noticeHigh: 1.5,
    noticeLow: 1.2
  };
  await insertFund(testFund);

  // 查询所有基金
  await findFunds();

  // 查询特定基金
  await findFunds({ fundCode: "000001" });

  // 更新基金信息
  await updateFund("000001", { localType: "已买" });

  // 删除基金
  await deleteFund("000001");
}

// 运行示例
// example().catch(console.error);

// 导出函数供其他模块使用
module.exports = {
  addValidationRules,
  insertFund,
  insertManyFunds,
  findFunds,
  updateFund,
  deleteFund
};
