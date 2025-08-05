const fs = require('fs');
const path = require('path');

// 定义要添加的字段  {a:1,b:’‘}:添加a字段，值为1,b字段
let obj_add = {
  // aaa: '',
};
// 定义要删减的字段  ['c']:删除c字段
let obj_ins = ['aaa'];

// 读取user.json文件的路径
const filePath = path.join(__dirname, 'user.json');

// 读取JSON文件内容
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }

  // 解析JSON数据
  let jsonObj;
  try {
    jsonObj = JSON.parse(data);
  } catch (e) {
    console.error('解析JSON失败:', e);
    return;
  }

  // 遍历data数组并修改每一行
  jsonObj.data.forEach((item) => {
    // 添加字段
    for (let key in obj_add) {
      if (obj_add[key] !== null && obj_add[key] !== undefined) {
        // item[key] = generatePassword();
        item[key] = obj_add[key];
      }
    }

    // 删除字段
    obj_ins.forEach((key) => {
      if (item.hasOwnProperty(key)) {
        delete item[key];
      }
    });
  });

  // 将对象转换回JSON字符串
  const updatedJson = JSON.stringify(jsonObj, null, 2); // 使用缩进使JSON更易读

  // 写入JSON文件
  fs.writeFile(filePath, updatedJson, 'utf8', (err) => {
    if (err) {
      console.error('写入文件失败:', err);
      return;
    }
    console.log('文件已成功更新');
  });
});
