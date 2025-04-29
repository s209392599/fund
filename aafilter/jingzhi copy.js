const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs').promises; // 使用 promises 版本更适合 async/await

async function processData() {
  try {
    // 获取数据目录
    const dataDir = path.join(__dirname, './data_guimo/data_all');

    // 读取所有文件
    const files = await fs.readdir(dataDir);
    console.log('files', files);
    let fund_total_num = 0;// 基金的总共数量
    // 使用正确的变量名 files 而不是 jsonFiles
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const data = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      fund_total_num += jsonData.data.length;
      console.log(`${file} 包含 ${jsonData.data.length} 条数据`);
    }
    console.log(`全部的基金数量为 ${fund_total_num} 条数据`);// 9316 条数据

    /*
    1. 近一年收益 3% +
    2. 近半年收益 1% +
    3. 近半年时的净值 > 近半年
    */
  } catch (e) {
    console.log('处理数据时发生错误:', e);
  }
}

processData();
