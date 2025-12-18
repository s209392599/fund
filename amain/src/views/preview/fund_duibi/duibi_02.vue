<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_02.vue');
import moniData from './moni.json';

const info = reactive({
  tableData: moniData,
});
// if (localStorage.getItem('fund_duibi_arr')) {
//   info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
// } else {
//   localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
// }
// console.log(info.tableData);

const getList = async () => {
  for (let i = 0; i < info.tableData.length; i++) {
    const item = info.tableData[i];

    await server_fund_jd_detailPageInfoWithNoPin({
      fund_code: item.fund_code,
    }).then((res) => {
      console.log(res);
      info.tableData[i] = {
        ...info.tableData[i],
        ...res.data,
      };
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  console.log(row, index);
};
// 榜单
const Turn_rankList = (row) => {
  const rankList = row?.headerOfItem?.rankList || [];
  return rankList.map((item) => item.wealthRank).join('；');
};
// 特色亮点
const TurnHighlights = (row) => {
  const highlights = row?.headerOfItem?.highlights || {};
  const tagList = highlights.tagList || [];
  var str = '';
  if (highlights.hasOwnProperty('morningstarRating')) {
    str += `晨星${highlights.morningstarRating}星；`;
  }
  return str + tagList.join('；');
};
// 用户关注
const Turn_userFocus = (row) => {
  const userFocus = row?.headerOfItem?.userFocus || [];
  return userFocus.map((item) => item.title).join('；');
};
// 投资方向
const TurnInvestDirection = (row) => {
  const themeNameList = row?.headerOfItem?.themeNameList || [];
  console.log('themeNameList', themeNameList);

  return themeNameList.map((item) => item.themeName).join('；');
};

// 管理公司
const Turn_company_name = (row) => {
  let company_name = row?.fundProfileOfItem?.company_name || '';
  // 剔除这些关键词
  var tichu = ['基金管理有限公司', '基金管理股份有限公司'];
  tichu.forEach((item) => {
    company_name = company_name.replace(item, '');
  });
  return company_name;
};

onMounted(() => {
  // getList();
});
</script>

<template>
  <div class="page_wrapper">
    <el-table
      :data="info.tableData"
      style="width: 100%"
      border
      stripe
      max-height="520"
    >
      <el-table-column
        fixed
        type="index"
        align="center"
        label="序"
        width="36"
      ></el-table-column>

      <el-table-column label="操作" width="60" fixed>
        <template #default="{ row, $index }">
          <el-button
            link
            type="primary"
            size="small"
            @click="btn_line_1(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        fixed
        prop="fund_code"
        align="center"
        label="基金号"
        width="64"
      >
        <template v-slot="{ row }">
          <a
            :href="`https://fund.eastmoney.com/${row.fund_code}.html`"
            target="_blank"
            style="text-decoration: none"
          >
            <span
              v-if="row.sign === '历史'"
              style="color: #876ad2; font-weight: 700"
              >{{ row.fund_code }}</span
            >
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
      <!-- show-overflow-tooltip -->

      <el-table-column prop="" label="可买?" width="90">
        <template v-slot="{ row }">
          <span>{{ row?.isForSale ? '可买' : '不可买' }}</span>
        </template>
      </el-table-column>

      <!-- https://fundgz.1234567.com.cn/js/007467.js -->

      <el-table-column prop="" label="成立时间" width="100">
        <template v-slot="{ row }">
          <div class="">{{ row?.fundProfileOfItem?.establishedDate }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="基金规模" width="100">
        <template v-slot="{ row }">
          <div class="">{{ row?.fundProfileOfItem?.fundScale }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="规模变化" width="220">
        <template v-slot="{ row }">
          <div class="">{{
            row?.fundProfileOfItem?.fundScaleList?.join('；')
          }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="机构占比" width="70">
        <template v-slot="{ row }">
          <div class="">{{ row?.fundProfileOfItem?.instPurchaseRatio }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="榜单" width="258">
        <template v-slot="{ row }">
          <div class="" v-html="Turn_rankList(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="特色亮点" width="258">
        <template v-slot="{ row }">
          <div class="" v-html="TurnHighlights(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="用户关注" width="258">
        <template v-slot="{ row }">
          <div class="" v-html="Turn_userFocus(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="投资方向" width="258">
        <template v-slot="{ row }">
          <div class="" v-html="TurnInvestDirection(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="管理公司" width="90">
        <template v-slot="{ row }">
          <div class="" v-html="Turn_company_name(row)"></div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="管理资产" width="100">
        <template v-slot="{ row }">
          <div class="">{{ row?.fundProfileOfItem?.companyManageScale }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="基金数量" width="70">
        <template v-slot="{ row }">
          <div class="">{{ row?.fundProfileOfItem?.manageNumber }}</div>
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
</style>
