<script setup>
const info = reactive({
  tableData: [
    {
      "mail": "xuebinghui@bmrb.com.cn",
      "name": "薛炳辉",
      "update_time": "",
      "telphone": "",
      "sub_mail": "",
      "password": "bJR8",
      "fund": []
    },

  ]
})

const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 === 1 ? 'warning-row' : 'success-row';
}
const btn_edit = ($item, $index) => {
  console.log("编辑", $item, $index);
}
const btn_del = () => {
  console.log("删除");
}

</script>

<template>
  <div class="page-wrapper">
    <el-table :data="info.tableData" border :row-class-name="tableRowClassName" style="width: 100%" height="600">
      <el-table-column fixed label="序" type="index" width="50" />
      <el-table-column prop="mail" label="邮箱" width="260" />
      <el-table-column prop="password" label="密码" width="120" />
      <el-table-column label="Operations" min-width="120">
        <template #default="{ $item, $index }">
          <el-button link type="primary" size="small" @click="btn_edit($item, $index)">编辑</el-button>
          <el-button link type="primary" size="small" @click="btn_del">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.page-wrapper {
  padding: 10px;
}
</style>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
