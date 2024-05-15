<template>
  <div class="hello">
    <div>
      <el-input
        class="fund-number-input"
        v-model="fundNumber"
        placeholder="输入基金号"
        clearable
      />&nbsp;&nbsp;
      <el-button type="primary" @click="getInfo(fundNumber)">获取均线</el-button
      >&nbsp;&nbsp;
      <el-button type="primary" @click="fundNumber = ''">置空</el-button>
    </div>
    <div ref="chartEl" id="ChartBox"></div>
    <div></div>
    <button @click="getInfo('005284')">获得均线-- 005284</button>
    <button @click="getInfo('006482')">获得均线-- 006482</button>
    <button @click="getInfo('161725')">获得均线-- 161725</button>
    <button @click="getInfo('320007')">获得均线-- 320007</button>
  </div>
</template>

<script setup>
import { onMounted, inject, ref, reactive } from 'vue';
import axios from 'axios';
const fundNumber = ref('');

let chartData = {
  data: {
    items: [
      {
        date: '2022-09-30',
        nav: '1.5433',
        percentage: '0.12',
        value: '1.5433',
      },
      {
        date: '2022-09-29',
        nav: '1.5415',
        percentage: '-0.06',
        value: '1.5415',
      },
      {
        date: '2022-09-28',
        nav: '1.5424',
        percentage: '-0.23',
        value: '1.5424',
      },
      {
        date: '2022-09-27',
        nav: '1.5460',
        percentage: '0.14',
        value: '1.5460',
      },
      {
        date: '2022-09-26',
        nav: '1.5439',
        percentage: '-0.24',
        value: '1.5439',
      },
      {
        date: '2022-09-23',
        nav: '1.5476',
        percentage: '-0.05',
        value: '1.5476',
      },
      {
        date: '2022-09-22',
        nav: '1.5484',
        percentage: '-0.06',
        value: '1.5484',
      },
      {
        date: '2022-09-21',
        nav: '1.5493',
        percentage: '0.04',
        value: '1.5493',
      },
      {
        date: '2022-09-20',
        nav: '1.5487',
        percentage: '-0.07',
        value: '1.5487',
      },
      {
        date: '2022-09-19',
        nav: '1.5498',
        percentage: '-0.06',
        value: '1.5498',
      },
      {
        date: '2022-09-16',
        nav: '1.5507',
        percentage: '-0.33',
        value: '1.5507',
      },
      {
        date: '2022-09-15',
        nav: '1.5559',
        percentage: '0.12',
        value: '1.5559',
      },
      {
        date: '2022-09-14',
        nav: '1.5540',
        percentage: '-0.17',
        value: '1.5540',
      },
      {
        date: '2022-09-13',
        nav: '1.5567',
        percentage: '-0.12',
        value: '1.5567',
      },
      {
        date: '2022-09-09',
        nav: '1.5586',
        percentage: '0.41',
        value: '1.5586',
      },
      {
        date: '2022-09-08',
        nav: '1.5523',
        percentage: '-0.02',
        value: '1.5523',
      },
      {
        date: '2022-09-07',
        nav: '1.5526',
        percentage: '0.01',
        value: '1.5526',
      },
      {
        date: '2022-09-06',
        nav: '1.5525',
        percentage: '0.15',
        value: '1.5525',
      },
      {
        date: '2022-09-05',
        nav: '1.5502',
        percentage: '0.16',
        value: '1.5502',
      },
      {
        date: '2022-09-02',
        nav: '1.5477',
        percentage: '-0.1',
        value: '1.5477',
      },
      {
        date: '2022-09-01',
        nav: '1.5492',
        percentage: '0.05',
        value: '1.5492',
      },
      {
        date: '2022-08-31',
        nav: '1.5485',
        percentage: '0.05',
        value: '1.5485',
      },
      {
        date: '2022-08-30',
        nav: '1.5478',
        percentage: '0.08',
        value: '1.5478',
      },
      {
        date: '2022-08-29',
        nav: '1.5465',
        percentage: '-0.29',
        value: '1.5465',
      },
      {
        date: '2022-08-26',
        nav: '1.5510',
        percentage: '0.06',
        value: '1.5510',
      },
      {
        date: '2022-08-25',
        nav: '1.5500',
        percentage: '0.22',
        value: '1.5500',
      },
      {
        date: '2022-08-24',
        nav: '1.5466',
        percentage: '-0.44',
        value: '1.5466',
      },
      {
        date: '2022-08-23',
        nav: '1.5535',
        percentage: '0.01',
        value: '1.5535',
      },
      {
        date: '2022-08-22',
        nav: '1.5533',
        percentage: '0.15',
        value: '1.5533',
      },
      {
        date: '2022-08-19',
        nav: '1.5509',
        percentage: '-0.23',
        value: '1.5509',
      },
      {
        date: '2022-08-18',
        nav: '1.5545',
        percentage: '-0.41',
        value: '1.5545',
      },
      {
        date: '2022-08-17',
        nav: '1.5609',
        percentage: '0.39',
        value: '1.5609',
      },
      {
        date: '2022-08-16',
        nav: '1.5549',
        percentage: '0.04',
        value: '1.5549',
      },
      {
        date: '2022-08-15',
        nav: '1.5543',
        percentage: '0.09',
        value: '1.5543',
      },
      {
        date: '2022-08-12',
        nav: '1.5529',
        percentage: '0.11',
        value: '1.5529',
      },
      {
        date: '2022-08-11',
        nav: '1.5512',
        percentage: '0.34',
        value: '1.5512',
      },
      {
        date: '2022-08-10',
        nav: '1.5460',
        percentage: '-0.16',
        value: '1.5460',
      },
      {
        date: '2022-08-09',
        nav: '1.5484',
        percentage: '0.03',
        value: '1.5484',
      },
      {
        date: '2022-08-08',
        nav: '1.5480',
        percentage: '0.1',
        value: '1.5480',
      },
      {
        date: '2022-08-05',
        nav: '1.5464',
        percentage: '0.21',
        value: '1.5464',
      },
      {
        date: '2022-08-04',
        nav: '1.5431',
        percentage: '0.09',
        value: '1.5431',
      },
      {
        date: '2022-08-03',
        nav: '1.5417',
        percentage: '-0.12',
        value: '1.5417',
      },
      {
        date: '2022-08-02',
        nav: '1.5436',
        percentage: '-0.39',
        value: '1.5436',
      },
      {
        date: '2022-08-01',
        nav: '1.5497',
        percentage: '-0.16',
        value: '1.5497',
      },
      {
        date: '2022-07-29',
        nav: '1.5522',
        percentage: '-0.15',
        value: '1.5522',
      },
      {
        date: '2022-07-28',
        nav: '1.5546',
        percentage: '0.12',
        value: '1.5546',
      },
      {
        date: '2022-07-27',
        nav: '1.5527',
        percentage: '0.16',
        value: '1.5527',
      },
      {
        date: '2022-07-26',
        nav: '1.5502',
        percentage: '0.7',
        value: '1.5502',
      },
      {
        date: '2022-07-25',
        nav: '1.5394',
        percentage: '0.01',
        value: '1.5394',
      },
      {
        date: '2022-07-22',
        nav: '1.5393',
        percentage: '-0.1',
        value: '1.5393',
      },
    ],
    current_page: 1,
    size: 50,
    total_items: 1162,
    total_pages: 24,
  },
  result_code: 0,
};

