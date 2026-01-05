<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_03.vue');

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

    await server_fund_jd_getFundTradeRulesPageInfo({
      fund_code: item.fund_code,
    }).then((res) => {

      let purchaseRule = res.data.purchaseRule || {};
      console.log(22, res);

      let depositFeeRatio = parseFloat(purchaseRule.depositFeeRatio || 0);
      let manageFeeRatio = parseFloat(purchaseRule.manageFeeRatio || 0);
      let saleServiceFeeRatio = parseFloat(purchaseRule.saleServiceFeeRatio || 0);
      let total_fei = depositFeeRatio + manageFeeRatio + saleServiceFeeRatio;
      res.data.zonghe_fei = Number(total_fei.toFixed(2));
      info.tableData[i].rules = res.data;

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
// 买入费率
const purchaseFeeRatio = (row) => {
  const arr = row?.rules?.purchaseRule?.purchaseFeeRatio || [];
  return arr
    .map((item) => {
      return `<div>${item.divideIntervalDesc}  (${item.discountedRate})</div>`;
    })
    .join('');
};
// 卖出费率
const redeemFeeRatio = (row) => {
  const arr = row?.rules?.redeemRule?.redeemFeeRatio || [];
  return arr
    .map((item) => {
      return `<div>${item.divideIntervalDesc}  (${item.rate})</div>`;
    })
    .join('');
};
// 卖出到账
const redeemBankProcess = (row) => {
  const arr = row?.rules?.redeemRule?.redeemBankProcess || [];
  return arr
    .map((item) => {
      return `<div>${item.title}  (${item.info})</div>`;
    })
    .join('');
};

// 排序-综合费率
const sortZonghefeilv = (a, b) => {
  return b.rules.zonghe_fei - a.rules.zonghe_fei;
};

// 删除不可定投
const btn_fn_01 = () => {
  info.tableData = info.tableData.filter((item) => {
    let aipStatus = item.rules?.purchaseRule?.aipStatus || '';
    return aipStatus !== '不可定投';
  });
  ElMessage.success('已删除不可定投基金');
};
// 删除卖出限制超过30天
const btn_fn_02 = () => {
  info.tableData = info.tableData.filter((item) => {
    const arr = item?.rules?.redeemRule?.redeemFeeRatio || [];
    if (arr.length > 3) {
      return false;
    }
    let falg = true;
    let no_text = ['90', '180', '360', '365', '730', '731'];
    arr.forEach(v_2 => {
      no_text.forEach(v_3 => {
        if (v_2.divideIntervalDesc.includes(v_3)) {
          falg = false;
        }
      });
    });
    return falg;
  });
  ElMessage.success('已删除综合费率大于2的基金');
};
// btn_fn_03 删除综合费率大于2
const btn_fn_03 = () => {
  info.tableData = info.tableData.filter((item) => {
    let zonghe_fei = item?.rules?.zonghe_fei || 0;
    console.log('fei', item, zonghe_fei <= 2);
    return zonghe_fei <= 2;
  });
  ElMessage.success('已删除综合费率大于2的基金');
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div class="pb-5">
      <el-button class="top_btn btn_1" @click="btn_fn_01()">删除不可定投</el-button>
      <el-button class="top_btn btn_2" @click="btn_fn_02()">删除卖出限制超过30天</el-button>
      <el-button class="top_btn btn_3" @click="btn_fn_03()">删除综合费率大于2</el-button>
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

      <el-table-column prop="" label="isNewFund" width="90">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.isNewFund }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="aipStatus" label="可定投?" width="74">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.aipStatus || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="dayLimitAmount" label="日累计限额" width="88">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.dayLimitAmount || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="aipMinAmount" label="定投金额" width="72">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.aipMinAmount || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="purchaseMinAmount" label="起投金额" width="72">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.purchaseMinAmount || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="manageFeeRatio" label="管理费" width="92">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.manageFeeRatio || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="depositFeeRatio" label="托管费" width="92">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.depositFeeRatio || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="saleServiceFeeRatio" label="销售服务费" width="94">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.purchaseRule?.saleServiceFeeRatio || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="purchaseRule" label="综合费率" width="100" sortable :sort-method="sortZonghefeilv">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.zonghe_fei || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="买入费率" width="270" show-overflow-tooltip>
        <template v-slot="{ row }">
          <div class="" v-html="purchaseFeeRatio(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="卖出状态" width="70">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.redeemRule?.redeemStatus || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="最小赎回" width="70">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.redeemRule?.redeemMinPortion || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="最小持有" width="70">
        <template v-slot="{ row }">
          <span>{{ row?.rules?.redeemRule?.redeemHoldPortion || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="卖出到账" width="150" show-overflow-tooltip>
        <template v-slot="{ row }">
          <div class="" v-html="redeemBankProcess(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="卖出费率" width="258" show-overflow-tooltip>
        <template v-slot="{ row }">
          <div class="" v-html="redeemFeeRatio(row)"></div>
        </template>
      </el-table-column>

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
