<script setup>
console.log('src/views/preview/tabs/preview_06.vue');

const info = reactive({
  showBtn: false,
  list: []
});

// 获取群主推荐基金
const getList = () => {
  server_fund_table_mix_query({
    type_1: 'di_zhi_dao_hang',
  }).then((res) => {
    if (res.code === 200) {
      let turnData = (res.data || [])[0]?.mix_data || '[]';
      info.list = JSON.parse(turnData);
    } else {
      ElMessage.error('获取群主分类推荐失败，请重试！');
    }
  });
}

onMounted(() => {
  getList();
});

</script>

<template>
  <div class="page_wrapper">
    <div v-for="(item, index) in info.list" :key="index" class="nav_item">
      <a :href="item.adress" target="_blank">{{ item.name }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  padding: 10px;
}

.nav_item {
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
  // border-bottom: 1px dashed #ccc;

  a {
    text-decoration: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
