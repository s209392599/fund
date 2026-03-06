import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // 引入路由配置
// Element Plus 通过 unplugin-vue-components 自动按需引入，无需手动导入
import './style.css';
import './assets/css/atom.css';
// 引入 ECharts 按需配置（会自动注册组件）
import echarts from './utils/echarts.js';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router); // 将路由实例绑定到 Vue 应用
// Element Plus 组件和样式会通过 unplugin-vue-components 自动按需加载

// 将 echarts 挂载到全局属性，供所有组件使用
app.config.globalProperties.$echarts = echarts;

app.mount('#app');
