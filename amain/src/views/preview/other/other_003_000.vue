<script setup>
console.log('amain/src/views/preview/other/other_003_000.vue');
const info = reactive({
  currentTabComponent: '',
  active_tab: '',
  // 传递给子组件
  child_info: {
    url: 'https://show.jd.com/m/dVAaqEjDlpo3kRyP/',// 榜单的根地址
  },
  list_tabs: [
    // {
    //   id: '1',
    //   name: '今日加仓榜',
    //   component: markRaw(
    //     defineAsyncComponent(() => import('./other_003_001.vue'))
    //   ),
    // },
    {
      id: '2',
      name: '持有人数飙升',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_002.vue'))
      ),
    },
    {
      id: '3',
      name: '屡创新高',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_003.vue'))
      ),
    },
    {
      id: '4',
      name: '连续跑赢大盘',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_004.vue'))
      ),
    },
    {
      id: '5',
      name: '连续跑赢赛道',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_005.vue'))
      ),
    },
    {
      id: '6',
      name: '业绩稳定',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_006.vue'))
      ),
    },
    {
      id: '7',
      name: '长期绩优',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_007.vue'))
      ),
    },
    {
      id: '8',
      name: '严控回撤',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_008.vue'))
      ),
    },
    {
      id: '9',
      name: '机构偏爱',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_009.vue'))
      ),
    },
    {
      id: '10',
      name: '综合人气',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_010.vue'))
      ),
    },
    {
      id: '11',
      name: '热门定投',
      component: markRaw(
        defineAsyncComponent(() => import('./other_003_011.vue'))
      ),
    },
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
      <component :is="info.currentTabComponent" v-if="info.currentTabComponent" :child_info="info.child_info" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: 100%;
  overflow: auto;
  padding: 0px 10px 0px 10px;
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
