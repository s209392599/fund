<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_06.vue');

const info = reactive({
  tableData: []
})
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}
console.log(info.tableData);

</script>

<template>
  <div class="page_wrapper">
    123123
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 5px 0px 0px 0px;
}
</style>
