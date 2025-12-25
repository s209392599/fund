<script setup>
console.log('amain/src/views/preview/other/other_02.vue');

const info = reactive({
  tableData: []
})

const getTableData = async () => {
  const res = await server_fund_apifolder_jiaichapaihang({})
  console.log(res);
  // info.tableData = res.data
}

onMounted(() => {
  getTableData()
})
</script>

<template>
  <div class="page_wrapper">
    <div class="">算法说明：读取日周月的排行榜前500名，去除A类进行交叉排名取交集</div>
    <button @click="getTableData">获取数据</button>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 90px);
  overflow: auto;
  padding: 10px 0px 0px 0px;
}
</style>
