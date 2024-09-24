import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import router from './router';

const guokun = [
  {
    number: '007677',
    name: '蜂巢添汇(7天)',
    remarks: '10.60',
    notice: '',
    skuId: '1007677',
    status: '1',
  },
  {
    number: '400030',
    name: '东方添益(随时)',
    remarks: '6.62;入8;730',
    notice: '',
    skuId: '106545',
    status: '2',
  },
  {
    number: '006549',
    name: '国金惠盈纯债A',
    remarks: '近一年7.62',
    notice: '',
  },
  {
    number: '485119',
    name: '工银信用(稳)',
    remarks: '5.96;入8;730',
    notice: '',
    skuId: '107337',
    status: '2',
  },
  {
    number: '006980',
    name: '国寿安保(限500)',
    remarks: '6.98;入8;30',
    notice: '',
    skuId: '114237',
    status: '2',
  },
  {
    number: '003547',
    name: '鹏华丰禄(限100)',
    remarks: '5.46;入8;365',
    notice: '',
    skuId: '110067',
    status: '2',
  },
  { number: '006760', name: '国金惠盈C(30)', remarks: '7.77', notice: '' },
  { number: '009604', name: '国金惠盈(7-1000)', remarks: '', notice: '' },
  {
    number: '007214',
    name: '国泰惠丰(30天)',
    remarks: '',
    notice: '',
    skuId: '1007214',
    status: '4',
  },
  { number: '000116', name: '嘉实丰益(1)', remarks: '', notice: '' },
  {
    number: '519762',
    name: '交银裕通',
    remarks: '',
    notice: '',
    skuId: '108617',
    status: '4',
  },
  { number: '007540', name: '华泰保兴安A', remarks: '8.95', notice: '' },
  { number: '017593', name: '汇添富添C', remarks: '8.65', notice: '' },
  { number: '008799', name: '国金惠安利C', remarks: '7.65', notice: '' },
  { number: '010353', name: '南方崇元A', remarks: '7.19', notice: '' },
];

window.globalProperties = {
  guokun: guokun,
  defaultArr: [
    {
      number: '002084',
      name: '新华鑫动力灵活配置混合C',
      remarks: '',
      notice: '1.7,2.08',
    },
    {
      number: '005969',
      name: '创金合信工业周期C',
      remarks: '',
      notice: '1.8,2.2',
    },
    {
      number: '004997',
      name: '广发高端制造股票A',
      remarks: '',
      notice: '1.7,1.82',
    },
    {
      number: '012301',
      name: '易方达核心智造混合',
      remarks: '',
      notice: '0.7,1',
    },
    {
      number: '000536',
      name: '前海开源可转债债券',
      remarks: '',
      notice: '1.2,1.4',
    },
    {
      number: '006482',
      name: '广发可转债债券A',
      remarks: '',
      notice: '1.5,1.64',
    },
    { number: '003547', name: '鹏华丰禄债券', remarks: '', notice: '1.06,1.1' },
    {
      number: '004010',
      name: '华泰柏瑞鼎利灵活配置混合A',
      remarks: '',
      notice: '1.5,1.7',
    },
  ],
  fundURL:
    'https://775477fdb4134cd5924c62381cf95ed0.apig.cn-east-3.huaweicloudapis.com/fund', // 华为云
  // 'https://1799001811503384.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/fund',// 阿里云
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
