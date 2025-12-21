<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
// 重仓基金
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {},
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
  if(JSON.stringify(majorChartPointList) === '[]'){
    return {};
  }

  let res = {
    xAxisData: [],// x轴数据
    line_data_1: [],// 第一条折线数据
    markArea: [],// 区间背景色
    markPoint:[],// 特殊点
    line_data_2:[],// 第二条折线数据
    line_data_3:[],// 第三条折线数据
  }

  let maxRetracementEndPoint = obj.maxRetracementEndPoint || {};// 最大回撤结束点
  let maxRetracementStartPoint = obj.maxRetracementStartPoint || {};// 最大回撤开始点
  let restorePoint = obj.restorePoint || {};// 修复点

  majorChartPointList.forEach(item => {
    res.xAxisData.push(item.xAxis);
    res.line_data_1.push(item.yAxis);

  });



  return res;
};

// 渲染图表函数
function RenderChart() {
  if (!myChart) return;

  const chartData = turnData();
  if (JSON.stringify(chartData) === '{}') {
    myChart.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 20,
          color: '#999',
        },
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'line',
          data: [],
        },
      ],
    });
    return;
  }

  let xAxisData = chartData.xAxisData || [];
  let seriesData = chartData.line_data_1 || [];

  let option = {
    grid: {
      top: '4%',
      left: '2%',
      right: '6%',
      bottom: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
      },
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
        name: '基础线',
        type: 'line',
        data: seriesData,
        symbol: 'none',
        lineStyle: {
          color: '#ccc',
          width: 1,
          type: 'dashed', // 虚线表示原始线
        },
        // // 使用 markArea 实现区间背景色
        // markArea: {
        //   data: [
        //     [
        //       {
        //         name: '高亮区间',
        //         xAxis: 'Wed',
        //         itemStyle: {
        //           color: 'rgba(255, 0, 0, 0.1)',
        //         },
        //       },
        //       {
        //         xAxis: 'Fri',
        //       },
        //     ],
        //   ],
        // },
        // // 使用 markPoint 添加特殊点和提示文字
        // markPoint: {
        //   symbolSize: 0,
        //   label: {
        //     show: true,
        //     position: 'top',
        //     formatter: '{b}',
        //     color: '#fff',
        //     padding: [4, 4],
        //     borderRadius: 4,
        //     fontSize: 8,
        //   },
        //   data: [
        //     {
        //       name: '最大回撤-13.93%',
        //       coord: ['Wed', 932],
        //       label: {
        //         backgroundColor: '#76b39e',
        //       },
        //     },
        //     {
        //       name: '99天修复',
        //       coord: ['Fri', 1330],
        //       label: {
        //         backgroundColor: '#ef7470',
        //       },
        //     },
        //   ],
        // },
        z: 1, // 层级较低
      },
      {
        // 高亮区间段（从Wed到Fri）
        name: '重点区间',
        type: 'line',
        data: [],
        // [
        //   null, // Mon - 不显示
        //   null, // Tue - 不显示
        //   {
        //     value: 901,
        //     symbol: 'circle',
        //     symbolSize: 10,
        //     itemStyle: {
        //       color: '#76b39e',
        //     },
        //   }, // Wed - 开始
        //   934, // Thu
        //   {
        //     value: 1290,
        //     symbol: 'circle',
        //     symbolSize: 8,
        //     itemStyle: {
        //       color: '#ef7470',
        //     },
        //   }, // Fri - 结束
        //   null, // Sat - 不显示
        //   null, // Sun - 不显示
        // ],
        symbol: 'none',
        lineStyle: {
          color: '#ff6b6b', // 红色
          width: 4, // 加粗
          shadowColor: 'rgba(255, 107, 107, 0.3)',
          shadowBlur: 10,
        },
        z: 2, // 层级较高
        emphasis: {
          lineStyle: {
            width: 6,
          },
        },
      },
    ],
  };

  myChart.setOption(option);
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
  <div
    ref="chartRef"
    class="stock_main_wrapper"
    style="width: 100%; height: 200px"
  ></div>
</template>

<style scoped lang="scss"></style>
