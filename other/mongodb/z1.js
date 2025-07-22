/*
navicat里面高级选项里面填写 uri 直接进行数据库连接  2025年03月07日18:01:59
mongodb+srv://boxue:Boxueis666@boxue.lpczq.mongodb.net/?retryWrites=true&w=majority&appName=boxue&ssl=true&connectTimeoutMS=5000
*/

// ------------

// 如果主要按基金代码查询
async function createClusteredCollection() {
  try {
    await client.connect();
    const database = client.db("fund_db");

    await database.createCollection("fund_data", {
      clusteredIndex: {
        key: { fund_code: 1, date: 1 }, // 复合索引：基金代码+日期
        unique: true,
        name: "fund_code_date_idx"      // 索引名称
      }
    });

    console.log("集合创建成功");
  } finally {
    await client.close();
  }
}
// 如果主要按时间查询
async function createClusteredCollection() {
  try {
    await client.connect();
    const database = client.db("fund_db");

    await database.createCollection("fund_data", {
      clusteredIndex: {
        key: { date: 1, fund_code: 1 }, // 复合索引：日期+基金代码
        unique: true,
        name: "date_fund_code_idx"      // 索引名称
      }
    });

    console.log("集合创建成功");
  } finally {
    await client.close();
  }
}
