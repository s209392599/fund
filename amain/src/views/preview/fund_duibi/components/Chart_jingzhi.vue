<script setup>
// 重仓基金
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => { },
  },
});

// 注入 echarts
const echarts = inject('echarts');
const chartRef = ref(null);
let myChart = null;

const turnData = () => {
  let obj = props.data || {};

  let res = {
    xAxisData: [],// x轴数据
    line_data_01: [],// 基础数据
    line_data_05: [],// 5日线数据
    line_data_10: [],// 10日线数据
    line_data_20: [],// 20日线数据
    line_data_30: [],// 30日线数据
    line_data_60: [],// 60日线数据
    line_data_top: [],// 上布林线数据
    line_data_bottom: [],// 下布林线数据
  }
  let titleMap = obj.titleMap || {};
  if (!titleMap.totalNetValueRowName) {
    return res;// 000009等货币型基金或者其他，不予展示
  }

  let netValueList = obj.netValueList || [];
  netValueList.forEach((item_1, index_1) => {
    res.xAxisData.push(item_1.date);
    res.line_data_01.push(parseFloat(item_1.totalNetValue));

    // 计算5日均线：过去5天值的平均值，保留4位小数
    if (index_1 >= 5) {
      let sum = 0;
      for (let i = index_1 - 4; i <= index_1; i++) {
        sum += parseFloat(netValueList[i].totalNetValue);
      }
      res.line_data_05.push(Number((sum / 5).toFixed(4)));
    } else {
      res.line_data_05.push(null);
    }

    // 计算10日均线：过去10天值的平均值，保留4位
    if (index_1 >= 10) {
      let sum = 0;
      for (let i = index_1 - 9; i <= index_1; i++) {
        sum += parseFloat(netValueList[i].totalNetValue);
      }
      res.line_data_10.push(Number((sum / 10).toFixed(4)));
    } else {
      res.line_data_10.push(null);
    }

    // 计算20日均线：过去20天值的平均值，保留4位
    if (index_1 >= 20) {
      let sum = 0;
      for (let i = index_1 - 19; i <= index_1; i++) {
        sum += parseFloat(netValueList[i].totalNetValue);
      }
      res.line_data_20.push(Number((sum / 20).toFixed(4)));
    } else {
      res.line_data_20.push(null);
    }

    // 计算30日均线：过去30天值的平均值，保留4位
    if (index_1 >= 30) {
      let sum = 0;
      for (let i = index_1 - 29; i <= index_1; i++) {
        sum += parseFloat(netValueList[i].totalNetValue);
      }
      res.line_data_30.push(Number((sum / 30).toFixed(4)));
    } else {
      res.line_data_30.push(null);
    }

    // 计算60日均线：过去60天值的平均值，保留4位
    if (index_1 >= 60) {
      let sum = 0;
      for (let i = index_1 - 59; i <= index_1; i++) {
        sum += parseFloat(netValueList[i].totalNetValue);
      }
      res.line_data_60.push(Number((sum / 60).toFixed(4)));
    } else {
      res.line_data_60.push(null);
    }
  });

  //line_data_01 等都只取最后245个，如果不够前面用null
  res.xAxisData = res.xAxisData.slice(-245).map(item => item || null);
  res.line_data_01 = res.line_data_01.slice(-245).map(item => item || null);
  res.line_data_05 = res.line_data_05.slice(-245).map(item => item || null);
  res.line_data_10 = res.line_data_10.slice(-245).map(item => item || null);
  res.line_data_20 = res.line_data_20.slice(-245).map(item => item || null);
  res.line_data_30 = res.line_data_30.slice(-245).map(item => item || null);
  res.line_data_60 = res.line_data_60.slice(-245).map(item => item || null);
  // res.line_data_top = res.line_data_top.slice(-245).map(item => item || null);
  // res.line_data_bottom = res.line_data_bottom.slice(-245).map(item => item || null);

  return res;
};

// 在数据准备阶段计算
function calculateYAxisRange(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const interval = range / 4; // 5 段 => 4 个间隔

  return {
    min: min - interval * 0.5,
    max: max + interval * 0.5,
    interval: interval
  };
}

