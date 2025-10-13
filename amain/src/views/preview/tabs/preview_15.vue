<script setup>
console.log('amain/src/views/preview/tabs/preview_15.vue');
// 基金大屏信息展示

/*
指数的涨跌信息
资金的流入流出

*/

const info = reactive({
  text: '',
  tableData: [

  ],
});


const getList = () => {

};

const addFn = () => {
  console.log('新增');
};

</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button type="success" @click="addFn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">

    </div>

  </div>
</template>

<style scoped lang="scss"></style>
