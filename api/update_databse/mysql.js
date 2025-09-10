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

---------------------------------------------------------------------------------------

fund_code fund_name 任意一个为NULL的总个数

SELECT COUNT(*) AS count
FROM fund 
WHERE fund_code IS NULL OR fund_name IS NULL

---------------------------------------------------------------------------------------

查询fund表中include_no_keyword字段为 'y' 的记录数量

SELECT COUNT(*) AS count FROM fund WHERE include_no_keyword = 'y'


---------------------------------------------------------------------------------------

查询fund表中include_no_keyword字段不是 'y' 的记录数量，注意null会被过滤掉

SELECT COUNT(*) AS count
FROM fund
WHERE include_no_keyword != 'y' OR include_no_keyword IS NULL;


---------------------------------------------------------------------------------------

查询fund表中include_no_keyword字段不是NULL的记录数量

SELECT COUNT(*) AS count FROM fund WHERE include_no_keyword IS NOT NULL

---------------------------------------------------------------------------------------

同时查看这些记录的fund_code

SELECT COUNT(*) AS count, GROUP_CONCAT(fund_code) AS fund_codes 
FROM fund 
WHERE include_no_keyword != 'y' OR include_no_keyword IS NULL;


---------------------------------------------------------------------------------------

include_no_keyword  no_sale  这两个字段都 任意一个不为y的总个数

方法一：
SELECT COUNT(*) AS count
FROM fund 
WHERE 
    (include_no_keyword IS NULL OR include_no_keyword != 'y') 
    AND 
    (no_sale IS NULL OR no_sale != 'y');

方法二：    
SELECT COUNT(*) AS count 
FROM fund 
WHERE 
    COALESCE(include_no_keyword, '') != 'y' 
    AND 
    COALESCE(no_sale, '') != 'y';

---------------------------------------------------------------------------------------

include_no_keyword  no_sale  这两个字段 任意一个为y

SELECT COUNT(*) AS count, GROUP_CONCAT(fund_code) AS fund_codes 
FROM fund 
WHERE include_no_keyword != 'y' AND no_sale != 'y' OR include_no_keyword IS NOT NULL OR no_sale IS NOT NULL


---------------------------------------------------------------------------------------

统计include_no_keyword  no_sale  这两字段组合情况

SELECT include_no_keyword, no_sale, COUNT(*) 
FROM fund 
GROUP BY include_no_keyword, no_sale

SELECT 
  include_no_keyword,
  no_sale,
  COUNT(*) AS count
FROM fund
GROUP BY include_no_keyword, no_sale
ORDER BY include_no_keyword, no_sale;

*/
