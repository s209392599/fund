<script setup>
console.log('src/views/preview/tabs/preview_13.vue');

const info = reactive({
  tableData: [
    {
      "code": "022365",
      "name": "永赢科技智选混合发起C",
    },
    {
      "code": "018561",
      "name": "中信保诚多策略混合(LOF)C",
    },
  ],// 列表数据
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
      <div class="drag_tiem">
        <div class="drag_title"></div>
        <div class="drag_main"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
