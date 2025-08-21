<script setup>
import { ref, reactive, markRaw, defineAsyncComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElTabs, ElTabPane } from 'element-plus';

const router = useRouter();

// import preview_01 from './tabs/preview_01.vue';
// import preview_02 from './tabs/preview_02.vue';
// import preview_03 from './tabs/preview_03.vue';
// import preview_04 from './tabs/preview_04.vue';
// import preview_05 from './tabs/preview_05.vue';
// import preview_06 from './tabs/preview_06.vue';
// import preview_07 from './tabs/preview_07.vue';
// import preview_08 from './tabs/preview_08.vue';
// import preview_09 from './tabs/preview_09.vue';
// import preview_10 from './tabs/preview_10.vue';
// import preview_11 from './tabs/preview_11.vue';

const info = reactive({
  currentTabComponent: '',
  // 顶部的tab页
  list_default: [
    // {
    //   id: 1,
    //   show: true,
    //   name: '涨幅预览',
    //   component: markRaw(defineAsyncComponent(() => import('./tabs/preview_01.vue'))),
    //   desc: ''
    // },
    // {
    //   id: 2,
    //   show: true,
    //   name: '均线预览',
    //   component: markRaw(defineAsyncComponent(() => import('./tabs/preview_02.vue'))),
    //   desc: ''
    // },
    // {
    //   id: 3,
    //   show: true,
    //   name: '今日收益',
    //   component: markRaw(defineAsyncComponent(() => import('./tabs/preview_03.vue'))),
    //   desc: ''
    // },
    // {
    //   id: 4,
    //   show: true,
    //   name: '业绩表现',
    //   component: markRaw(defineAsyncComponent(() => import('./tabs/preview_04.vue'))),
    //   desc: ''
    // },
    {
      id: 10,
      show: true,
      name: '近来对比',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_10.vue'))),
      desc: '标准基金的对比 和 手动挑选一些基金进行对比'
    },
    // {
    //   id: 11,
    //   show: true,
    //   name: '涨幅对比',
    //   component: markRaw(defineAsyncComponent(() => import('./tabs/preview_11.vue'))),
    //   desc: '手动挑选一些基金进行对比'
    // },
    {
      id: 5,
      show: true,
      name: '历史净值',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_05.vue'))),
      desc: ''
    },
    {
      id: 6,
      show: true,
      name: '地址导航',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_06.vue'))),
      desc: ''
    },
    // {
    //   id: 7,
    //   show: true,
    //   name: '基金维护',
    //   component: markRaw(defineAsyncComponent(() => import('./tabs/preview_07.vue'))),
    //   desc: ''
    // },
    {
      id: 8,
      show: true,
      name: '标准基金维护',
      permissions: 'admin',// 管理员才能有的
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_08.vue'))),
      desc: ''
    },
    {
      id: 9,
      show: true,
      name: '人员维护',
      permissions: 'admin',// 管理员才能有的
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_09.vue'))),
      desc: ''
    },
  ],
  list_tabs: [],
  active_tab: null, // 初始为null，等数据准备好再设置
  password: ''
});

const email = localStorage.getItem('email');
if ([null, '', undefined].includes(email)) {
  ElMessage.error('登录失败！')
  router.push('/');
} else {
  console.log('账号为：', email);

  if (['209392599@qq.com'].includes(email)) {
    info.list_tabs = info.list_default.filter(item => item.show);
  } else {
    info.list_tabs = info.list_default.filter(item => item.show && !item.permissions);
  }

  // 从本地存储获取active_tab，确保它在可用选项中
  const savedTab = localStorage.getItem('preview_active_tab');
  if (savedTab && info.list_tabs.some(tab => tab.id == savedTab)) {
    info.active_tab = parseInt(savedTab);
  } else {
    info.active_tab = info.list_tabs[0]?.id || null;
  }
  info.currentTabComponent = info.list_tabs.find(tab => tab.id == info.active_tab)?.component;
}

const handleClick = (tab) => {
  const tabId = tab.props.name;
  info.currentTabComponent = info.list_tabs.find(tab => tab.id == tabId)?.component;
  localStorage.setItem('preview_active_tab', tabId);
}
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
