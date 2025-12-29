<script setup>
console.log('amain/src/views/preview/other/other_002_001.vue');
const tableMaxHeight = computed(() => {
  return `calc(100vh - 105px)`;
});
const info = reactive({
  tableData: [],
})
const selectedRows = ref([]);

// 处理勾选变化
const handleSelectionChange = (val) => {
  selectedRows.value = val || [];
}

// 读取并复制/打印勾选的数据
const getSelected = () => {
  console.log('selectedRows', selectedRows.value);
  if ((selectedRows.value || []).length === 0) {
    ElMessage.info('未勾选任何项');
    return;
  }
  fallbackCopyText(JSON.stringify(selectedRows.value));
  ElMessage.success('已复制勾选数据到剪贴板');
}
//
// 获取今日加仓榜
const getList = () => {
  server_fund_jd_getWealthDatas().then((res) => {
    console.log(res);
    if (res.code === 200) {
      let turnData = (res.data || []).map(v => JSON.parse(v));
      console.log('turnData', turnData);

      info.tableData = turnData || [];
    } else {
      ElMessage.error('获取失败，请重试！');
    }
  });
}
// 复制
const copyText = () => {
  const data = info.tableData.map(item => ({
    fund_code: item.fundCode,
    fund_name: item.fundName,
    fund_type: item.fundTypeStr
  }));
  fallbackCopyText(JSON.stringify(data));
}

const getFundMetrics = (row) => {
  return (row.fundMetrics || []).join(',');
}

// 删除
const btn_del = (row, index) => {
  info.tableData.splice(index, 1);
  ElMessage.success('删除成功');
}

onMounted(() => {
  getList();
})
</script>

<template>
  <div class="page_wrapper flex flex-row ">
    <div class="page_left h-full">
      <div class="type_list" v-for="item in info.list" :key="item.id"
        :class="item.id === info.active_id ? 'active' : ''" @click="slectItem(item)">
        <div class="type_name">{{ item.type }}</div>
      </div>
    </div>
    <div class="page_right flex-1">
      <div class="top_box flex items-center">
        <div class="btn_copy" @click="copyText">复制数据</div>
        <div class="btn_copy ml-2" @click="getSelected">读取勾选</div>
        <div class="flex-1 text-right truncate pl-5"></div>
      </div>
      <el-table ref="tableRef" :data="info.tableData" style="width: 100%" border stripe :max-height="tableMaxHeight" @selection-change="handleSelectionChange">
        <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>
        <el-table-column type="selection" width="40" fixed></el-table-column>
        <el-table-column label="操作" width="60" fixed>
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          </template>
        </el-table-column>


        <el-table-column fixed prop="fund_code" align="center" label="基金号" width="64">
          <template v-slot="{ row }">
            <a :href="`https://fund.eastmoney.com/${row.fundCode}.html`" target="_blank" style="text-decoration: none">
              <span>{{ row.fundCode }}</span>
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="fundName" label="基金名称" width="360">
        </el-table-column>

        <el-table-column prop="fundTypeStr" label="类型" width="100">
        </el-table-column>

        <el-table-column prop="riskLevelStr" label="风险" width="80">
        </el-table-column>

        <el-table-column prop="singleYearRate" label="近1年" width="80" align="right">
          <template v-slot="{ row }">
            <span>{{ row.singleYearRate ? row.singleYearRate.toFixed(2) : '-' }}%</span>
          </template>
        </el-table-column>

        <el-table-column prop="singleMonthRate" label="近1月" width="80" align="right">
          <template v-slot="{ row }">
            <span>{{ row.singleMonthRate ? row.singleMonthRate.toFixed(2) : '-' }}%</span>
          </template>
        </el-table-column>

        <el-table-column prop="setupRate" label="成立以来" width="80" align="right">
          <template v-slot="{ row }">
            <span>{{ row.setupRate ? row.setupRate.toFixed(2) : '-' }}%</span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="特征" width="300">
          <template v-slot="{ row }">
            <span v-html="getFundMetrics(row)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 40px);
  overflow: auto;
}

.top_box {
  height: 30px;
  line-height: 30px;

  .btn_copy {
    cursor: pointer;
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
    background-color: #49a2ff;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
  }
}
</style>
