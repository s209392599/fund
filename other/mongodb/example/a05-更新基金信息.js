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
  // 更新基金信息
  await updateFund("007540", { marker: "更新备注 2025年03月07日17:39:45" });

  // 查询特定基金
  await findFunds({ fundCode: "007540" });
}

// 运行示例
example().catch(console.error);



/* 更新成功:
{
  acknowledged: true,
  modifiedCount: 1,
  upsertedId: null,
  upsertedCount: 0,
  matchedCount: 1
}
acknowledged: true
  - 表示操作被服务器确认
  - 表明请求已被正确处理
modifiedCount: 1
  - 实际被修改的文档数量
  - 1 表示成功修改了一条记录
matchedCount: 1
  - 匹配查询条件的文档数量
  - 1 表示找到了一条匹配的记录
upsertedId: null
  - 如果是新插入的文档，这里会显示新文档的 _id
  - null 表示这次操作没有插入新文档
upsertedCount: 0
  - 新插入的文档数量
  - 0 表示没有插入新文档
*/
