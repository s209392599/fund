import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 创建 Axios 实例
const service = axios.create({
  // baseURL: './',
  baseURL: import.meta.env.VITE_VUE_APP_BASE_API,
  timeout: 10 * 1000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const whiteList = ['/login', '/register'];
    const isWhiteList = whiteList.includes(router.currentRoute.value.path);

    if (token && !isWhiteList) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
      if (res.code === 401) {
        router.push('/login');
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.error('响应拦截器错误:', error);
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

// 封装 get/post 方法
const request = (config) => service(config);

request.get = (url, params) => {
  return service({
    url,
    method: 'get',
    params: params || {}, // 自动处理空参数
  });
};

request.post = (url, data) => {
  return service({
    url,
    method: 'post',
    data: data || {}, // 自动处理空参数
  });
};

export default request;
