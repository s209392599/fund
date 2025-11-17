/*
获取前600的基金
去除那些不要的基金(特殊字符、特定基金号)
去除A类的

近1日 前300 0.1
近1周 前300 0.3
近1月 前300 0.3
近3月 前300 0.2
近6月 前300 0.1

把基金最近的排名情况进行 一个折线图，读取进来3个月的，
基金均线的图  都读取出来，防止007467这样的，方便及时调整

基金减仓榜？连续三天前5名不可取
*/

/*
https://m.1234567.com.cn/index.html?page=jjph&tab=qb -- 全部基金排行
*/
fetch("https://condition.tiantianfunds.com/condition/conditionFund/fundSelect", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://m.1234567.com.cn/",
  "body": "orderField=5_1_-1&pageIndex=1&pageNum=30&pageType=5&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&abnormal=3&rankSy=1",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});


/*
https://fund.eastmoney.com/trade/hh.html#zwf_,sc_z,st_desc
*/
fetch("https://fund.eastmoney.com/data/fundtradenewapi.aspx?ft=hh&sc=z&st=desc&pi=1&pn=150&cp=&ct=&cd=&ms=&fr=&plevel=&fst=&ftype=&fr1=&fl=0&isab=1", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://fund.eastmoney.com/trade/hh.html",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});



/*
布林带+均线+KDJ+macd
历史推荐管理

firewall-cmd --reload  刷新防火墙


*/



// 根据关键词返回基金
router.post('/fund_mysql_query_keywords', async (req, res) => {
  const { text = '' } = req.body;
  if (text.length < 2) {
    res.send({
      code: 400,
      msg: '未正确获取到搜索关键词',
      data: [],
    });
    return;
  }
console.log('查询text',text);
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('数据库连接成功！');

    var query = `
SELECT
    fund_code,
    fund_name,
    fund_type_name
FROM
    fund_all
WHERE
    fund_name LIKE ?
    AND no_keyword = 'y'
    AND is_sale = 'y'
`;
/*
AND (no_keyword IS NULL OR no_keyword = 'n')
AND (is_sale IS NULL OR is_sale != 'y')
*/
    // 使用connection.execute而不是connection.query来确保参数化查询正确执行
    const [results] = await Promise.race([
      connection.execute(query, [`%${text}%`]),// 使用参数化查询防止SQL注入
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('数据库查询超时')), 15 * 1000)
      ), // 查询超时时间（毫秒）
    ]);

    console.log(`数据库中一共有${results.length}个基金`);

    return res.send({
      code: 200,
      msg: '获取成功',
      data: results,
    });
  } catch (error) {
    console.error('数据库操作失败:', error.message);
    return res.send({
      code: 500,
      msg: '数据库查询出错',
    });
  } finally {
    // 确保连接被释放回连接池
    if (connection) {
      connection.release();
    }
  }
});
