const fs = require('fs');
const path = require('path');
const { arr } = require('./databse');

// 创建data文件夹(如果不存在)
if (!fs.existsSync('./fundData')) {
  fs.mkdirSync('./fundData');
}
emptyDirectory('./fundData'); // 清空文件夹函数

// 清空文件夹函数
function emptyDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const curPath = path.join(directory, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        emptyDirectory(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

