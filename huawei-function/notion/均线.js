// 计算简单移动平均（SMA）
function calculateSMA(data, period) {
  if (data.length < period) return []; // 数据不足
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

// 计算标准差（Standard Deviation）
function calculateStdDev(data, period, sma) {
  const stdDev = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const variance = slice.reduce((sum, value) => sum + Math.pow(value - sma[i - period + 1], 2), 0) / period;
    stdDev.push(Math.sqrt(variance));
  }
  return stdDev;
}

// 计算布林线三轨
function calculateBollingerBands(data, period = 20, multiplier = 2) {
  const sma = calculateSMA(data, period); // 中轨
  const stdDev = calculateStdDev(data, period, sma); // 标准差

  const upperBand = sma.map((val, idx) => val + multiplier * stdDev[idx]); // 上轨
  const lowerBand = sma.map((val, idx) => val - multiplier * stdDev[idx]); // 下轨

  return { middleBand: sma, upperBand, lowerBand };
}

const closePrices = [10, 12, 11, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 8, 9, 10];
const { middleBand, upperBand, lowerBand } = calculateBollingerBands(closePrices);

console.log("中轨:", middleBand);
console.log("上轨:", upperBand);
console.log("下轨:", lowerBand);

// 以 ECharts 为例
option = {
  xAxis: { data: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7', 'Day8', 'Day9', 'Day10', 'Day11', 'Day12', 'Day13', 'Day14', 'Day15', 'Day16', 'Day17', 'Day18', 'Day19', 'Day20'] },
  yAxis: {},
  series: [
    { name: '上轨', data: upperBand, type: 'line' },
    { name: '中轨', data: middleBand, type: 'line' },
    { name: '下轨', data: lowerBand, type: 'line' }
  ]
};
