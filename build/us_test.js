const scpClient = require('scp2');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

var filePath = '';
const platform = process.platform;

if (platform === 'darwin') {
  console.log('当前系统是 macOS');
} else if (platform === 'win32') {
  console.log('当前系统是 Windows');
} else if (platform === 'linux') {
  console.log('当前系统是 Linux');
}

const configs = {
  host: '172.16.1.43',
  username: 'root',
  password: 'Fenzhi2022',
  path: '/usr/local/fz/tomcat/apache-tomcat-8.5.73/webapps/TEST_LOCAL/WEB-INF/classes/static', // 同步到的服务器路径
  scpFrom: './../dist/', // 同步的本地目录
  port: 22,
};
let verifyAddress =
  'https://appservice.dipstandard.cn:19943/TEST_LOCAL/index.html'; // 验证地址

scpClient.scp(
  './deploy.sh',
  {
    host: configs.host,
    port: configs.port,
    username: configs.username,
    password: configs.password,
    path: configs.path,
  },
  function (err) {
    if (err) {
      console.log('同步【deploy.sh】到服务器失败=>', err);
    } else {
      console.log('已同步【deploy.sh】到服务器！');

      // 获取git分支名称
      const childProcess = require('child_process');
      let assetsDir =
        'static_' +
          childProcess
            .execSync('git rev-parse --abbrev-ref HEAD')
            .toString()
            .replace(/\s+/, '') || 'main'; // static的名称
      if (process.argv[2] === 'Web') {
        assetsDir += 'Web'; // 开发自测环境
        verifyAddress =
          'https://appservice.dipstandard.cn:19943/TEST_LOCAL/web.html';
      }
      console.log(`删除的文件夹---${assetsDir}`);

      ssh
        .connect({
          host: configs.host,
          username: configs.username,
          password: configs.password,
          port: configs.port, //SSH连接默认在22端口
        })
        .then(function () {
          ssh
            .execCommand(`sh deploy.sh ${assetsDir}`, { cwd: configs.path })
            .then(function (result) {
              if (!result.stderr) {
                syncFrontEnd();
              } else {
                console.log('请检查服务器是否缺失 deploy.sh文件！');
                process.exit(0);
              }
            });
        })
        .catch((err) => {
          console.log('ssh连接失败:', err);
          process.exit(0);
        });
    }
  }
);

// 把dist文件同步到服务器
function syncFrontEnd() {
  scpClient.scp(
    configs.scpFrom,
    {
      host: configs.host,
      port: configs.port,
      username: configs.username,
      password: configs.password,
      path: configs.path,
    },
    function (err) {
      if (err) {
        console.log('同步【test】服务器失败=>', err);
      } else {
        console.log('同步【test】服务器成功！');
        console.log(verifyAddress, ' 浏览器访问地址');
      }
      process.exit(0);
    }
  );
}
