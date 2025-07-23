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

/*
https://echarts.apache.org/examples/zh/editor.html?c=candlestick-simple
https://echarts.apache.org/examples/zh/editor.html?c=candlestick-sh
https://echarts.apache.org/examples/zh/editor.html?c=bar-waterfall
https://echarts.apache.org/examples/zh/editor.html?c=bar-waterfall2


https://www.isqqw.com/viewer?id=21080
https://www.isqqw.com/viewer?id=23215
https://www.isqqw.com/viewer?id=30068
https://www.isqqw.com/viewer?id=31235
https://www.isqqw.com/viewer?id=14995

https://www.amazonaws.cn/ecs/pricing/ 亚马逊是否可以免费服务器？

*/
