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
    const result = await client.db("admin").command({ ping: 1 });
    console.log("连接成功！");
    return result;
  } catch (error) {
    console.error("连接失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

testConnection().catch(console.error);
