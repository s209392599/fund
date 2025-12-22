<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
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

// console.log('props.data', props.data);

const turnData = () => {
  let obj = props.data || {};
  let majorChartPointList = obj.majorChartPointList || [];
  if (JSON.stringify(majorChartPointList) === '[]') {
    return {};
  }

  let res = {
    xAxisData: [],// x轴数据
    line_data_1: [],// 第一条折线数据
    markArea: [],// 区间背景色
    markPoint: [],// 特殊点
    line_data_2: [],// 第二条折线数据
    line_data_3: [],// 第三条折线数据
  }

  let maxRetracementStartPoint = obj.maxRetracementStartPoint || {};// 最大回撤开始点
  let maxRetracementEndPoint = obj.maxRetracementEndPoint || {};// 最大回撤结束点
  let restorePoint = obj.restorePoint || {};// 修复点

  var xAxis_1 = maxRetracementStartPoint.xAxis || '';
  var xAxis_2 = maxRetracementEndPoint.xAxis || '';
  var xAxis_3 = restorePoint.xAxis || '';

  majorChartPointList.forEach(item => {
    res.xAxisData.push(item.xAxis);
    res.line_data_1.push(item.yAxis);
  });

  if (xAxis_1 && xAxis_2) {
    let time_1 = new Date(xAxis_1).getTime();
    let time_2 = new Date(xAxis_2).getTime();
    res.markPoint.push({
      name: '回撤开始点',
      coord: [xAxis_1, maxRetracementStartPoint.yAxis],
      label: {
        backgroundColor: '#76b39e',
      },
    });
    res.markPoint.push({
      name: '回撤结束点',
      coord: [xAxis_2, maxRetracementEndPoint.yAxis],
      label: {
        backgroundColor: '#ef7470',
      },
    });
    majorChartPointList.forEach(item => {
      let time_3 = new Date(item.xAxis).getTime();
      if (time_3 >= time_1 && time_3 <= time_2) {
        res.line_data_2.push(item.yAxis);
      } else {
        res.line_data_2.push(null);
      }
    });
  }

  if (xAxis_2 && xAxis_3) {
    let time_2 = new Date(xAxis_2).getTime();
    let time_3 = new Date(xAxis_3).getTime();
    res.markPoint.push({
      name: '修复点',
      coord: [xAxis_3, restorePoint.yAxis],
      label: {
        backgroundColor: '#ef7470',
      },
    });
    res.markArea = [
      [
        {
          name: '',
          xAxis: xAxis_2,
          itemStyle: {
            color: 'rgba(255, 0, 0, 0.1)',
          },
        },
        {
          xAxis: xAxis_3,
        },
      ],
    ]
    majorChartPointList.forEach(item => {
      let time_4 = new Date(item.xAxis).getTime();
      if (time_4 >= time_2 && time_4 <= time_3) {
        res.line_data_3.push(item.yAxis);
      } else {
        res.line_data_3.push(null);
      }
    });
  }



  return res;
};

// 渲染图表函数
function RenderChart() {
  if (!myChart) return;

  const chartData = turnData();
  if (JSON.stringify(chartData) === '{}') {
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
  let seriesData = chartData.line_data_1 || [];

  let option = {
    grid: {
      top: '4%',
      left: '2%',
      right: '6%',
      bottom: '0',
      containLabel: true,
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
        rotate: 30,
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
      // axisLine: {
      //   lineStyle: {
      //     color: 'rgba(255, 255, 255, 0.2)'
      //   }
      // },
      // axisTick: {
      //   lineStyle: {
      //     color: 'rgba(255, 255, 255, 0.2)'
      //   },
      //   alignWithLabel: true
      // },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        // 基础折线（全部数据）
        name: '涨幅',
        type: 'line',
        data: seriesData,
        symbol: 'none',
        lineStyle: {
          color: '#ccc',
          width: 1,
          type: 'dashed', // 虚线表示原始线
        },
        // // 使用 markArea 实现区间背景色
        markArea: {
          data: chartData.markArea || [],
        },
        // // 使用 markPoint 添加特殊点和提示文字
        markPoint: {
          symbolSize: 0,
          label: {
            show: true,
            // position: 'top',
            // formatter: '{b}',
            color: '#fff',
            padding: [2.5, 2.5],
            borderRadius: 2.5,
            fontSize: 5,
          },
          data: chartData.markPoint || [],
        },

        z: 1, // 层级较低
      },
      {
        // 高亮区间段（从Wed到Fri）
        name: '重点区间',
        type: 'line',
        data: chartData.line_data_2 || [],
        symbol: 'none',
        lineStyle: {
          color: '#76b39e', // 绿色
          width: 2, // 加粗
          shadowColor: 'rgba(255, 107, 107, 0.3)',
          shadowBlur: 10,
        },
        z: 2, // 层级较高
        emphasis: {
          lineStyle: {
            width: 3,
          },
        },
      },
      {
        name: '修复区间',
        type: 'line',
        data: chartData.line_data_3 || [],
        symbol: 'none',
        lineStyle: {
          color: '#ff6b6b', // 红色
          width: 2, // 加粗
          shadowColor: 'rgba(118, 179, 158, 0.3)',
          shadowBlur: 10,
        },
        z: 2, // 层级较高
        emphasis: {
          lineStyle: {
            width: 3,
          },
        },
      }
    ],
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
  <div ref="chartRef" class="stock_main_wrapper" style="width: 100%; height: 200px"></div>
</template>

<style scoped lang="scss"></style>
