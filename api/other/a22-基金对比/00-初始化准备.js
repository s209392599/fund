const fs = require('fs');
const path = require('path');

/**
 * 清空指定路径下的所有文件和子文件夹，但保留该文件夹本身
 * @param {string} folderPath - 要清空的文件夹路径
 */
function clearFolder(folderPath) {
  // 检测文件夹是否存在
  if (fs.existsSync(folderPath)) {
    // 读取文件夹中的所有文件和子文件夹
    const files = fs.readdirSync(folderPath);
    // 遍历文件夹中的所有文件和子文件夹
    files.forEach((file) => {
      const curPath = path.join(folderPath, file);
      // 判断是文件夹还是文件，如果是文件夹则递归清空，否则直接删除文件
      if (fs.lstatSync(curPath).isDirectory()) {
        clearFolder(curPath);
        // 删除空子文件夹
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    console.log(`文件夹 ${folderPath} 已成功清空，但文件夹本身被保留`);
  } else {
    console.log(`文件夹 ${folderPath} 不存在`);
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

/**
 * 重置指定路径下的JSON文件内容为指定的值
 * @param {string} jsonPath - JSON文件的路径
 * @param {*} resetValue - 要重置成的值，可以是 [] 或者 {}
 */
function resetJson(jsonPath, resetValue = []) {
  // 检测文件是否存在
  if (fs.existsSync(jsonPath)) {
    // 重置JSON文件内容
    fs.writeFileSync(jsonPath, JSON.stringify(resetValue, null, 2)); // 使用2个空格进行格式化
    console.log(`JSON文件 ${jsonPath} 内容已重置`);
  } else {
    console.log(`JSON文件 ${jsonPath} 不存在`);
  }
}

// 使用示例
clearFolder('./FundDetailPageInfo'); // 清空文件夹
clearFolder('./HistoryNetValue'); // 清空文件夹
clearFolder('./FundFenhong'); // 清空文件夹
clearFolder('./Fund_xiu_fu'); // 清空文件夹
clearFolder('./Fund_mai_mai_gui_ze'); // 清空文件夹
resetJson('./data/filter.json', []); // 重置JSON文件内容为 []
resetJson('./data/error_detailpageinfo.json', []); // 重置JSON文件内容为 []
// resetJson('./data/a.json', []); // 重置JSON文件内容为 []
// resetJson('./data/a.json', {}); // 重置JSON文件内容为 {}
