const fs = require('fs');
const path = require('path');

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
  ensureDirectoryExists('./data_06');

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(content);

      let arr_2 = jsonData.data.filter((v) => v[3] > 1.06);
      count += arr_2.length;

      const path_1 = `./data_06/${file}`;
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
