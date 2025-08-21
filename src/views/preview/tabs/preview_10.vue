<script setup>
console.log('src/views/preview/tabs/preview_10.vue');

const echartsInstance = inject('echarts');

const chart = ref(null);

const info = reactive({
  active: 5,
  list: [
    {
      "code": "018561",
      "name": "中信保诚多策略混合(LOF)C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 100,
      "type": "量化",
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    },
    {
      "code": "020726",
      "name": "建信灵活配置混合C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 100,
      "type": "量化",
      data: [80, 93, 90, 93, 82, 30, 20]
    },
  ]
});

const getShowName = (item) => {
  let str = `${item.code}-${item.name}`;
  let title = str.length > 15 ? str.substring(0, 15) + '...' : str;
  return title;
}

const num_bar = 50;// 显示柱子的数量
const zoomStart = Math.max(0, 1 - (Math.min(data.length, num_bar)) / data.length) * 100;
console.log('zoomStart', zoomStart);

// 定义图表的配置项
const option = {
  legend: {
    type: 'scroll',
    orient: 'vertical',

    icon: 'circle',
    right: 10,
    y: 'center',
    // itemWidth: 200, // 设置图例项的宽度
    // itemHeight: 14, // 可选，设置图例项的高度
    data: info.list.map(item => {
      return getShowName(item);
    })
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: zoomStart,
      end: 100,
      zoomLock: true,  // 禁止缩放
      filterMode: 'filter'  // 可选：平移时动态过滤数据
    },
    {
      show: true,
      xAxisIndex: [0, 1],
      type: 'slider',
      top: '85%',
      start: zoomStart,
      end: 100,
      zoomLock: true,  // 禁止缩放
      brushSelect: false  // 禁用框选（避免误触缩放）
    }
  ],
  grid: {
    top: 20,
    left: 10,
    right: 210,
    bottom: 20,
    containLabel: true,
  },

  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: info.list.map(item => {
    return {
      name: getShowName(item),
      data: item.data,
      type: 'line',
      smooth: true
    }
  })
};

const viewDayFn = (num, active) => {
  info.active = active;
  console.log('num', num, active);
}

// 在组件挂载时初始化图表
onMounted(() => {
  if (chart.value && echartsInstance) {
    const myChart = echartsInstance.init(chart.value);
    myChart.setOption(option);
  }
});

// 在组件卸载时销毁图表
onUnmounted(() => {
  if (chart.value && echartsInstance) {
    const myChart = echartsInstance.getInstanceByDom(chart.value);
    if (myChart) {
      myChart.dispose();
    }
  }
});

</script>

<template>
  <div class="page_wrapper">
    <div class="flex pb-5">
      <el-button type="primary" :class="{ 'active': info.active === 1 }" @click="viewDayFn(5, 1)">近一周</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 2 }" @click="viewDayFn(10, 2)">近两周</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 3 }" @click="viewDayFn(20, 3)">近一个月</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 4 }" @click="viewDayFn(20, 4)">近两个月</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 5 }" @click="viewDayFn(20, 5)">近三个月</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 6 }" @click="viewDayFn(120, 6)">近半年</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 7 }" @click="viewDayFn(244, 7)">近一年</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 8 }" @click="viewDayFn(488, 8)">近两年</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 9 }" @click="viewDayFn(732, 9)">近三年</el-button>
    </div>

    <div class="chart_box">
      <div ref="chart" class="chart_el" style="width: 100%;height: 100%;"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  padding: 10px;
}

.active {
  background-color: #d658f8;
  border-color: #d658f8;
}

.chart_box {
  width: 100%;
  height: 400px;
}
</style>
