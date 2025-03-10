const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/*
- 日志ID ：唯一标识每条日志记录。
- 用户ID ：关联到用户表中的用户，标识是哪位用户进行了操作。
- 操作类型 ：描述用户进行了什么操作（例如：登录、登出、接口调用等）。
- 时间戳 ：记录操作发生的具体时间。
- IP地址 ：记录用户操作时的IP地址。
- 操作结果 ：记录操作的结果（例如：成功、失败）。
- 详细信息 ：可选字段，用于记录操作的详细信息或备注。
*/

async function logUserAction(userId, actionType, ipAddress, status, details = '') {
  try {
    await client.connect();
    const database = client.db("fund");
    const logsCollection = database.collection('userLogs');
    const logEntry = {
      userId,
      actionType,
      ipAddress,
      status,
      details,
      timestamp: '2023-03-07 17:39:45'
    };
    await logsCollection.insertOne(logEntry);
    console.log("日志记录成功");
  } catch (error) {
    console.error("日志记录失败:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// 使用示例
logUserAction('user123', 'login', '192.168.1.1', 'success', '用户成功登录').catch(console.error);
