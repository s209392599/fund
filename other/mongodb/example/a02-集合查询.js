const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    await client.connect();
    // 连接实际的数据库
    const database = client.db("fund");
    // 列出所有集合
    const collections = await database.listCollections().toArray();
    console.log("连接成功！当前数据库包含以下集合：", collections);

    const result = await database.collection('baseinfo').find({}).toArray();
    // 查询 code 为 '000001' 的数据
    // const result = await database.collection('baseinfo').find({ code: '000001' }).toArray();
    console.log('集合的具体数据:', result);

    return collections;
  } catch (error) {
    console.error("连接失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

testConnection().catch(console.error);
