var shell = require("shelljs");

// 删除原有文件
shell.rm('-rf','../static');
shell.rm('-rf','../index.html');

shell.cd('../');

const projectRootPath = shell.pwd().stdout;// 获取项目根目录路径
shell.cp('-Rf', `${projectRootPath}/dist/*`, `${projectRootPath}/`);// 复制到根目录下
shell.rm('-rf','./dist');
