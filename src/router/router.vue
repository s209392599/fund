<template>
  <div>
    <button @click="goToPreview">跳转到预览页</button>
    <button @click="goWithParams">带参数跳转</button>
    <button @click="replaceRoute">替换当前路由</button>
    <router-link to="/preview">使用router-link跳转</router-link>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const goToPreview = () => {
      router.push('/preview');
    };

    const goWithParams = () => {
      router.push({
        name: 'Preview',
        query: { id: 123 }  // 使用query而不是params，除非路由配置了参数
      });
    };

    const replaceRoute = () => {
      router.replace('/preview');
    };

    return {
      goToPreview,
      goWithParams,
      replaceRoute
    };
  }
};
</script>
