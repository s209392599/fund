<script setup>
const router = useRouter();

const info = reactive({
  // 顶部的tab页
  list_tab: [
    {
      id: 1,
      name: '第一个',
      desc: ''
    },
    {
      id: 2,
      name: '第二个',
      desc: ''
    },
    {
      id: 3,
      name: '第三个',
      desc: ''
    },
    {
      id: 4,
      name: '第四个',
      desc: ''
    }
  ],
  password: ''
});

const email = localStorage.getItem('email');
if ([null, '', undefined].includes(email)) {
  ElMessage.error('登录失败！')
  router.push('/');
} else {
  console.log('争藏');
}
</script>

<template>
  <div class="page-wrapper flex">
    <div class="page-tabs">
      <el-tabs v-model="info.activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in info.list_tab" :key="item.id" :label="item.name">
          <div class="page-main"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-main"></div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100vh;
}

.page-tabs {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
</style>
