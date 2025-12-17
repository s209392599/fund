<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_01.vue');

const info = reactive({
  tableData: []
})
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}

// 一个字符串必须是6位，且都是数字0-9
function isSixDigitNumber(str) {
  return /^[0-9]{6}$/.test(str);
}

const btn_fn_01 = () => {
  var str = prompt("请输入基金(用英文逗号分割)：", "");
  if (str !== null) {
    str = str.trim();
    let fundList = str.split(',');
    fundList.forEach(item => {
      let fund_code = item.trim();
      if (isSixDigitNumber(fund_code)) {
        let flag = info.tableData.some((item) => item.fund_code === fund_code);
        if (!flag) {
          info.tableData.push({
            fund_code: fund_code,
          });
        }
        localStorage.setItem('fund_duibi_arr', JSON.stringify(info.tableData));
      }
    });
  }
};
const btn_fn_02 = () => {
  console.log('删除所有基金');
};
const btn_line_1 = (row, index) => {
  console.log('删除基金', row, index);
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
            <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_code }}</span>
            <span v-else>{{ row.fund_code }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column prop="fund_name" label="基金名称" width="200" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_name }}</span>
          <span v-else>{{ row.fund_name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="fund_type" label="类型" width="70" align="center" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_type }}</span>
          <span v-else>{{ row.fund_type }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="point_top" label="高点" width="66"></el-table-column>
      <el-table-column prop="point_down" label="低点" width="66"></el-table-column>
      <el-table-column prop="dwjz" label="净值" width="66"></el-table-column>

      <el-table-column prop="fund_desc" label="备注" width="300" show-overflow-tooltip>
        <template v-slot="{ row }">
          <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">历史数据</span>
          <span v-else>{{ row.fund_desc }}</span>
        </template>
      </el-table-column> -->
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
