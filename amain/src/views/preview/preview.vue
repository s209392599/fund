<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const info = reactive({
  currentTabComponent: '',
  // 顶部的tab页
  list_default: [
    {
      id: 1,
      show: true,
      name: '涨幅预览',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_01.vue'))
      ),
      desc: '',
    },
    {
      id: 7,
      show: true,
      name: '基金维护',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_07.vue'))
      ),
      desc: '',
    },
    {
      id: 14,
      show: true,
      name: '标准基金',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_14.vue'))
      ),
      desc: '',
    },
    {
      id: 2,
      show: true,
      name: '额外基金监控',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_02.vue'))
      ),
      desc: '',
    },
    {
      id: 10,
      show: true,
      name: '近来对比',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_10.vue'))
      ),
      desc: '标准基金的对比 和 手动挑选一些基金进行对比',
    },
    {
      id: 5,
      show: true,
      name: '历史净值',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_05.vue'))
      ),
      desc: '',
    },
    {
      id: 6,
      show: true,
      name: '地址导航',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_06.vue'))
      ),
      desc: '',
    },
    {
      id: 12,
      show: true,
      name: '基金搜索',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_12.vue'))
      ),
      desc: '',
    },
    {
      id: 13,
      show: true,
      name: '基金对比',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_13.vue'))
      ),
      desc: '',
    },
    {
      id: 17,
      show: true,
      name: '指数中心',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_17.vue'))
      ),
      desc: '',
    },
    {
      id: 18,
      show: true,
      name: '指数涨幅',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_18.vue'))
      ),
      desc: '',
    },
    {
      id: 3,
      show: true,
      name: '群主分类推荐',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_03.vue'))
      ),
      desc: '',
    }
    {
      id: 99,
      show: true,
      name: '我的',
      component: markRaw(
        defineAsyncComponent(() => import('./tabs/preview_99.vue'))
      ),
      desc: '',
    },
  ],
  list_tabs: [],
  active_tab: null, // 初始为null，等数据准备好再设置
  password: '',
});

const user_email = localStorage.getItem('user_email');
if ([null, '', undefined].includes(user_email)) {
  ElMessage.error('登录失败！');
  router.push('/');
} else {
  console.log('账号为：', user_email);

  if (['209392599@qq.com', '203812677@qq.com'].includes(user_email)) {
    info.list_tabs = info.list_default.filter((item) => item.show);
  } else {
    info.list_tabs = info.list_default.filter(
      (item) => item.show && !item.permissions
    );
  }

  // 从本地存储获取active_tab，确保它在可用选项中
  const savedTab = localStorage.getItem('preview_active_tab');
  if (savedTab && info.list_tabs.some((tab) => tab.id == savedTab)) {
    info.active_tab = parseInt(savedTab);
  } else {
    info.active_tab = info.list_tabs[0]?.id || null;
  }
  info.currentTabComponent = info.list_tabs.find(
    (tab) => tab.id == info.active_tab
  )?.component;
}

const handleClick = (tab) => {
  const tabId = tab.props.name;
  info.currentTabComponent = info.list_tabs.find(
    (tab) => tab.id == tabId
  )?.component;
  localStorage.setItem('preview_active_tab', tabId);
};
</script>

<template>
  <div class="wrapper">
    <el-tabs v-model="info.active_tab" @tab-click="handleClick" class="page-tabs">
      <el-tab-pane v-for="item in info.list_tabs" :key="item.id" :label="item.name" :name="item.id">
      </el-tab-pane>
    </el-tabs>

    <div class="main">
      <component :is="info.currentTabComponent" v-if="info.currentTabComponent" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  overflow: auto;
}

:deep(.el-tabs) {
  // flex: 1;
  // display: flex;
  // flex-direction: column;
  // overflow: hidden;

  .el-tabs__header {
    flex-shrink: 0;
    margin: 0;
  }

  // .el-tabs__content {
  //   flex: 1;
  //   overflow: auto;
  // }

  // .tabs-content {
  //   height: 100%;
  //   overflow: auto;
  // }

  .el-tabs__item {
    padding: 0 6px;
  }
}
</style>
