const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// 添加移动位置的函数
async function moveFundPosition(fundCode, targetIndex) {
  try {
    await client.connect();
    const database = client.db("fund");
    const collection = database.collection('baseinfo');

    // 获取所有基金的顺序数组
    const fundsOrder = await collection
      .find({}, { projection: { fundCode: 1 } })
      .sort({ order: 1 }) // 使用 order 排序
      .toArray();
    const fundCodes = fundsOrder.map(doc => doc.fundCode);

    // 找到当前基金的位置
    const currentIndex = fundCodes.indexOf(fundCode);
    if (currentIndex === -1) {
      throw new Error('基金不存在');
    }

    // 移除并插入到新位置
    fundCodes.splice(currentIndex, 1);
    fundCodes.splice(targetIndex, 0, fundCode);

    // 批量更新所有基金的位置
    const bulkOps = fundCodes.map((code, index) => ({
      updateOne: {
        filter: { fundCode: code },
        update: { $set: { order: index } } // 更新 order 字段
      }
    }));

    const result = await collection.bulkWrite(bulkOps);
    console.log(`基金 ${fundCode} 已移动到位置 ${targetIndex} `);
    return result;
  } catch (error) {
    console.error("移动失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

async function findFunds(query = {}) {
  try {
    await client.connect();
    const database = client.db("fund");
    const result = await database.collection('baseinfo')
      .find(query)
      .sort({ order: 1 }) // 使用 order 排序
      .toArray();
    console.log("查询结果:", result);
    return result;
  } catch (error) {
    console.error("查询失败:", error.message || '查询失败');
    throw error;
  } finally {
    await client.close();
  }
}

// 使用示例
async function example() {
  // 移动到第一位
  await moveFundPosition("000001", 0);

  // const afterMove1 = await findFunds();
  // console.log("移动后的顺序：", afterMove1.map(f => f.fundCode));

  // 移动到最后一位
  const funds = await findFunds();
  await moveFundPosition("000002", funds.length - 1);

  // const afterMove2 = await findFunds();
  // console.log("移动后的顺序：", afterMove2.map(f => f.fundCode));

  // 移动到中间位置
  await moveFundPosition("000003", 2);

  const afterMove3 = await findFunds();
  console.log("移动后的顺序：", afterMove3.map(f => f.fundCode));

  // await findFunds({ fundCode: "016659" });
  await findFunds();
}

// 运行示例
example().catch(console.error);
