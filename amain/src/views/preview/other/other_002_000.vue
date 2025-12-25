<script setup>
console.log('amain/src/views/preview/other/other_002_000.vue');

/*
https://fund.eastmoney.com/data/fundranking.html 基金排行 2025年12月23日11:28:38
*/
const info = reactive({
  currentTabComponent: '',
  active_tab: '',
  list_tabs: [
    {
      id: '1',
      name: '全部',
      component: markRaw(
        defineAsyncComponent(() => import('./other_002_001.vue'))
      ),
    },
    {
      id: '2',
      name: '指数型',
      component: markRaw(
        defineAsyncComponent(() => import('./other_002_002.vue'))
      ),
    },
    {
      id: '3',
      name: '股票型',
      component: markRaw(
        defineAsyncComponent(() => import('./other_002_003.vue'))
      ),
    },
    {
      id: '4',
      name: '混合型',
      component: markRaw(
        defineAsyncComponent(() => import('./other_002_004.vue'))
      ),
    },
    {
      id: '5',
      name: '债券型',
      component: markRaw(
        defineAsyncComponent(() => import('./other_002_005.vue'))
      ),
    },
    // {
    //   id: '6',
    //   name: 'QDII',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_002_006.vue'))
    //   ),
    // },
    // {
    //   id: '7',
    //   name: 'FOF',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_002_007.vue'))
    //   ),
    // },
  ]
})
const handleClick = (tab) => {
  const tabId = tab.props.name;
  info.currentTabComponent = info.list_tabs.find(
    (tab) => tab.id == tabId
  )?.component;
  localStorage.setItem('preview_active_tab', tabId);
};
onMounted(() => {
  const firstTab = info.list_tabs[0];
  if (firstTab) {
    info.currentTabComponent = firstTab.component;
    info.active_tab = firstTab.id;

    // 检查是否有保存的标签页状态
    // const savedTab = localStorage.getItem('preview_active_tab');
    // if (savedTab && info.list_tabs.some(tab => tab.id === savedTab)) {
    //   info.active_tab = savedTab;
    //   info.currentTabComponent = info.list_tabs.find(tab => tab.id === savedTab)?.component;
    // }
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
      <component :is="info.currentTabComponent" v-if="info.currentTabComponent" />
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
