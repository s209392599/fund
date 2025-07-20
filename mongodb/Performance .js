const { MongoClient, ServerApiVersion } = require('mongodb');
const { createClient } = require('redis');
const { promisify } = require('util');

/*
生产环境建议 添加性能监控依赖
yarn add prom-client express # 用于暴露metrics端点
*/

// 配置
const config = {
  mongo: {
    uri: "mongodb+srv://boxue:Boxueis666@boxue.lpczq.mongodb.net/?retryWrites=true&w=majority&appName=boxue",
    options: {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      minPoolSize: 15,
      maxPoolSize: 100,
      connectTimeoutMS: 1000,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 1000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 2000,
      readPreference: 'primaryPreferred',
      compressors: ['zlib']
    }
  },
  redis: {
    url: 'redis://localhost:6379',
    ttl: 60 // 默认缓存时间(秒)
  }
};

// 全局变量
let mongoClient;
let redisClient;
let redisGetAsync;
let redisSetAsync;

/**
 * 初始化Redis连接
 */
async function initRedis() {
  console.log('初始化Redis连接...');
  redisClient = createClient({ url: config.redis.url });

  redisClient.on('error', (err) => console.error('Redis错误:', err));
  redisClient.on('connect', () => console.log('Redis连接成功'));
  redisClient.on('reconnecting', () => console.log('Redis重新连接'));
  redisClient.on('end', () => console.log('Redis连接关闭'));

  await redisClient.connect();

  // Promisify Redis方法
  redisGetAsync = promisify(redisClient.get).bind(redisClient);
  redisSetAsync = promisify(redisClient.set).bind(redisClient);
}

/**
 * 初始化MongoDB连接
 */
async function initMongoDB() {
  console.log('初始化MongoDB连接...');
  try {
    mongoClient = new MongoClient(config.mongo.uri, config.mongo.options);
    await mongoClient.connect();

    // 测试连接
    await mongoClient.db().admin().ping();
    console.log('MongoDB连接成功');

    // 预热连接池
    await warmupConnectionPool();
    // 确保索引
    await ensureIndexes();
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    throw error;
  }
}

/**
 * 预热连接池
 */
async function warmupConnectionPool() {
  console.log('预热MongoDB连接池...');
  const warmupPromises = Array.from({ length: config.mongo.options.minPoolSize }, () =>
    mongoClient.db().command({ ping: 1 })
  );
  await Promise.all(warmupPromises);
  console.log('连接池预热完成');
}

/**
 * 确保索引存在
 */
async function ensureIndexes() {
  const db = mongoClient.db();
  try {
    await db.collection('baseinfo').createIndex({ fundCode: 1 }, { background: true });
    console.log('索引已确保');
  } catch (error) {
    console.error('索引创建错误:', error.message);
  }
}

/**
 * 从缓存获取数据，不存在则从MongoDB获取并缓存
 */
async function getWithCache(key, queryFn, ttl = config.redis.ttl) {
  try {
    // 尝试从Redis获取
    const cachedData = await redisGetAsync(key);
    if (cachedData) {
      console.log(`[缓存命中] ${key}`);
      return JSON.parse(cachedData);
    }

    // 从MongoDB获取
    console.log(`[缓存未命中] ${key}`);
    const freshData = await queryFn();

    // 设置缓存（不阻塞主流程）
    if (freshData) {
      redisSetAsync(key, JSON.stringify(freshData), 'EX', ttl)
        .catch(err => console.error('缓存设置失败:', err));
    }

    return freshData;
  } catch (error) {
    console.error('缓存处理错误:', error);
    // 降级处理：直接查询数据库
    return await queryFn();
  }
}

/**
 * 获取基金数据（带缓存）
 */
async function getFundData(fundCode) {
  const cacheKey = `fund:${fundCode}`;

  return getWithCache(cacheKey, async () => {
    return mongoClient.db().collection('baseinfo')
      .find({ fundCode }, { projection: { _id: 0 } })
      .toArray();
  });
}

/**
 * 批量获取基金数据（优化版）
 */
async function getBatchFundData(fundCodes) {
  const cacheKeys = fundCodes.map(code => `fund:${code}`);
  const cacheResults = await Promise.all(
    cacheKeys.map(key => redisGetAsync(key).catch(() => null))
  );

  // 分类已缓存和未缓存的
  const cachedData = [];
  const uncachedCodes = [];

  cacheResults.forEach((result, index) => {
    if (result) {
      cachedData.push(JSON.parse(result));
    } else {
      uncachedCodes.push(fundCodes[index]);
    }
  });

  // 获取未缓存的数据
  let freshData = [];
  if (uncachedCodes.length > 0) {
    freshData = await mongoClient.db().collection('baseinfo')
      .find({ fundCode: { $in: uncachedCodes } }, { projection: { _id: 0 } })
      .toArray();

    // 缓存新数据
    freshData.forEach(data => {
      const key = `fund:${data.fundCode}`;
      redisSetAsync(key, JSON.stringify(data), 'EX', config.redis.ttl)
        .catch(err => console.error('批量缓存设置失败:', err));
    });
  }

  // 合并结果并保持原始顺序
  return fundCodes.map(code =>
    [...cachedData, ...freshData].find(item => item.fundCode === code)
  ).filter(Boolean);
}

/**
 * 测试查询性能
 */
async function testQueryPerformance() {
  console.log('\n开始性能测试...');

  // 1. 测试单条查询（带缓存）
  console.time('单条查询（带缓存）');
  const result1 = await getFundData("007540");
  console.timeEnd('单条查询（带缓存）');
  console.log(`获取到 ${result1.length} 条记录`);

  // 2. 测试单条查询（缓存命中）
  console.time('单条查询（缓存命中）');
  const result2 = await getFundData("007540");
  console.timeEnd('单条查询（缓存命中）');

  // 3. 测试批量查询
  const codes = ["007540", "007541", "007542", "007543"];
  console.time('批量查询');
  const batchResult = await getBatchFundData(codes);
  console.timeEnd('批量查询');
  console.log(`批量获取到 ${batchResult.length} 条记录`);

  // 4. 测试聚合查询
  console.time('聚合查询');
  const aggResult = await mongoClient.db().collection('baseinfo').aggregate([
    { $match: { fundCode: { $in: codes } } },
    { $project: { _id: 0, fundCode: 1, fundName: 1 } },
    { $limit: 10 }
  ]).toArray();
  console.timeEnd('聚合查询');
  console.log(`聚合查询结果: ${aggResult.length} 条`);
}

/**
 * 清理资源
 */
async function cleanup() {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis连接已关闭');
  }
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB连接已关闭');
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 初始化连接
    await initRedis();
    await initMongoDB();

    // 运行性能测试
    await testQueryPerformance();

    // 这里可以添加你的业务逻辑
    // await yourBusinessLogic();

  } catch (error) {
    console.error('应用程序错误:', error);
  } finally {
    // 清理资源
    await cleanup();
    process.exit(0);
  }
}

// 启动应用
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

main();
