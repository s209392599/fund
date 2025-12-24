const schedule = require('node-schedule'); // 定时器
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('./CustomFn.js');

let scheduledTasks = null; // 定时任务
scheduledTasks = schedule.scheduleJob('* * * * * *', async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const week = now.getDay();
  // console.log(`${hours}:${minutes}:${seconds}`);

  // 每天晚上12点更新交叉排行
  {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      console.log('-------------------------------------');
      console.log('开始更新交叉排行');
      // 更新交叉排行的代码
      /*
      fund_code
      fund_name
      update_time 更新时间
      type: 1:日周交叉 2:月周交叉 3:日周月交叉
      */
    }
  }

  // 读取量化基金每分钟涨幅
  {
    const time_09_30_00 = new Date(`${year}-${month}-${day} 09:30:00`).getTime();
    const time_11_30_00 = new Date(`${year}-${month}-${day} 11:30:00`).getTime();
    const time_13_30_00 = new Date(`${year}-${month}-${day} 13:30:00`).getTime();
    const time_15_00_00 = new Date(`${year}-${month}-${day} 15:00:00`).getTime();
    const time_current = now.getTime();
    const flag_1 = time_current >= time_09_30_00; // 大于9点半
    const flag_2 = time_current <= time_11_30_00; // 小于11点半
    const flag_3 = time_current >= time_13_30_00; // 大于9点半
    const flag_4 = time_current <= time_15_00_00; // 小于11点半
    const flag_5 = [1, 2, 3, 4, 5].includes(week); // 周一到周五
    if (flag_5 && ((flag_1 && flag_2) || (flag_3 && flag_4)) && seconds === 0) {
      let time_stamp = CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd hh:mm:ss');

      console.log('-------------------------------------');
      get_zhang_by_tiantian('018561', time_stamp); // 中信保诚多策略C
      get_zhang_by_tiantian('020726', time_stamp); // 建信灵活配置混合C
      get_zhang_by_tiantian('016858', time_stamp); // 国金量化多因子股票C--
      get_zhang_by_tiantian('018729', time_stamp); // 华夏智胜新锐股票C--
      get_zhang_by_tiantian('023350', time_stamp); // 诺安多策略混合C
    }
  }

});

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":260,"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      return netValueList;
    });
}

// 天天基金上没有预览图，直接读取量化值
const get_zhang_by_tiantian = (code, time_stamp) => {
  console.log(`${code} 开始请求`);
  fetch(
    `https://fundgz.1234567.com.cn/js/${code}.js?v=${new Date(
      time_stamp
    ).getTime()}`
  )
    .then((res) => res.text())
    .then((res) => {
      let str = res.replaceAll('jsonpgz(', '').replaceAll(');', '') || '{}';
      let obj = JSON.parse(str);
      obj.time_stamp = time_stamp;

      let cur_time = CustomFn.CustomDateFtt(new Date(), 'yyyyMMdd');
      let fileName = `${code}_${cur_time}.json`;
      let fileDir = path.join(__dirname, `data/preview/${code}`);
      let filePath = path.join(fileDir, fileName);

      // 检查文件夹在不在，不在的话创建一个
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      // 超过10个文件的时候清除一下
      if (CustomFn.CustomDateFtt(time_stamp, 'hh:mm:ss') === '09:35:00') {
        // 读取目录中的所有文件
        const files = fs.readdirSync(fileDir);

        // 过滤出符合命名格式的文件
        const pattern = /^\d{6}_\d{8}\.json$/;
        const matchedFiles = files.filter((file) => pattern.test(file));

        if (matchedFiles.length > 10) {
          // 按文件名中的日期排序（降序，最新的在前面）
          matchedFiles.sort((a, b) => {
            const dateA = a.split('_')[1].split('.')[0]; // 提取日期部分
            const dateB = b.split('_')[1].split('.')[0];
            return dateB.localeCompare(dateA); // 降序排列
          });

          // 获取需要删除的文件（保留前10个，删除其余的）
          const filesToDelete = matchedFiles.slice(10);

          // 删除旧文件
          for (const file of filesToDelete) {
            const filePath = path.join(fileDir, file);
            fs.unlinkSync(filePath);
            console.log(`已删除旧文件: ${filePath}`);
          }
        }
      }

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        // 文件不存在，创建新文件并写入初始内容
        fs.writeFileSync(
          filePath,
          JSON.stringify({ length: 0, data: [] }, null, 2)
        );
      }

      // 读取文件内容
      let fileContent = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(fileContent);

      // 更新文件内容
      data.length += 1;
      data.data.push(obj);

      // 将更新后的内容写回文件
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      //   console.log(code + '获取到的数据是：', obj);
      console.log(code + '获取到的数据是：');
    })
    .catch((err) => {
      console.log('err', err);
    });
};
