<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_03.vue');

const info = reactive({
  tableData: [],
})
// if (localStorage.getItem('fund_duibi_arr')) {
//   info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
// } else {
//   localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
// }
console.log(info.tableData);


const getList = async () => {
  for (let i = 0; i < info.tableData.length; i++) {
    const item = info.tableData[i];
    const fund_code = item.fund_code;

    await server_fund_jd_getFundTradeRulesPageInfo({ fund_code: item.fund_code }).then(res => {
      console.log(res);
      info.tableData[i].rules = res.data;
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  console.log(row, index);
};
// 买入费率
const purchaseFeeRatio = (row) => {
  const arr = row?.rules?.purchaseRule?.purchaseFeeRatio || [];
  return arr.map(item => {
    return `<div>${item.divideIntervalDesc}  (${item.discountedRate})</div>`;
  }).join('');
};
// 卖出费率
const redeemFeeRatio = (row) => {
  const arr = row?.rules?.redeemRule?.redeemFeeRatio || [];
  return arr.map(item => {
    return `<div>${item.divideIntervalDesc}  (${item.rate})</div>`;
  }).join('');
};
// 卖出到账
const redeemBankProcess = (row) => {
  const arr = row?.rules?.redeemRule?.redeemBankProcess || [];
  return arr.map(item => {
    return `<div>${item.title}  (${item.info})</div>`;
  }).join('');
};

onMounted(() => {
  // getList();
})
</script>

<template>
  <div class="page_wrapper">
    <el-table :data="info.tableData" style="width: 100%" border stripe max-height="520">
      <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

      <el-table-column label="操作" width="60" fixed>
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_line_1(row, $index)">删除</el-button>
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

      <!-- <el-table-column prop="fund_name" label="基金名称" width="200" sortable show-overflow-tooltip>
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
      </el-table-column> -->

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

      <el-table-column prop="" label="买入费率" width="258" show-overflow-tooltip>
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


      <!-- <el-table-column prop="point_top" label="高点" width="66"></el-table-column>

      <el-table-column prop="dwjz" label="净值" width="66"></el-table-column>

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
</style>
