const fs = require('fs');
const path = require('path');

// 确保目录存在
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 安全的文件读取和写入函数
const safeWriteJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

const processFunds = () => {
  // 初始化路径
  const baseFilePath = './base.json';
  const outputDir = './group';

  // 确保输出目录存在
  ensureDirExists(outputDir);

  // 读取初始数据
  let remainingData = require(baseFilePath);
  console.log(`初始数据量: ${remainingData.length}`);

  // 定义需要匹配的关键词
  const keywords = [
    'A500',
    '沪深300',
    '中证500',
    '中证800',
    '中证1000',
    '中证2000',
    'A50',
    '科创50',
    '上证50',
    '创业板',
    '中证全指',
    '科创板',
    '红利',
    '消费',
    '港股通',
    '深证',
    '灵活配置',
    '医药',
    '周期',
    '阿尔法',
    '多策略',
    '军工',
    '精选',
    '行业',
    '医疗',
  ];

  // 处理每个关键词
  keywords.forEach((keyword, index) => {
    const fileNumber = (index + 1).toString().padStart(2, '0');
    const outputFileName = `a${fileNumber}_${keyword}.json`;
    const outputPath = path.join(outputDir, outputFileName);

    // 分离匹配和不匹配的数据
    const { matched, unmatched } = remainingData.reduce(
      (result, fund) => {
        if (fund.fund_name.includes(keyword)) {
          result.matched.push(fund);
        } else {
          result.unmatched.push(fund);
        }
        return result;
      },
      { matched: [], unmatched: [] }
    );

    // 如果有匹配项，写入新文件并更新 base.json
    if (matched.length > 0) {
      // 写入分组文件
      const groupData = {
        length: matched.length,
        data: matched,
      };

      if (safeWriteJSON(outputPath, groupData)) {
        console.log(`✓ 成功创建 ${outputFileName}: ${matched.length} 条记录`);
      }

      // 更新剩余数据
      remainingData = unmatched;

      // 更新 base.json
      if (safeWriteJSON(baseFilePath, remainingData)) {
        console.log(`  更新 base.json: ${remainingData.length} 条剩余记录`);
      }

      console.log(
        `${matched.length} + ${remainingData.length} = ${
          matched.length + remainingData.length
        } (验证总数)`
      );
    } else {
      console.log(`✗ 未找到包含 "${keyword}" 的基金`);
    }
  });

  console.log('处理完成！');
  console.log(`最终剩余 ${remainingData.length} 条记录在 base.json 中`);
};

// 执行处理
processFunds();
