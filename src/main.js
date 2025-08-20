import { createApp } from 'vue';
import './style.css';
import './assets/css/atom.css';
import App from './App.vue';
import router from './router'; // 引入路由配置
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(router); // 将路由实例绑定到 Vue 应用
app.use(ElementPlus);
app.mount('#app');
