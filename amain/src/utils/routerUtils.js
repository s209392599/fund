import { useRouter } from 'vue-router';

// 封装一个全局的 useRouter 函数
export function useGlobalRouter() {
  return useRouter();
}