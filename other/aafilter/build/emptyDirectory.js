const { emptyDirectory } = require('../CustomFunction');

// 获取命令行参数
const directory = process.argv[2]; // 如果没有提供参数，使用默认值
// const directory = process.argv[2] || './data_guimo'; // 如果没有提供参数，使用默认值

if(directory){
  console.log(`正在清空目录: ${directory}`);
  emptyDirectory(directory);
  console.log('清空完成');
}else{
  console.log('没有输入正确的目录');
}


