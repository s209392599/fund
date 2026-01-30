<script setup>
console.log('amain/src/views/preview/tabs/preview_03.vue');
// 群主分类推荐
const tableMaxHeight = computed(() => {
  return `calc(100vh - 95px)`;
});

const info = reactive({
  active_id: 1,
  list: [],
  tableData: [],
  tableMiddle: [],// 中间变量
})

const slectItem = (item) => {
  info.active_id = item.type;
  info.tableData = JSON.parse(JSON.stringify(item.data)); // 深拷贝避免引用问题
  info.tableMiddle = JSON.parse(JSON.stringify(item.data)); // 深拷贝避免引用问题
}

// 获取群主推荐基金
const query_qun_zhu_fund = () => {
  server_fund_table_mix_query({
    type_1: 'qun_zhu_fen_lei_tui_jian',
  }).then((res) => {
    if (res.code === 200) {
      let turnData = (res.data || [])[0]?.mix_data || '[]';
      info.list = JSON.parse(turnData);
      slectItem(info.list[0]);// 默认选中第一个
    } else {
      ElMessage.error('获取群主分类推荐失败，请重试！');
    }
  });
}

// 查询基金信息
const query_fund_info = (fund_code) => {
  server_fund_history_performance({
    fund_code: fund_code,
  }).then((res) => {
    if (res.code === 200) {
      info.tableData = info.tableData.map(item => {
        if (item.fund_code === fund_code) {
          return { ...item, zhang_his: res.data || [] };
        }
        return item;
      });
    } else {
      ElMessage.error('获取基金信息失败，请重试！');
    }
  });
}

// 使用一个标志来避免重复请求
let isRequesting = false;

watch(() => info.tableMiddle, (newVal) => {
  if (newVal.length > 0 && !isRequesting) {
    isRequesting = true;
    info.tableMiddle.forEach((item) => {
      query_fund_info(item.fund_code);
    });

    // 一小段时间后重置标志，允许下次请求
    setTimeout(() => {
      isRequesting = false;
    }, 100);
  }
}, { deep: true })

const getHisdata = (row, index) => {
  const obj = row.zhang_his?.[index] || {};
  if (!obj.avg) return '-';

  const rate = Number(obj.rate);
  if (isNaN(rate)) return '-';

  const className = rate >= 0 ? 'color-red' : 'color-green';
  return `<span class="${className}">${obj.rate}</span>`;
};

const sortHistoricalData = (a, b, index) => {
  const objA = a.zhang_his?.[index] || {};
  const objB = b.zhang_his?.[index] || {};

  const valA = parseFloat(objA.rate) || 0;
  const valB = parseFloat(objB.rate) || 0;

  return valA - valB; // 升序
};

// 历史排序快捷函数（一行一个）
const sortHisData0 = (a, b) => sortHistoricalData(a, b, 0);
const sortHisData1 = (a, b) => sortHistoricalData(a, b, 1);
const sortHisData2 = (a, b) => sortHistoricalData(a, b, 2);
const sortHisData3 = (a, b) => sortHistoricalData(a, b, 3);
const sortHisData4 = (a, b) => sortHistoricalData(a, b, 4);
const sortHisData5 = (a, b) => sortHistoricalData(a, b, 5);
const sortHisData6 = (a, b) => sortHistoricalData(a, b, 6);
const sortHisData7 = (a, b) => sortHistoricalData(a, b, 7);
const sortHisData8 = (a, b) => sortHistoricalData(a, b, 8);

const copyText = () => {
  let data = info.tableData.map(item => {
    return {
      fund_code: item.fund_code || '',
      fund_name: item.fund_name || '',
      fund_type: item.fund_type || '',
    }
  });
  fallbackCopyText(JSON.stringify(data));
}

const getToday = (row) => {
  const val = row.zhang_today;
  if (val === '-') return '-';

  const rate = Number(val);
  if (isNaN(rate)) return '-';

  const className = rate >= 0 ? 'color-red' : 'color-green';
  return `<span class="${className}">${val}</span>`;
};
const sortToday = (a, b) => {
  const valA = parseFloat(a.zhang_today) || 0;
  const valB = parseFloat(b.zhang_today) || 0;
  return valA - valB;
};

onMounted(() => {
  query_qun_zhu_fund();
})
</script>

<template>
  <div class="page_wrapper flex flex-row ">
    <div class="page_left h-full">
      <div class="type_list" v-for="item in info.list" :key="item.type"
        :class="item.type === info.active_id ? 'active' : ''" @click="slectItem(item)">
        <div class="type_name">{{ item.type }}</div>
      </div>
    </div>
    <div class="page_right flex-1">
      <div class="top_box flex items-center">
        <div class="btn_copy" @click="copyText">复制数据</div>
      </div>
      <el-table :data="info.tableData" style="width: 100%" border stripe :max-height="tableMaxHeight">
        <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

        <el-table-column fixed prop="fund_code" align="center" label="基金号" width="64">
          <template v-slot="{ row }">
            <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank" style="text-decoration: none">
              <span>{{ row.fund_code }}</span>
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="fund_name" label="基金名称" width="250" sortable show-overflow-tooltip>
        </el-table-column>

        <el-table-column align="right" label="今日" width="56" sortable :sort-method="sortToday">
          <template v-slot="{ row }">
            <span v-html="getToday(row)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近1周" width="70" sortable :sort-method="sortHisData0">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 0)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近1月" width="70" sortable :sort-method="sortHisData1">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 1)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近3月" width="70" sortable :sort-method="sortHisData2">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 2)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近6月" width="70" sortable :sort-method="sortHisData3">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 3)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近1年" width="70" sortable :sort-method="sortHisData4">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 4)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近3年" width="70" sortable :sort-method="sortHisData5">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 5)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近5年" width="70" sortable :sort-method="sortHisData6">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 6)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="今年" width="70" sortable :sort-method="sortHisData7">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 7)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="成立" width="70" sortable :sort-method="sortHisData8">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 8)"></span>
          </template>
        </el-table-column>

        <el-table-column prop="fund_desc" label="备注" width="300" show-overflow-tooltip>
        </el-table-column>

        <!-- 更新时间 -->
        <el-table-column prop="update_time" label="操作时间" width="160">
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

.page_left {
  width: 160px;
  border-right: 1px solid #e5e5e5;
  overflow: auto;

  .type_list {
    height: 34px;
    line-height: 34px;
    margin-top: 1px;

    &.active,
    &:hover {
      background: #49a2ff;
      color: #fff;
    }

    .type_name {
      cursor: pointer;
      padding: 0 10px;
    }
  }
}

.page_right {
  padding: 5px 10px 10px 10px;
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

:deep(.el-table) {
  .cell {
    padding: 0 5px !important;
  }

  .el-table__cell {
    padding: 2px 0;
  }

  .caret-wrapper {
    width: 15px;
    position: relative;
    left: -6px;
  }

  .color-red {
    color: red !important;
  }

  .color-green {
    color: #090 !important;
  }
}
</style>
