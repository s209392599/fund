<script setup>
console.log('src/views/preview/tabs/preview_12.vue');

const info = reactive({
  text: '',
  tableData:[],// 列表数据
});
const getList = () => {
  if(info.text.trim() === ''){
    info.tableData = [];
    return;
  }
  server_fund_search_bytiantian({ text: info.text.trim() }).then(res => {
    if (res.code === 200) {
      info.tableData = res.data;
    } else {
      info.tableData = [];
      ElMessage.error(res.msg || '获取列表失败');
    }
  }).catch(() => {
    info.tableData = [];
    ElMessage.error('获取列表失败');
  });
};
const resetForm = () => {
  info.search = '';
  getList();
};
const addFn = () => {
  console.log('新增');
};
const btn_del = (row, $index) => {
  console.log('删除', row);
};
</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true" >
        <el-form-item label="关键字">
          <el-input
            v-model="info.text"
            placeholder="搜索的文字"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button type="success" @click="addFn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">
      <el-table :data="info.tableData" border style="width: 100%" height="500">
        <el-table-column fixed label="序" type="index" width="50" />
        <el-table-column prop="email" label="邮箱" width="300" />
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="password" label="密码" width="200" />
        <el-table-column prop="desc" label="备注" width="200" />
        <el-table-column label="Operations" min-width="120">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
