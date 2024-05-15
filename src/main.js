import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import router from './router';

window.globalProperties = {
  defaultArr: [{ "number": "002084", "name": "新华鑫动力灵活配置混合C", "remarks": "", "notice": "1.7,2.08" }, { "number": "005969", "name": "创金合信工业周期C", "remarks": "", "notice": "1.8,2.2" }, { "number": "004997", "name": "广发高端制造股票A", "remarks": "", "notice": "1.7,1.82" }, { "number": "012301", "name": "易方达核心智造混合", "remarks": "", "notice": "0.7,1" }, { "number": "000536", "name": "前海开源可转债债券", "remarks": "", "notice": "1.2,1.4" }, { "number": "006482", "name": "广发可转债债券A", "remarks": "", "notice": "1.5,1.64" }, { "number": "003547", "name": "鹏华丰禄债券", "remarks": "", "notice": "1.06,1.1" }, { "number": "004010", "name": "华泰柏瑞鼎利灵活配置混合A", "remarks": "", "notice": "1.5,1.7" }],
  fundURL:
    'https://1799001811503384.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/fund',
};

/*
mounted() {
  let _this = this;
  let chartEl = this.$refs.Chart;

  _this.$nextTick(async () => {
    await (_this.chartInstance = _this.echarts.init(chartEl, 'macarons'));
    _this.RenderChart();

    _this.$erd.listenTo(chartEl, () => this.chartInstance.resize());
    _this.$once('hook:beforeDestroy', () => {
      _this.$erdRemove(this.$refs.chartBox);
      _this?.chartInstance?.dispose();
    });
  });
},
 */

import elementResizeDetectorMaker from 'element-resize-detector'; //监听元素大小变化
window.$erd = elementResizeDetectorMaker(); // 元素的大小监听
window.$erdRemove = function (el) {
  // 移除元素的大小监听
  elementResizeDetectorMaker().uninstall(el);
};

import * as echarts from 'echarts';
const app = createApp(App);
app.config.globalProperties.$echarts = echarts;
app.use(router).use(ElementPlus).use(echarts).mount('#app');
