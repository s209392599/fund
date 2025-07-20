const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,  // Explicitly enable TLS
  tlsAllowInvalidCertificates: false,  // Keep this false for production
  connectTimeoutMS: 10 * 1000,  // 10 seconds connection timeout
  socketTimeoutMS: 45 * 1000,   // 45 seconds socket timeout
});

async function testConnection() {
  try {
    await client.connect();
    const result = await client.db("admin").command({ ping: 1 });
    console.log("连接成功！");
    return result;
  } catch (error) {
    console.error("message:", error.message);
    console.error("stack:", error.stack);
    throw error;
  } finally {
    await client.close();
  }
}

testConnection().catch(console.error);
