// https://echarts.apache.org/examples/zh/editor.html?c=line-smooth

// 计算简单移动平均（SMA）
function calculateSMA(data, period) {
  if (data.length < period) return []; // 数据不足
  let sma = Array(period).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

// 计算标准差（Standard Deviation）
function calculateStdDev(data, period, sma) {
  let stdDev = Array(period).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const variance =
      slice.reduce(
        (sum, value) => sum + Math.pow(value - sma[i - period + 1], 2),
        0
      ) / period;
    stdDev.push(Math.sqrt(variance));
  }
  return stdDev;
}

// 计算布林线三轨
function calculateBollingerBands(data, period = 20, multiplier = 2) {
  const sma = calculateSMA(data, period); // 中轨
  const stdDev = calculateStdDev(data, period, sma); // 标准差

  const upperBand = sma.map((val, idx) => {
    if (val === null) return null;
    return val + multiplier * stdDev[idx];
  }); // 上轨
  const lowerBand = sma.map((val, idx) => {
    if (val === null) return null;
    return val - multiplier * stdDev[idx];
  }); // 下轨

  return { middleBand: sma, upperBand, lowerBand };
}

const closePrices = [
  10, 12, 11, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 8, 15,
  10, 14, 23, 56, 67, 88, 90, 120,
];
const { middleBand, upperBand, lowerBand } =
  calculateBollingerBands(closePrices);

console.log('上轨:', upperBand);
console.log('中轨:', middleBand);
console.log('下轨:', lowerBand);

let color_1 = '#f00'; // y轴正数颜色
let color_2 = '#090'; // y轴负数颜色
let color_3 = ''; // k线的颜色
let color_4 = ''; // 5线的颜色
let color_5 = ''; // 60线的颜色
let color_6 = ''; //
option = {
  xAxis: {
    data: Array(closePrices.length).fill(''),
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: function (value) {
        return value >= 0 ? color_1 : color_2;
      },
    },
  },
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    containLabel: true,
  },
  // color: upperBand[upperBand.length - 1] > 0 ? color_1 : color_2
  series: [
    {
      name: '上轨',
      data: upperBand,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: upperBand[upperBand.length - 1] > 0 ? color_1 : color_2,
      },
      symbol: 'none',
      symbolSize: 0,
    },
    {
      name: '中轨',
      data: middleBand,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#5470C6',
      },
      symbol: 'none',
      symbolSize: 0,
    },
    {
      name: '下轨',
      data: lowerBand,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#5470C6',
      },
      symbol: 'none',
      symbolSize: 0,
    },
  ],
};
