<template>
  <div class="about" ref="boxue" id="boxue">
    <template v-for="(item, index) in fundArr" :key="index">
      <div :ref="'chartEl_' + index" :id="'ChartBox_' + index" style="  float: left;width: 352px; height: 277px;"></div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'Edit',
  data() {
    return {
      fundArr: [],// 基金的数组
      fundURL: globalProperties.fundURL,
      tableData: [],
    };
  },
  created() {
    this.fundArr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;
    // this.fundArr.length = 6;
  },
  mounted() {
    var _this = this;
    this.fundArr.forEach((item, index) => {
      _this.getShouyi({//业绩表现
        name: item.name,
        number: item.number,
        index: index,
      });
    });
  },
  methods: {
    getShouyi(params) {
      setTimeout(() => {
        axios.get(`${this.fundURL}/obtainNetWorth/?code=${params.number}&size=780`)
          .then(res => {
            let data = res.data || [];
            let totalNetValue = data.reverse().map(item => item.totalNetValue);
            const TitleName = params.number + '---' + params.name;// 标题名称
            this.Render_Chart(TitleName, totalNetValue, params.index);
          }).catch(err => {
            console.log("err", err);
          })
      }, 10 * params.index)
    },
    Render_Chart(text = '', data = [], index = 0) {
      const chartBox = echarts.init(document.getElementById('ChartBox_' + index));
      const max = Math.max(...data);
      const min = Math.min(...data);
      chartBox.setOption({
        title: {
          text: text,
          left: '20',
          top: '3',
          textStyle: {
            fontSize: 14,
            color: '#000220'
          }
        },
        grid: {
          left: '5',
          right: '5',
          bottom: '5',
          top: '25',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'category',
          data: new Array(data.length)
        },
        yAxis: {
          // show: false,
          type: 'value',
          min: min,
          max: max,
        },
        series: [
          {
            data: data,
            type: 'line',
            smooth: true,
            symbolSize: 0
          }
        ]
      });
      // // 根据页面大小自动响应图表大小
      // window.addEventListener('resize', function () {
      //   chartBox.resize();
      // });
    },
  },
};
</script>

<style></style>