// 渲染图表函数
function RenderChart() {
  if (!myChart) return;

  const chartData = turnData();
  if (chartData.xAxisData.length === 0) {
    myChart.setOption({
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: '暂无数据',
          fontSize: 32,
          fill: '#999',
        }
      }
    }, true);
    return;
  }

  let xAxisData = chartData.xAxisData || [];
  const yAxisRange = calculateYAxisRange(chartData.line_data_01);

  let option = {
    grid: {
      top: '30',
      left: '2%',
      right: '6%',
      bottom: '0',
      containLabel: true,
    },
    legend: {
      show: true,
      top: '1%',
      data: ['5日线', '10日线', '20日线', '30日线', '60日线'],
      selected: {
        '上布林线': false,
        '下布林线': false,
        '10日线': false,
        '20日线': false
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        return params[0].name + '<br>' + params[0].seriesName + ': ' + params[0].value + '%';
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        formatter: function (value) {
          if (value && value.length >= 10) {
            return value.substring(5, 10).replace('-', '/');
          }
          return value;
        },
        // rotate: 30,
        // 只显示4个label
        interval: function (index, value) {
          const total = xAxisData.length - 1;
          if (total <= 4) return true;

          const positions = [
            0,  // 第一个
            Math.floor(total * 1 / 3),  // 1/3位置
            Math.floor(total * 2 / 3),  // 2/3位置
            total  // 最后一个
          ];

          return positions.includes(index);
        },
        align: 'center',
        verticalAlign: 'middle'
      },
      boundaryGap: false,
    },
    // max: (value) => {
    //   const range = value.max - value.min;
    //   return value.max + range * 0.2;
    // },
    // minInterval: 0.0001, // 最小间隔精度
    // yAxis: {
    //   type: 'value',
    //   min: (value) => value.min - 0.05,
    //   SVGFEConvolveMatrixElement: (value) => value.min + 0.05,

    //   splitNumber: 5, // 强制分为 5 段
    //   interval: (value) => (value.max - value.min + 0.05 * 2) / 5,
    //   minInterval: (value) => (value.max - value.min + 0.05 * 2) / 5,
    //   axisLabel: {
    //     formatter: (value) => value.toFixed(4) // 保留 4 位小数
    //   }
    // },
    yAxis: {
      type: 'value',
      min: yAxisRange.min,
      max: yAxisRange.max,
      interval: yAxisRange.interval,
      axisLabel: {
        formatter: (value) => value.toFixed(4)
      }
    },
    series: ([
      {
        name: '基础',
        data: chartData.line_data_01 || [],
      },
      {
        name: '上布林线',
        type: 'line',
        data: chartData.line_data_top || [],
      },
      {
        name: '下布林线',
        data: chartData.line_data_bottom || [],
      },
      {
        name: '5日线',
        data: chartData.line_data_05 || [],
      },
      {
        name: '10日线',
        data: chartData.line_data_10 || [],
      },
      {
        name: '20日线',
        data: chartData.line_data_20 || [],
      },
      {
        name: '30日线',
        data: chartData.line_data_30 || [],
      },
      {
        name: '60日线',
        data: chartData.line_data_60 || [],
      },
    ]).map(item => {
      return {
        ...item,
        type: 'line',
        symbol: 'none',
        smooth: true,
        lineStyle: {
          width: 0.7,
        },
      };
    }),
  };

  myChart.setOption(option, true);
}

// 在组件挂载时初始化图表
onMounted(() => {
  if (chartRef.value && echarts) {
    myChart = echarts.init(chartRef.value);
    RenderChart(); // 渲染图形
  }
});

// 监听数据变化，重新渲染图表
watch(
  () => props.data,
  () => {
    RenderChart();
  },
  { deep: true }
);

// 在组件卸载时销毁图表
onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});
</script>

<template>
  <div ref="chartRef" class="stock_main_wrapper" style="width: 100%; height: 300px"></div>
</template>

<style scoped lang="scss"></style>
