
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://boxue:Boxueis666@boxue.lpczq.mongodb.net/?retryWrites=true&w=majority&appName=boxue";

console.log('开始尝试连接~~~');
let startTime = Date.now();
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // waitQueueTimeoutMS: 5000, // 等待连接超时时间
  // maxIdleTimeMS: 300000,     // 空闲连接保持时间(5分钟)
  minPoolSize: 10,  // 保持的最小连接数
  maxPoolSize: 150, // 增加连接池大小
  heartbeatFrequencyMS: 5000,   // 心跳频率
  retryWrites: true,            // 启用重试写入
  retryReads: true              // 启用重试读取
});

async function run() {
  try {
    await client.connect();
    let endTime = Date.now();
    await client.db("admin").command({ ping: 1 });
    console.log(`连接耗时: ${(endTime - startTime) / 1000} 秒`);
    console.log('数据库连接成功');
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


/*
db.serverStatus().connections 连接数

查看当前链接使用情况
db.currentOp(true).inprog.reduce(
  (acc, op) => {
    acc[op.connectionId] = 1;
    return acc;
  },
  {}
);

// 获取当前电脑的IP地址
(Invoke-WebRequest -Uri "https://api.ipify.org").Content

*/


/*
预连接和连接缓存
// 应用启动时预先建立连接
let dbClient;

async function initDB() {
  dbClient = await MongoClient.connect(uri, options);
  return dbClient;
}

// 在应用启动时调用
initDB().catch(console.error);
*/

/*
添加事件监听器诊断连接问题：
client.on('serverOpening', (event) => {
  console.log('Server opening:', event);
});

client.on('serverClosed', (event) => {
  console.log('Server closed:', event);
});

client.on('topologyOpening', (event) => {
  console.log('Topology opening:', event);
});
*/

/*
连接池预热
// 启动时预先建立minPoolSize个连接
async function warmupPool() {
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(client.db().command({ ping: 1 }));
  }
  await Promise.all(promises);
}
*/

/*
性能对比测试
console.time('First connection');
const client = await MongoClient.connect(uri, options);
console.timeEnd('First connection'); // 目标: <2000ms

console.time('Second connection');
const client2 = await MongoClient.connect(uri, options);
console.timeEnd('Second connection'); // 目标: <100ms
*/
