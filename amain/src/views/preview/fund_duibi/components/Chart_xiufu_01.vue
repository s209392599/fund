<script setup>
// 重仓基金
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => [],
  }
})
console.log('props.data', props.data);
</script>

<template>
  <div class="stock_main_wrapper">
    水电费是否是
  </div>
</template>

<style scoped lang="scss"></style>


<!--
https://echarts.apache.org/examples/zh/editor.html?c=line-smooth

option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      // 基础折线（全部数据）
      name: '基础线',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      symbol: 'none',
      lineStyle: {
        color: '#ccc',
        width: 1,
        type: 'dashed' // 虚线表示原始线
      },
      // 使用 markArea 实现区间背景色
      markArea: {
        data: [
          [
            {
              name: '高亮区间',
              xAxis: 'Wed',
              itemStyle: {
                color: 'rgba(255, 0, 0, 0.1)'
              }
            },
            {
              xAxis: 'Fri'
            }
          ]
        ]
      },
      // 使用 markPoint 添加特殊点和提示文字
      markPoint: {
        symbolSize: 0,
        label: {
          show: true,
          position: 'top',
          formatter: '{b}',
          color: '#fff',
          padding: [4, 4],
          borderRadius: 4,
          fontSize:8
        },
        data: [
          {
            name: '最大回撤-13.93%',
            coord: ['Wed', 932],
            label: {
              backgroundColor: '#76b39e'
            }
          },
          {
            name: '99天修复',
            coord: ['Fri', 1330],
            label: {
              backgroundColor: '#ef7470'
            }
          }
        ]
      },
      z: 1 // 层级较低
    },
    {
      // 高亮区间段（从Wed到Fri）
      name: '重点区间',
      type: 'line',
      data: [
        null, // Mon - 不显示
        null, // Tue - 不显示
        {
          value: 901,
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#76b39e'
          }
        }, // Wed - 开始
        934, // Thu
        {
          value: 1290,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#ef7470'
          }
        }, // Fri - 结束
        null, // Sat - 不显示
        null // Sun - 不显示
      ],
      symbol: 'none',
      lineStyle: {
        color: '#ff6b6b', // 红色
        width: 4, // 加粗
        shadowColor: 'rgba(255, 107, 107, 0.3)',
        shadowBlur: 10
      },
      z: 2, // 层级较高
      emphasis: {
        lineStyle: {
          width: 6
        }
      }
    }
  ]
};

-->
