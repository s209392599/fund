<script setup>
console.log('src/views/preview/tabs/preview_10.vue');

const echartsInstance = inject('echarts');

const chart = ref(null);
var myChart = null;

const info = reactive({
  active: 2,
  dayArr: [1, 5, 10, 20, 40, 60, 120, 244],// 488, 732
  list: [

  ]
});
// 额外的对象来处理网页数据
// const baseObj = {
//   find: [
//     {
//       "code": "018561",
//       "name": "中信保诚多策略混合(LOF)C",
//       his_data: []
//     }
//   ]
// };

const getShowName = (item) => {
  let str = `${item.code}-${item.name}`;
  let title = str.length > 15 ? str.substring(0, 15) + '...' : str;
  return title;
}

const getHisData = (fundcode) => {
  // 请求历史数据
  server_fund_history_data({
    fundcode: fundcode,
    pageSize: info.dayArr[info.dayArr.length - 1]
  }).then(res => {
    console.log('res', res);
    for (let i = 0; i < info.list.length; i++) {
      if (info.list[i].code === fundcode) {
        info.list[i].his_data = res.data || [];
        render_chart_fn();// 渲染图形
        break;
      }
    }
  })
}

// 渲染图形
const render_chart_fn = () => {
  const len_data = info.dayArr[info.active]
  const num_bar = 50;// 显示柱子的数量
  const zoomStart = Math.max(0, 1 - (Math.min(len_data, num_bar)) / len_data) * 100;
  console.log('zoomStart', zoomStart);

  const x_data = new Array(len_data + 1).fill(1).map((v, i) => i);

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
        bottom: 0,
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
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false // 隐藏刻度线
      },
      boundaryGap: false, // 让折线从y轴0值开始
      // axisLine: {
      //   onZero: true // 坐标轴轴线在0刻度上
      // },
      data: x_data
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: info.list.map(item => {
      let data = [0];// 横向的数据
      let num_base = 0;

      while (item.his_data.length < len_data) {
        item.his_data.unshift({
          "date": "",
          "netValue": "",
          "dailyProfit": "0",
          "totalNetValue": ""
        })
      }

      let num_start = item.his_data.length - len_data;
      for (let i = num_start; i < item.his_data.length; i++) {
        num_base += Number(item.his_data[i].dailyProfit) * 100;
        data.push(num_base);
      }

      return {
        name: getShowName(item),
        data: data,
        type: 'line',
        // symbol: 'none',
        symbolSize: 2,
        // smooth: true
      }
    })
  };

  myChart.setOption(option);
}

const viewDayFn = (num, active) => {
  info.active = active;
  console.log('num', num, active);
}

// 获取用户数据
const getUserInfo = () => {
  setTimeout(() => {
    info.list = [
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
        his_data: [],
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
        his_data: [],
      }
    ];
    for (let i = 0; i < info.list.length; i++) {
      setTimeout(() => {
        getHisData(info.list[i].code);//请求历史数据
      }, i * 100)
    }
  }, 300)
}

// 在组件挂载时初始化图表
onMounted(() => {
  if (chart.value && echartsInstance) {
    myChart = echartsInstance.init(chart.value);
    render_chart_fn();// 渲染图形
  }
  getUserInfo();// 获取用户数据
});

// 在组件卸载时销毁图表
onUnmounted(() => {
  if (chart.value && echartsInstance) {
    // const myChart = echartsInstance.getInstanceByDom(chart.value);
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
      <el-button type="primary" :class="{ 'active': info.active === 4 }" @click="viewDayFn(40, 4)">近两个月</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 5 }" @click="viewDayFn(60, 5)">近三个月</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 6 }" @click="viewDayFn(120, 6)">近半年</el-button>
      <el-button type="primary" :class="{ 'active': info.active === 7 }" @click="viewDayFn(244, 7)">近一年</el-button>
      <!-- <el-button type="primary" :class="{ 'active': info.active === 8 }" @click="viewDayFn(488, 8)">近两年</el-button> -->
      <!-- <el-button type="primary" :class="{ 'active': info.active === 9 }" @click="viewDayFn(732, 9)">近三年</el-button> -->
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