onMounted(() => {
  console.log(232, chartData.data);
  change();
});

let echarts = inject('echarts'); // 主要
// 折线的公共配置
let publicLineOption = {
  type: 'line',
  smooth: true,
  symbol: 'circle',
  symbolSize: 10,
};
// 基本柱形图
const change = (res = {}) => {
  const chartBox = echarts.init(document.getElementById('ChartBox')); // 主要
  let pageData = res.items || [];
  pageData = pageData.reverse();

  // 组装数据
  let { totalArr, upArr, downArr } = getBarDataFn(pageData);
  let xData = pageData.map((item) => item.date);
  let filterArr = pageData.map((item) => parseFloat(item.value));
  let yArr05 = movingAverageFn(filterArr, 5);
  let yArr10 = movingAverageFn(filterArr, 10);
  let yArr20 = movingAverageFn(filterArr, 20);
  let yArr30 = movingAverageFn(filterArr, 30);
  let yArr60 = movingAverageFn(filterArr, 60);
  let barArr = pageData.map((item) => {
    let percentage = item.percentage || '';
    return {
      value: item.value,
      itemStyle: {
        color: percentage.startsWith('-') ? 'green' : 'rgb(255 0 0 / 20%)',
      },
    };
  });

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      // formatter: function (params) {
      //   let tar;
      //   if (params[1].value !== '-') {
      //     tar = params[1];
      //   } else {
      //     tar = params[0];
      //   }
      //   return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
      // }
    },
    dataZoom: [
      {
        start: 90,
      },
    ],
    legend: {
      data: ['涨', '跌', '5日', '10日', '20日', '30日', '60日'],
      selected: {
        '20日': false,
        '60日': false,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '50px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: barArr,
        type: 'bar',
      },
      {
        ...publicLineOption,
        name: '5日',
        color: 'red',
        data: yArr05,
      },
      {
        ...publicLineOption,
        name: '10日',
        color: 'purple',
        data: yArr10,
      },
      {
        ...publicLineOption,
        name: '20日',
        color: '#0461CF',
        data: yArr20,
      },
      {
        ...publicLineOption,
        name: '30日',
        color: '#000',
        data: yArr30,
      },
      {
        ...publicLineOption,
        name: '60日',
        color: '#F3624B',
        selected: false,
        data: yArr60,
      },
      // {
      //   name: 'Placeholder',
      //   type: 'bar',
      //   barMaxWidth: 10,
      //   stack: 'Total',
      //   itemStyle: {
      //     borderColor: 'transparent',
      //     color: 'transparent',
      //   },
      //   emphasis: {
      //     itemStyle: {
      //       borderColor: 'transparent',
      //       color: 'transparent',
      //     },
      //   },
      //   data: totalArr,
      // },
      // {
      //   name: '跌',
      //   type: 'bar',
      //   stack: 'Total',
      //   label: false,
      //   color: 'green',
      //   itemStyle: {
      //     barBorderRadius: [20, 20, 20, 20],
      //   },
      //   data: downArr,
      // },
      // {
      //   name: '涨',
      //   type: 'bar',
      //   stack: 'Total',
      //   label: false,
      //   color: 'red',
      //   itemStyle: {
      //     barBorderRadius: [20, 20, 20, 20],
      //   },
      //   data: upArr,
      // },
    ],
  };
  chartBox.setOption(option);
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    chartBox.resize();
  });
};

