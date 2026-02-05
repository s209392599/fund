<script setup>
console.log('amain/src/views/preview/other/other_003_002.vue');

const props = defineProps({
  child_info: {
    type: Object,
    default: () => { }
  }
});

const tableMaxHeight = computed(() => {
  return `calc(100vh - 135px)`;
});
const info = reactive({
  tableData: [],
  selectedRows: []
})

// 处理勾选变化
const handleSelectionChange = (val) => {
  info.selectedRows = val || [];
}
const btn_fn_01 = () => {
  if (info.tableData.length === 0) {
    ElMessage.info('当前无数据');
    return;
  }
  let data = info.tableData.map(item => ({
    fund_code: item.fundCode || '',
    fund_name: item.fundName || '',
    fund_type: item.fundTypeStr || ''
  }));
  fallbackCopyText(JSON.stringify(data));
}
// 读取并复制/打印勾选的数据
const btn_fn_02 = () => {
  if ((info.selectedRows || []).length === 0) {
    ElMessage.info('未勾选任何项');
    return;
  }
  let data = info.selectedRows.map(item => ({
    fund_code: item.fundCode || '',
    fund_name: item.fundName || '',
    fund_type: item.fundTypeStr || ''
  }));
  fallbackCopyText(JSON.stringify(data));
}
//
// 获取今日加仓榜
const getList = () => {
  server_fund_jd_getWealthDatas({
    reqData: {
      rankCode: "432131011523200",
      sourceType: 1,
    }
  }).then((res) => {
    if (res.code === 200) {
      let turnData = (res.data || []).map(v => JSON.parse(v));
      info.tableData = turnData || [];
    } else {
      ElMessage.error('获取失败，请重试！');
    }
  });
}

const getFundMetrics = (row) => {
  return (row.fundMetrics || []).join(',');
}

// 删除
const btn_del = (row, index) => {
  info.tableData = info.tableData.filter((item) => item.fund_code !== row.fund_code);
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
      <div class="top_box flex items-center pb-10">
        <div class="flex gap-5 items-center">
          <el-button class="top_btn btn_1" @click="btn_fn_01()">复制数据</el-button>
          <el-button class="top_btn btn_2" @click="btn_fn_02()">复制勾选数据</el-button>
          <!-- <el-button class="top_btn btn_3" @click="btn_fn_02()">删除所有基金</el-button> -->
          <!-- <el-button class="top_btn btn_4" @click="btn_fn_03()">复制基金号(逗号)</el-button> -->
          <!-- <el-button class="top_btn btn_5" @click="btn_fn_05()">复制基金号(数组)</el-button> -->

          <a class="ml-5" :href="props.child_info.url" target="_blank">榜单地址</a>
        </div>
        <div class="flex-1 text-right truncate pl-5"></div>
      </div>

      <el-table ref="tableRef" :data="info.tableData" style="width: 100%" border stripe :max-height="tableMaxHeight"
        @selection-change="handleSelectionChange">
        <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

        <el-table-column label="操作" width="60" fixed align="center">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          </template>
        </el-table-column>

        <el-table-column type="selection" width="40" fixed align="center"></el-table-column>


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

        <el-table-column prop="" label="近1月" width="80" align="right">
          <template v-slot="{ row }">
            <span>{{ row.singleMonthRate ? row.singleMonthRate.toFixed(2) : '-' }}%</span>
          </template>
        </el-table-column>

        <el-table-column prop="" label="近1年" width="80" align="right">
          <template v-slot="{ row }">
            <span>{{ row.singleYearRate ? row.singleYearRate.toFixed(2) : '-' }}%</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="" label="近1月持有人数涨幅" width="80" align="right">
          <template v-slot="{ row }">
            <span>{{ row.holdUsrCntIncrsRate30d ? (Number(row.holdUsrCntIncrsRate30d) * 100).toFixed(2) : '-' }}%</span>
          </template>
        </el-table-column> -->

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
  padding: 10px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}

.page_right {
  min-width: 0;
}

:deep(.top_btn) {
  color: #fff;
  border: none;

  &.btn_1 {
    background-color: #7e57c2 !important; // 紫色
  }

  &.btn_2 {
    background-color: #26a69a !important; // 青色
  }

  &.btn_3 {
    background-color: #ff7043 !important; // 橙红色
  }

  &.btn_4 {
    background-color: #ffa726 !important; // 橙黄色
  }

  &.btn_5 {
    background-color: #29b6f6 !important; // 天蓝色
  }
}
</style>
