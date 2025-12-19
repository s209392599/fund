<script setup>
console.log('amain/src/views/preview/tabs/preview_03.vue');
// 群主基金推荐：红利、量化、宽基、科技、QDII等基金定期更新

const info = reactive({
  tableData: []
})

// 一个字符串必须是6位，且都是数字0-9
function isSixDigitNumber(str) {
  return /^[0-9]{6}$/.test(str);
}

const btn_fn_02 = () => {
  if (confirm('确定要删除所有基金吗？')) {
    info.tableData = [];
    saveFundInfoToLocalstorage();
  }
};
const btn_line_1 = (row, index) => {
  info.tableData.splice(index, 1);
  saveFundInfoToLocalstorage();
};
const btn_line_2 = (row, index) => {
  console.log('插入到基金', row, index);
};
</script>

<template>
  <div class="page_wrapper">
    <div class="pb-5">
      <el-button type="primary" @click="btn_fn_01()">添加基金</el-button>
      <el-button type="primary" @click="btn_fn_02()">删除所有基金</el-button>
    </div>

    <el-table :data="info.tableData" style="width: 100%" border stripe max-height="520">
      <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

      <el-table-column label="操作" width="140" fixed>
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_line_1(row, $index)">删除</el-button>
          <el-button link type="primary" size="small" @click="btn_line_2(row, $index)">插入到</el-button>
        </template>
      </el-table-column>

      <el-table-column fixed prop="fund_code" align="center" label="基金号" width="64">
        <template v-slot="{ row }">
          <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank" style="text-decoration: none">
            <span>{{ row.fund_code }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column prop="fund_name" label="基金名称" width="380" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span>{{ row.fund_name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="fund_type" label="类型" width="150" align="center" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span>{{ row.fund_type }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px 0px 0px 0px;
}
</style>
