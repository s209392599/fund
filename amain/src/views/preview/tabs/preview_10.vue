<script setup>
console.log('amain/src/views/preview/tabs/preview_10.vue');
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
  let str = `${item.fund_code}-${item.fund_name}`;
  let title = str.length > 15 ? str.substring(0, 15) + '...' : str;
  return title;
};

/*
fund_code 基金代码
list_index： 基金数组的下标
*/
const getHisData = (fund_code, list_index) => {
  // 请求历史数据
  server_fund_history_data({
    fund_code: fund_code,
    pageSize: info.dayArr[info.dayArr.length - 1],
  }).then((res) => {
    if (res.code === 200) {
      page.list[list_index].his_data = res.data || [];
      render_chart_fn(); // 渲染图形
    } else {
      ElMessage.error(`${fund_code}未正确获取数据`);
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
      alwaysShowContent: true, // 始终显示所有系列
      formatter: function (params) {
        // 根据params[0].axisValue计算对应的日期
        const dataIndex = params[0].dataIndex;
        const len_data = info.dayArr[info.active];
        const num_start = page.list[0]?.his_data.length - len_data;

        let dateStr = `横向坐标：${params[0].axisValue}`;
        if (num_start !== undefined && page.list[0]?.his_data[num_start + dataIndex]) {
          dateStr = `日期：${page.list[0].his_data[num_start + dataIndex].date}`;
        }

        let str = `${dateStr}<br/>`;

        // 过滤掉没有被选中的系列数据
        const validParams = params.filter(param => param.seriesIndex !== undefined && param.seriesIndex !== -1);

        // 创建可排序的数据数组，只包含有效的参数
        const sortedData = validParams
          .map((item) => ({
            marker: item.marker,
            name: page.list[item.seriesIndex].fund_name,
            data: item.data,
            originalIndex: item.seriesIndex, // 使用seriesIndex作为原始索引
          }))
          // 从大到小排序
          .sort((a, b) => b.data - a.data);

        // 循环排序后的数据
        sortedData.forEach((item) => {
          str += `${item.marker} ${page.list[item.originalIndex].fund_code}-${item.name
            }：${item.data}<br/>`;
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
        symbolSize: 2,
        symbol: 'none',
        // smooth: true,
        lineStyle: {
          width: 0.7,
        },
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
  const res = {
    data: [
      {
        "fund_code": "001147",
        "fund_name": "中欧瑾源灵活配置混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "002233",
        "fund_name": "工银丰收回报灵活配置混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "005110",
        "fund_name": "汇安多策略混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "005438",
        "fund_name": "易方达易百智能量化策略C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "006104",
        "fund_name": "华泰柏瑞量化智慧混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "006315",
        "fund_name": "国联策略优选混合C",
        "fund_type": "混合型-偏股"
      },
      {
        "fund_code": "006532",
        "fund_name": "华泰柏瑞量化阿尔法C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "011426",
        "fund_name": "广发优势成长股票C",
        "fund_type": "股票型"
      },
      {
        "fund_code": "011741",
        "fund_name": "博时成长精选混合C",
        "fund_type": "混合型-偏股"
      },
      {
        "fund_code": "013142",
        "fund_name": "华商乐享互联灵活配置混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "014063",
        "fund_name": "景顺长城专精特新量化优选股票C",
        "fund_type": "股票型"
      },
      {
        "fund_code": "014521",
        "fund_name": "诺安利鑫灵活配置混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "014806",
        "fund_name": "国金量化精选混合C",
        "fund_type": "混合型-偏股"
      },
      {
        "fund_code": "016858",
        "fund_name": "国金量化多因子股票C",
        "fund_type": "股票型"
      },
      {
        "fund_code": "018470",
        "fund_name": "国富策略回报混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "018561",
        "fund_name": "中信保诚多策略混合(LOF)C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "019506",
        "fund_name": "国泰海通中证1000优选股票发起C",
        "fund_type": "股票型"
      },
      {
        "fund_code": "020152",
        "fund_name": "中信保诚景气优选混合C",
        "fund_type": "混合型-偏股"
      },
      {
        "fund_code": "020180",
        "fund_name": "金信深圳成长混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "020268",
        "fund_name": "宏利睿智成长混合C",
        "fund_type": "混合型-偏股"
      },
      {
        "fund_code": "020726",
        "fund_name": "建信灵活配置混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "020749",
        "fund_name": "国联智选先锋股票C",
        "fund_type": "股票型"
      },
      {
        "fund_code": "021265",
        "fund_name": "兴业聚利灵活配置混合C",
        "fund_type": "混合型-灵活"
      },
      {
        "fund_code": "021865",
        "fund_name": "中欧中证800研究智选混合发起C",
        "fund_type": "混合型-偏股"
      }
    ]
  }

  page.list = (res.data || []).map((v) => {
    v.his_data = []; // 添加一个历史数据的字段
    return v;
  });
  for (let i = 0; i < page.list.length; i++) {
    setTimeout(() => {
      getHisData(page.list[i].fund_code, i); //请求历史数据
    }, i * 100);
  }

  // server_fund_table_query_by_user({
  //   fund_user_id: localStorage.getItem('user_id'),
  // }).then((res) => {
  //   if (res.code === 200) {
  //     page.list = (res.data || []).map((v) => {
  //       v.his_data = []; // 添加一个历史数据的字段
  //       return v;
  //     });
  //     for (let i = 0; i < page.list.length; i++) {
  //       setTimeout(() => {
  //         getHisData(page.list[i].fund_code, i); //请求历史数据
  //       }, i * 100);
  //     }
  //   } else {
  //     ElMessage.error('获取列表失败，请重试！');
  //   }
  // });
};

// 反选
const turnSelect = () => {
  const currentOption = myChart.getOption();
  const currentSelected = currentOption.legend[0].selected || {};
  const newSelectedState = {};

  // 遍历所有图例，对每个图例的选中状态取反
  currentOption.legend[0].data.forEach((name) => {
    // 如果当前图例是选中状态，则反选后为未选中；如果未选中，则反选后为选中
    // 如果 selected 中不存在该图例的状态，默认视为选中（因为图例默认就是选中的）
    newSelectedState[name] = !(currentSelected[name] !== false);
  });

  myChart.setOption({
    legend: [
      {
        selected: newSelectedState,
      },
    ],
  });
};

// 全选
const CheckAll = () => {
  const currentOption = myChart.getOption();
  const newSelectedState = {};
  currentOption.legend[0].data.forEach((name) => {
    newSelectedState[name] = true;
  });
  myChart.setOption({
    legend: [
      {
        selected: newSelectedState,
      },
    ],
  });
};
// 全不选
const UnSelectAll = () => {
  // 获取当前的 option
  const currentOption = myChart.getOption();
  // 构建一个所有图例名称对应 false 的对象
  const newSelectedState = {};
  currentOption.legend[0].data.forEach((name) => {
    newSelectedState[name] = false;
  });
  // 使用 setOption 更新 selected 状态
  myChart.setOption({
    legend: [
      {
        selected: newSelectedState,
      },
    ],
  });
};

const FreshData = () => {
  getUserInfo(); // 获取用户数据
}

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
      <el-button type="primary" :class="{ active: info.active === 0 }" @click="viewDayFn(5, 0)">近一周</el-button>
      <el-button type="primary" :class="{ active: info.active === 1 }" @click="viewDayFn(10, 1)">近两周</el-button>
      <el-button type="primary" :class="{ active: info.active === 2 }" @click="viewDayFn(20, 2)">近一个月</el-button>
      <el-button type="primary" :class="{ active: info.active === 3 }" @click="viewDayFn(40, 3)">近两个月</el-button>
      <el-button type="primary" :class="{ active: info.active === 4 }" @click="viewDayFn(60, 4)">近三个月</el-button>
      <el-button type="primary" :class="{ active: info.active === 5 }" @click="viewDayFn(120, 5)">近半年</el-button>
      <el-button type="primary" :class="{ active: info.active === 6 }" @click="viewDayFn(244, 6)">近一年</el-button>

      <el-button type="primary" @click="turnSelect()">反选</el-button>
      <el-button type="primary" @click="CheckAll()">全选</el-button>
      <el-button type="primary" @click="UnSelectAll()">全不选</el-button>
      <el-button type="primary" @click="FreshData()">刷新</el-button>
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
