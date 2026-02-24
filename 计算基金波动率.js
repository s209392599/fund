import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取基金数据
function readFundData(fundCode) {
  const filePath = path.join(__dirname, 'other', 'data', 'fundData', `${fundCode}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件失败: ${error.message}`);
    return null;
  }
}

// 计算标准差（波动率）
function calculateStandardDeviation(returns) {
  if (returns.length === 0) return 0;

  // 计算平均值
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;

  // 计算方差
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;

  // 计算标准差
  return Math.sqrt(variance);
}

// 基于totalNetValue计算波动率
function calculateVolatilityByTotalNetValue(fundData) {
  // 提取总净值数据并转换为收益率
  const totalNetValues = fundData.map(item => parseFloat(item.totalNetValue));
  const returns = [];

  // 计算每日收益率 (当前净值-前一天净值)/前一天净值 * 100%
  for (let i = 1; i < totalNetValues.length; i++) {
    const previousValue = totalNetValues[i - 1];
    const currentValue = totalNetValues[i];
    const dailyReturn = ((currentValue - previousValue) / previousValue) * 100;
    returns.push(dailyReturn);
  }

  // 计算波动率
  const volatility = calculateStandardDeviation(returns);

  return {
    volatility: volatility,
    averageReturn: returns.reduce((sum, r) => sum + r, 0) / returns.length,
    maxReturn: Math.max(...returns),
    minReturn: Math.min(...returns),
    dataPoints: returns.length
  };
}

// 基于dailyProfit计算波动率
function calculateVolatilityByDailyProfit(fundData) {
  // 直接使用dailyProfit数据（已经是百分比形式）
  const dailyProfits = fundData.map(item => parseFloat(item.dailyProfit));

  // 计算波动率
  const volatility = calculateStandardDeviation(dailyProfits);

  return {
    volatility: volatility,
    averageReturn: dailyProfits.reduce((sum, r) => sum + r, 0) / dailyProfits.length,
    maxReturn: Math.max(...dailyProfits),
    minReturn: Math.min(...dailyProfits),
    dataPoints: dailyProfits.length
  };
}

// 计算年化波动率
function calculateAnnualizedVolatility(dailyVolatility, tradingDays = 252) {
  return dailyVolatility * Math.sqrt(tradingDays);
}

// 主函数
function calculateFundVolatility(fundCode) {
  const fundData = readFundData(fundCode);

  if (!fundData) {
    console.log(`无法读取基金 ${fundCode} 的数据`);
    return;
  }

  console.log(`=== 基金 ${fundCode} 波动率分析 ===\n`);

  // 基于totalNetValue计算
  const volatilityByNetValue = calculateVolatilityByTotalNetValue(fundData);
  console.log('基于总净值(TotalNetValue)计算的波动率:');
  console.log(`  日波动率: ${volatilityByNetValue.volatility.toFixed(4)}%`);
  console.log(`  年化波动率: ${calculateAnnualizedVolatility(volatilityByNetValue.volatility).toFixed(2)}%`);
  console.log(`  平均日收益率: ${volatilityByNetValue.averageReturn.toFixed(4)}%`);
  console.log(`  最大单日收益: ${volatilityByNetValue.maxReturn.toFixed(2)}%`);
  console.log(`  最大单日亏损: ${volatilityByNetValue.minReturn.toFixed(2)}%`);
  console.log(`  数据点数量: ${volatilityByNetValue.dataPoints}天\n`);

  // 基于dailyProfit计算
  const volatilityByDailyProfit = calculateVolatilityByDailyProfit(fundData);
  console.log('基于日收益(DailyProfit)计算的波动率:');
  console.log(`  日波动率: ${volatilityByDailyProfit.volatility.toFixed(4)}%`);
  console.log(`  年化波动率: ${calculateAnnualizedVolatility(volatilityByDailyProfit.volatility).toFixed(2)}%`);
  console.log(`  平均日收益率: ${volatilityByDailyProfit.averageReturn.toFixed(4)}%`);
  console.log(`  最大单日收益: ${volatilityByDailyProfit.maxReturn.toFixed(2)}%`);
  console.log(`  最大单日亏损: ${volatilityByDailyProfit.minReturn.toFixed(2)}%`);
  console.log(`  数据点数量: ${volatilityByDailyProfit.dataPoints}天\n`);

  // 比较两种方法的差异
  console.log('两种计算方法的比较:');
  console.log(`  波动率差异: ${Math.abs(volatilityByNetValue.volatility - volatilityByDailyProfit.volatility).toFixed(4)}%`);
  console.log(`  相对差异: ${((Math.abs(volatilityByNetValue.volatility - volatilityByDailyProfit.volatility) /
    ((volatilityByNetValue.volatility + volatilityByDailyProfit.volatility) / 2)) * 100).toFixed(2)}%`);
}

// 执行计算
// calculateFundVolatility('000297');
calculateFundVolatility('720003');
