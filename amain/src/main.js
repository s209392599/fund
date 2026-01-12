import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // 引入路由配置
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import './assets/css/atom.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router); // 将路由实例绑定到 Vue 应用
app.use(ElementPlus);
app.mount('#app');
