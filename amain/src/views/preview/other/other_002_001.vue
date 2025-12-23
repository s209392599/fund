<script setup>
console.log('amain/src/views/preview/other/other_02.vue');

const info = reactive({
  tableData: []
})
</script>

<template>
  <div class="page_wrapper">
    <div class="">算法说明：读取日周月的排行榜前500名，去除A类进行交叉排名取交集</div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 90px);
  overflow: auto;
  padding: 10px 0px 0px 0px;
}
</style>
