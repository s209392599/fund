const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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
  // 删除基金
  await deleteFund("000001");

  // 查询特定基金
  await findFunds({ fundCode: "000001" });
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
