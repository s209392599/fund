<script setup>
console.log('amain/src/views/preview/other/other_003_000.vue');
const info = reactive({
  currentTabComponent: '',
  active_tab: '',
  list_tabs: [
    {
      id: '1',
      name: '今日加仓榜',
      sign: 'all',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_001.vue'))
      ),
    },
    // {
    //   id: '2',
    //   name: '指数型',
    //   sign: 'zhishu',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_002_002.vue'))
    //   ),
    // },
    // {
    //   id: '3',
    //   name: '股票型',
    //   sign: 'gupiao',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_002_003.vue'))
    //   ),
    // },
    // {
    //   id: '4',
    //   name: '混合型',
    //   sign: 'hunhe',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_002_004.vue'))
    //   ),
    // },
    // {
    //   id: '5',
    //   name: '债券型',
    //   sign: 'zhaiquan',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_002_005.vue'))
    //   ),
    // },
  ],
})

const handleClick = (tab) => {
  const tabId = tab.props.name;
  info.active_tab = tabId;
  info.currentTabComponent = info.list_tabs.find(
    (tab) => tab.id == tabId
  )?.component;
  // localStorage.setItem('preview_active_tab', tabId);
};

onMounted(() => {
  const firstTab = info.list_tabs[0];
  if (firstTab) {
    info.currentTabComponent = firstTab.component;
    info.active_tab = firstTab.id;
  }
});
</script>

<template>
  <div class="page_wrapper">
    <el-tabs v-model="info.active_tab" @tab-click="handleClick" class="page-tabs">
      <el-tab-pane v-for="item in info.list_tabs" :key="item.id" :label="item.name" :name="item.id">
      </el-tab-pane>
    </el-tabs>

    <div class="main">
      <component :is="info.currentTabComponent" v-if="info.currentTabComponent" :data="info.data_jiaocha" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: 100%;
  overflow: auto;
  padding: 10px 10px 0px 10px;
}

.main {
  flex: 1;
  overflow: auto;
}

:deep(.el-tabs) {
  .el-tabs__header {
    flex-shrink: 0;
    margin: 0;
  }

  .el-tabs__item {
    padding: 0 6px;
  }
}
</style>
