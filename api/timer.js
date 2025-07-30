const schedule = require('node-schedule'); // 定时器
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('./CustomFn.js');

// 获取 中信保诚多策略混合 的涨幅
const get_zhi_018561 = () => {
  console.log(
    'get_zhi_018561',
    CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd hh:mm:ss')
  );
  fetch('https://fundgz.1234567.com.cn/js/018561.js?v=' + +new Date())
    .then((res) => res.text())
    .then((res) => {
      // jsonpgz({"fundcode":"018561","name":"中信保诚多策略混合(LOF)C","jzrq":"2025-07-29","dwjz":"2.0670","gsz":"2.0544","gszzl":"-0.61","gztime":"2025-07-30 14:08"});
      // console.log(res);
      let str = res.replaceAll('jsonpgz(', '').replaceAll(');', '') || '{}';
      let obj = JSON.parse(str);

      let fileName = '018561_' + cur_time + '.json';
      let fileDir = path.join(__dirname, 'data/preview/018561');
      let filePath = path.join(fileDir, fileName);

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
    })
    .catch((err) => {
      console.log('err', err);
    });
};

let scheduledTasks = null; // 定时任务
scheduledTasks = schedule.scheduleJob('* * * * * *', async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  // console.log(`${hours}:${minutes}:${seconds}`);

  const time_09_30_00 = new Date(`${year}-${month}-${day} 09:30:00`).getTime();
  const time_11_30_00 = new Date(`${year}-${month}-${day} 11:30:00`).getTime();
  const time_13_30_00 = new Date(`${year}-${month}-${day} 13:30:00`).getTime();
  const time_15_00_00 = new Date(`${year}-${month}-${day} 15:00:00`).getTime();

  const time_current = now.getTime();
  const flag_1 = time_current >= time_09_30_00; // 大于9点半
  const flag_2 = time_current <= time_11_30_00; // 小于11点半
  const flag_3 = time_current >= time_13_30_00; // 大于9点半
  const flag_4 = time_current <= time_15_00_00; // 小于11点半
  if (((flag_1 && flag_2) || (flag_3 && flag_4)) && seconds === 0) {
    // console.log(
    //   '执行任务 -> ',
    //   CustomFn.CustomDateFtt(new Date(), 'yyyy-MM-dd hh:mm:ss')
    // );
    get_zhi_018561(); // 获取 中信保诚多策略混合 的涨幅
  }
});
