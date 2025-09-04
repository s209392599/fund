<script setup>
import { reactive } from 'vue';

console.log('src/views/preview/tabs/preview_10.vue');

const echartsInstance = inject('echarts');

const chart = ref(null);
var myChart = null;

const page = {
  list: [], // 基金数据
};
const info = reactive({
  active: 2,
  dayArr: [5, 10, 20, 40, 60, 120, 244], // 488, 730
});

const getShowName = (item) => {
  let str = `${item.code}-${item.name}`;
  let title = str.length > 15 ? str.substring(0, 15) + '...' : str;
  return title;
};

/*
fundcode： 基金代码
list_index： 基金数组的下标
*/
const getHisData = (fundcode, list_index) => {
  // 请求历史数据
  server_fund_history_data({
    fundcode: fundcode,
    pageSize: info.dayArr[info.dayArr.length - 1],
  }).then((res) => {
    console.log(`${page.list[list_index].name} =>`, res);
    if (res.code === 200) {
      page.list[list_index].his_data = res.data || [];
      render_chart_fn(); // 渲染图形
    } else {
      ElMessage.error(`${fundcode}未正确获取数据`);
    }
  });
};

// 渲染图形
const render_chart_fn = () => {
  const len_data = info.dayArr[info.active];
  const num_bar = 50; // 显示柱子的数量
  // const zoomStart = Math.max(0, 1 - Math.min(len_data, num_bar) / len_data) * 100;

  const x_data = new Array(len_data + 1).fill(1).map((v, i) => i);

  // 定义图表的配置项
  const option = {
    animation: true, // 保持全局开启
    animationDuration: 100,
    legend: {
      type: 'scroll',
      orient: 'vertical',

      icon: 'circle',
      right: 10,
      y: 'center',
      // itemWidth: 200, // 设置图例项的宽度
      // itemHeight: 14, // 可选，设置图例项的高度
      data: page.list.map((item) => {
        return getShowName(item);
      }),
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      alwaysShowContent: true,// 始终显示所有系列
      formatter: function (params) {
        // let str = `横向坐标：${params[0].axisValue}<br/>`;
        // params.forEach((item,index) => {
        //   str += `${item.marker} ${page.list[index].name}：${item.data}<br/>`;
        // });
        // return str;
        let str = `横向坐标：${params[0].axisValue}<br/>`;

        // 创建可排序的数据数组
        const sortedData = params
          .map((item, index) => ({
            marker: item.marker,
            name: page.list[index].name,
            data: item.data,
            originalIndex: index // 保留原始索引，如果需要的话
          }))
          // 从大到小排序
          .sort((a, b) => b.data - a.data);

        // 循环排序后的数据
        sortedData.forEach(item => {
          str += `${item.marker} ${item.name}：${item.data}<br/>`;
        });
        return str;
      },
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        // start: zoomStart,
        // end: 100,
        // zoomLock: true,  // 禁止缩放
        // filterMode: 'filter'  // 可选：平移时动态过滤数据
      },
      {
        show: false,
        xAxisIndex: [0, 1],
        type: 'slider',
        bottom: 0,
        // start: zoomStart,
        // end: 100,
        // zoomLock: true,  // 禁止缩放
        // brushSelect: false  // 禁用框选（避免误触缩放）
      },
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
        show: false, // 隐藏刻度线
      },
      boundaryGap: false, // 让折线从y轴0值开始
      // axisLine: {
      //   onZero: true // 坐标轴轴线在0刻度上
      // },
      data: x_data,
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: page.list.map((item) => {
      let data = [0]; // 横向的数据
      let num_base = 0;

      while (item.his_data.length < len_data) {
        item.his_data.unshift({
          date: '',
          netValue: '',
          dailyProfit: '0',
          totalNetValue: '',
        });
      }

      let num_start = item.his_data.length - len_data;
      for (let i = num_start; i < item.his_data.length; i++) {
        num_base += parseFloat(item.his_data[i].dailyProfit || 0) * 100;
        data.push(parseFloat(num_base.toFixed(0)));
      }

      return {
        name: getShowName(item),
        data: data,
        type: 'line',
        // symbol: 'none',
        symbolSize: 2,
        // smooth: true
      };
    }),
  };

  myChart.setOption(option);
};

const viewDayFn = (num, active) => {
  info.active = active;
  render_chart_fn(); // 渲染图形
};

// 获取用户数据
const getUserInfo = () => {
  server_fund_public_fund_query().then((res) => {
    console.log('res11', res);
    if (res.code === 200) {
      page.list = (res.data || []).map((v) => {
        v.his_data = []; // 添加一个历史数据的字段
        return v;
      });
      for (let i = 0; i < page.list.length; i++) {
        setTimeout(() => {
          getHisData(page.list[i].code, i); //请求历史数据
        }, i * 100);
      }
    } else {
      ElMessage.error(`获取标准基金列表失败`);
    }
  });
};

// 在组件挂载时初始化图表
onMounted(() => {
  if (chart.value && echartsInstance) {
    myChart = echartsInstance.init(chart.value);
    render_chart_fn(); // 渲染图形
  }
  getUserInfo(); // 获取用户数据
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
      <el-button
        type="primary"
        :class="{ active: info.active === 0 }"
        @click="viewDayFn(5, 0)"
        >近一周</el-button
      >
      <el-button
        type="primary"
        :class="{ active: info.active === 1 }"
        @click="viewDayFn(10, 1)"
        >近两周</el-button
      >
      <el-button
        type="primary"
        :class="{ active: info.active === 2 }"
        @click="viewDayFn(20, 2)"
        >近一个月</el-button
      >
      <el-button
        type="primary"
        :class="{ active: info.active === 3 }"
        @click="viewDayFn(40, 3)"
        >近两个月</el-button
      >
      <el-button
        type="primary"
        :class="{ active: info.active === 4 }"
        @click="viewDayFn(60, 4)"
        >近三个月</el-button
      >
      <el-button
        type="primary"
        :class="{ active: info.active === 5 }"
        @click="viewDayFn(120, 5)"
        >近半年</el-button
      >
      <el-button
        type="primary"
        :class="{ active: info.active === 6 }"
        @click="viewDayFn(244, 6)"
        >近一年</el-button
      >
    </div>

    <div class="chart_box">
      <div ref="chart" class="chart_el" style="width: 100%; height: 100%"></div>
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
  height: 666px;
}
</style>
