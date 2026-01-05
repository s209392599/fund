<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_09.vue');

const info = reactive({
  tableData: [],
});
const tableMaxHeight = computed(() => {
  return `calc(100vh - 140px)`;
});
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}

const saveFundInfoToLocalstorage = () => {
  let arr = info.tableData.map(v => {
    return {
      fund_code: v.fund_code || '',
      fund_name: v.fund_name || '',
      fund_type: v.fund_type || '',
    };
  });
  localStorage.setItem('fund_duibi_arr', JSON.stringify(arr));
  console.log('触发了保存基金信息到本地存储');
};
watch(() => info.tableData, () => {
  saveFundInfoToLocalstorage();
}, { deep: true });

const getList = async () => {
  for (let i = 0; i < info.tableData.length; i++) {
    const item = info.tableData[i];

    await server_fund_amain_getfundgz({
      fund_code: item.fund_code,
    }).then((res) => {
      console.log('res', res.data);
      if (res.code === 200) {
        info.tableData[i] = {
          ...info.tableData[i],
          gszzl: res.data.gszzl || '',
          gztime: res.data.gztime || '',
        };
      }

      if (i === info.tableData.length - 1) {
        ElMessage.success('已获取所有基金的交易规则');
      }
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  info.tableData = info.tableData.filter((item) => item.fund_code !== row.fund_code);
};

// 排序-综合费率
const sortZonghefeilv = (a, b) => {
  return b.rules.zonghe_fei - a.rules.zonghe_fei;
};

// 删除不可定投
const btn_fn_01 = () => {
  info.tableData = info.tableData.filter((item) => {
    return !['', null, undefined].includes(item.gszzl);
  });
  ElMessage.success('已删除不可定投基金');
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div class="pb-5">
      <el-button class="top_btn btn_1" @click="btn_fn_01()">删除没有预测</el-button>
      <!-- <el-button class="top_btn btn_2" @click="btn_fn_02()">删除卖出限制超过30天</el-button> -->
      <!-- <el-button class="top_btn btn_3" @click="btn_fn_03()">删除综合费率大于2</el-button> -->
      <!-- <el-button class="top_btn btn_4" @click="btn_fn_04()">复制基金号(逗号)</el-button> -->
      <!-- <el-button class="top_btn btn_5" @click="btn_fn_05()">复制基金号(数组)</el-button> -->

      <span class="ml-10">基金数量：{{ info.tableData.length }}</span>
    </div>

    <el-table :data="info.tableData" style="width: 100%" border stripe :max-height="tableMaxHeight">
      <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

      <el-table-column label="操作" width="60" fixed>
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_line_1(row, $index)">删除</el-button>
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

      <el-table-column prop="" label="进入涨幅预测" width="120" sortable>
        <template v-slot="{ row }">
          <span>{{ row.gszzl }}</span>
        </template>
      </el-table-column>

      <!-- gztime -->
      <el-table-column prop="gztime" label="净值更新时间" width="180" align="center" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span>{{ row.gztime }}</span>
        </template>
      </el-table-column>

      <!--
      dwjz
:
"5.0178"
fund_code
:
"000584"
fund_name
:
"新华鑫益灵活配置混合C"
gsz
:
"5.0802"
gszzl
:
"1.24"
      -->

    </el-table>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 5px 0px 0px 0px;
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