// 获取数据
const getInfo = (code) => {
  axios
    .get(
      `${globalProperties.fundURL}/historicalIncome/?code=${code}&pagesize=999999`,
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      }
    )
    .then((res) => {
      change(res.data || {});
    })
    .catch((err) => {
      console.log('err', err);
      change({});
    });
};

const getBarDataFn = (arr = []) => {
  let totalArr = [],
    upArr = [],
    downArr = [];
  if (arr.length < 2) {
    return { totalArr, upArr, downArr };
  }
  totalArr.push(Number(arr[0]['value']));
  upArr.push(Number(arr[0]['value']));
  downArr.push('-');

  for (let i = 1; i < arr.length; i++) {
    totalArr.push(Number(arr[i]['value']));
    let aa = Number(arr[i]['value']) - Number(arr[i - 1]['value']);
    let bb = aa.toFixed(5);
    let cc = Number(bb);
    let endNum = Math.abs(cc);

    if (arr[i]['percentage'].startsWith('-')) {
      upArr.push('-'); // 下跌
      downArr.push(endNum);
    } else {
      upArr.push(endNum); // 上涨
      downArr.push('-');
    }
  }
  return { totalArr, upArr, downArr };
};

// 均线函数
const movingAverageFn = (arr = [], digits = 5) => {
  let startArr = new Array(digits).fill(0);
  if (digits > arr.length) {
    return startArr;
  }
  for (let i = digits; i < arr.length; i++) {
    let sum = 0;
    for (let k = 0; k < digits; k++) {
      sum += arr[i - k];
    }
    startArr.push(Number((sum / digits).toFixed(6)));
  }
  return startArr;
};
</script>

<style scoped>
.hello {
  padding: 20px 4px 10px 4px;
}
#ChartBox {
  width: 100%;
  height: 400px;
}
.fund-number-input {
  max-width: 100px;
}
</style>
