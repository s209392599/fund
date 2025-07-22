const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function createCollection(collectionName) {
  try {
    await client.connect();
    const database = client.db("fund");
    await database.createCollection(collectionName);
    console.log(`集合 ${collectionName} 创建成功`);
  } catch (error) {
    console.error("创建集合失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// 使用示例
createCollection('userLogs').catch(console.error);


