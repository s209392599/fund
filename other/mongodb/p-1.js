const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB 连接配置
const uri = "mongodb+srv://boxue:Boxueis666@boxue.lpczq.mongodb.net/?retryWrites=true&w=majority&appName=boxue";
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  minPoolSize: 5,               // 保持的最小连接数
  maxPoolSize: 50,             // 连接池大小
  connectTimeoutMS: 2000,       // 连接超时时间
  socketTimeoutMS: 30000,       // socket操作超时
  serverSelectionTimeoutMS: 2000, // 服务器选择超时
  heartbeatFrequencyMS: 5000,   // 心跳频率
  retryWrites: true,           // 启用重试写入
  retryReads: true             // 启用重试读取
};

// 全局数据库客户端引用
let dbClient;

/**
 * 初始化数据库连接
 */
async function initDB() {
  console.log('开始初始化数据库连接...');
  const startTime = Date.now();

  try {
    dbClient = await MongoClient.connect(uri, options);

    // 测试连接是否成功
    await dbClient.db().admin().ping();

    const duration = Date.now() - startTime;
    console.log(`✅ 数据库连接成功，耗时: ${duration}ms`);

    // 连接池预热
    await warmupConnectionPool();

    return dbClient;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    throw error;
  }
}

/**
 * 预热连接池（建立初始连接）
 */
async function warmupConnectionPool() {
  console.log('开始预热连接池...');
  const startTime = Date.now();

  try {
    // 并行执行多个ping操作来建立连接
    const promises = [];
    for (let i = 0; i < options.minPoolSize; i++) {
      promises.push(dbClient.db().admin().ping());
    }
    await Promise.all(promises);

    console.log(`✅ 连接池预热完成，耗时: ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error('连接池预热失败:', error);
  }
}

/**
 * 测试查询性能
 */
async function testQueryPerformance() {
  if (!dbClient) {
    throw new Error('数据库未连接');
  }

  console.log('\n开始测试查询性能...');

  // 测试1: 简单查询
  console.time('简单查询耗时');
  try {
    // const result = await dbClient.db().collection('baseinfo').findOne({});
    const result = await dbClient.db().collection('baseinfo').find({ fundCode: "007540" }).toArray()

    console.timeEnd('简单查询耗时');
    console.log('查询结果:', result.length);
  } catch (error) {
    console.error('简单查询失败:', error);
  }

  // 测试2: 连续多次查询
  const testCount = 9;
  console.log(`\n开始连续${testCount}次查询测试...`);

  const times = [];
  for (let i = 0; i < testCount; i++) {
    const start = Date.now();
    await dbClient.db().collection('baseinfo').findOne({});
    const duration = Date.now() - start;
    times.push(duration);
    console.log(`第${i + 1}次查询耗时: ${duration}ms`);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`\n平均查询耗时: ${avgTime.toFixed(2)}ms`);
}

/**
 * 主函数
 */
async function main() {
  try {
    // 1. 初始化数据库连接
    await initDB();

    // 2. 测试查询性能
    await testQueryPerformance();

    // 3. 这里可以添加你的业务逻辑
    // await yourBusinessLogic();

  } catch (error) {
    console.error('应用程序错误:', error);
  } finally {
    // 关闭连接
    if (dbClient) {
      await dbClient.close();
      console.log('数据库连接已关闭');
    }
    process.exit(0);
  }
}

// 启动应用
main();
