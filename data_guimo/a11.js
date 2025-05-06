const fs = require('fs');
const path = require('path');

/*
合煦智远嘉悦利率债A(021237) 2025年度 合煦智远嘉悦利率债A 累计分红0.494元/份
2025年	2025-04-25	2025-04-25	每份派现金0.0520元	2025-04-29
2025年	2025-04-11	2025-04-11	每份派现金0.0540元	2025-04-15
2025年	2025-03-26	2025-03-26	每份派现金0.0570元	2025-03-28
2025年	2025-03-11	2025-03-11	每份派现金0.0600元	2025-03-13
2025年	2025-02-25	2025-02-25	每份派现金0.0630元	2025-02-27
2025年	2025-02-17	2025-02-17	每份派现金0.0660元	2025-02-19
2025年	2025-01-23	2025-01-23	每份派现金0.0690元	2025-01-27
2025年	2025-01-10	2025-01-10	每份派现金0.0730元	2025-01-14

合煦智远嘉悦利率债C(021238) 2025年度 合煦智远嘉悦利率债C 累计分红0.271元/份
2025年	2025-02-25	2025-02-25	每份派现金0.0630元	2025-02-27
2025年	2025-02-17	2025-02-17	每份派现金0.0660元	2025-02-19
2025年	2025-01-23	2025-01-23	每份派现金0.0690元	2025-01-27
2025年	2025-01-10	2025-01-10	每份派现金0.0730元	2025-01-14

合煦智远嘉悦利率债E(022217) 该基金暂不开放购买


*/

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 读取指定目录下的所有json文件并处理数据
function readJsonFiles(directory) {
  const files = fs.readdirSync(directory);
  let count = 0;
  ensureDirectoryExists('./data_11');

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(content);

      let arr_2 = jsonData.data.filter((v) => v[3] > 1.11);
      count += arr_2.length;

      const path_1 = `./data_11/${file}`;
      fs.writeFileSync(
        path_1,
        JSON.stringify(
          {
            count: arr_2.length,
            data: arr_2,
          },
          null,
          2
        )
      );
    }
  });
  console.log(`过滤出来 ${count} 个符合条件的基金`);
}

try {
  // 读取目录下的所有json文件
  const dataAllPath = path.join(__dirname, 'data_filter');
  readJsonFiles(dataAllPath);
} catch (error) {
  console.error('处理过程中发生错误:', error);
}
