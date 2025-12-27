<script setup>
import { useRouter } from 'vue-router';
import { ElMessage, ElTabs, ElTabPane } from 'element-plus';

const router = useRouter();
const info = reactive({
  currentTabComponent: '',
  // 顶部的tab页
  list_default: [
    {
      id: 1,
      name: '群主基金维护',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_01.vue'))),
    },
    {
      id: 2,
      name: '人员维护',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_02.vue'))),
    },
    {
      id: 3,
      name: '邮件公告-操作',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_03.vue'))),
    },
    {
      id: 4,
      name: '邮件公告-其它',
      component: markRaw(defineAsyncComponent(() => import('./tabs/preview_04.vue'))),
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

  info.list_tabs = [...info.list_default];// 可以附加其它过滤条件

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
