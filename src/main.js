import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 引入路由配置

const app = createApp(App);
app.use(router); // 将路由实例绑定到 Vue 应用
app.mount('#app');
