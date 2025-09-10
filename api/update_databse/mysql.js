// 测试连接服务器
const { exec } = require('child_process');
exec('ping 150.158.175.108', (error, stdout, stderr) => {
  if (error) {
    console.error('无法连接到服务器:', error.message);
    return;
  }
  console.log('服务器已连接');
});

/*

查询fund表有多少条记录
SELECT COUNT(*) FROM fund;

查询fund表中include_no_keyword字段为 'y' 的记录数量
SELECT COUNT(*) AS count FROM fund WHERE include_no_keyword = 'y'

查询fund表中include_no_keyword字段不是 'y' 的记录数量，注意null会被过滤掉
SELECT COUNT(*) AS count
FROM fund
WHERE include_no_keyword != 'y' OR include_no_keyword IS NULL;

查询fund表中include_no_keyword字段不是NULL的记录数量
SELECT COUNT(*) AS count FROM fund WHERE include_no_keyword IS NOT NULL

同时查看这些记录的fund_code
SELECT COUNT(*) AS count, GROUP_CONCAT(fund_code) AS fund_codes 
FROM fund 
WHERE include_no_keyword != 'y' OR include_no_keyword IS NULL;


*/



/*

SELECT * FROM fund WHERE include_no_keyword != 'y'

查询 include_no_keyword != 'y' 的记录数量
SELECT COUNT(*) AS count FROM fund WHERE include_no_keyword != 'y'


SELECT COUNT(*) AS count, GROUP_CONCAT(fund_code) AS fund_codes 
FROM fund WHERE include_no_keyword != 'y'



*/