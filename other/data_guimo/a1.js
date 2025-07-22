const fs = require('fs');
const path = require('path');

// 读取指定目录下的所有json文件并处理数据
function readJsonFiles(directory) {
    const result = [];
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directory, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(content);
            const fileName = path.basename(file, '.json');

            // 处理每个数据项，添加类型名称
            jsonData.data.forEach(item => {
                result.push([...item, fileName]);
            });
        }
    });

    return result;
}

try {
    // 读取data_all目录下的所有json文件
    const dataAllPath = path.join(__dirname, 'data_all');
    const fundData = readJsonFiles(dataAllPath);

    // 将结果写入到allfund.json文件
    fs.writeFileSync(
        path.join(__dirname, 'allfund.json'),
        JSON.stringify(fundData, null, 2),
        'utf8'
    );

    console.log('数据已成功写入到allfund.json文件');
} catch (error) {
    console.error('处理过程中发生错误:', error);
}
