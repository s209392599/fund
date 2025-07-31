import axios from 'axios';
import { ElMessage } from 'element-plus'; // 假设使用 Element Plus 作为 UI 库
import router from '@/router'; // 引入路由实例

// 创建 Axios 实例
const service = axios.create({
  baseURL: '/api',
  // baseURL: 'http://localhost:9999', // API 基础 URL
  // baseURL: import.meta.env.VITE_VUE_APP_BASE_API, // API 基础 URL
  timeout: 10 * 1000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token');
    // 判断当前路由是否在白名单中
    const whiteList = ['/login', '/register'];
    const isWhiteList = whiteList.includes(router.currentRoute.value.path);

    if (token && !isWhiteList) {
      // 如果 token 存在且不在白名单中，则添加 token 到请求头
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error('请求拦截器错误:', error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果响应状态码不是 200，则处理错误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
      // 如果 token 过期，则重定向到登录页面
      if (res.code === 401) {
        router.push('/login');
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.error('响应拦截器错误:', error); // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
