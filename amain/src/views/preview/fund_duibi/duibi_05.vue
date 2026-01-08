<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_05.vue');
const info = reactive({
  tableData: [],
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

    await server_fund_jd_getFundDetailChartPageInfo({
      fund_code: item.fund_code,
    }).then((res) => {
      let obj_1 = res.data || {};
      let majorChartPointList = obj_1.majorChartPointList || [];
      let zheng = '-';
      if (majorChartPointList.length > 1) {
        let count = 0;
        for (let j = 1; j < majorChartPointList.length - 1; j++) {
          let obj_2 = majorChartPointList[j] || {};
          let obj_3 = majorChartPointList[j + 1] || {};
          let close_1 = parseFloat(obj_2.yAxis) || 0;
          let close_2 = parseFloat(obj_3.yAxis) || 0;
          if (close_1 > close_2) {
            count++;
          }
        }
        obj_1.zheng = (count / (majorChartPointList.length - 1) * 100).toFixed(2) + '%';
      }
      info.tableData[i] = {
        ...info.tableData[i],
        ...obj_1,
      };
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  info.tableData = info.tableData.filter((item) => item.fund_code !== row.fund_code);
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div id="list_wrapper">
      <div class="list_item" v-for="(item, index) in info.tableData" :key="item.fund_code">

        <div class="list_top flex justify-between" style="margin: 0px;">
          <div class="">{{ item.fund_code }}</div>
          <div class="">{{ item.fund_type }}</div>
          <div class="list_del" @click="btn_line_1(item, index)">删除</div>
        </div>

        <div class="fund_name_box item_box flex justify-between items-center">
          <div class="truncate flex-1" :title="item.fund_name" style="font-size: 12px;;">{{ item.fund_name }}</div>
          <div class="pl-5">{{ item.establishmentCycleDesc }}</div>
        </div>

        <div class="item_box flex justify-between items-center">
          <div class="">最大回撤 {{ item.maxRetracementValue }}%</div>
          <div class="">正收益天数比率 {{ item.zheng }}</div>
          <div class="">修复天数 {{ item.restoreDay }}天</div>
        </div>

        <div class="item_box" style="margin: 10px 0px 0px 0px;">
          <Chart_xiufu_01 :data="item" class="stock_main" />
        </div>

      </div><!-- list_item -->
    </div><!-- list_wrapper -->
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 5px 0px 0px 0px;
  font-size: 12px;
}

#list_wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.list_item {
  position: relative;
  z-index: 2;
  width: 430px;
  min-width: 430px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f5f5f5;
  overflow: hidden;
}

.list_top {
  padding: 5px;
  margin: 10px 0px 0px 0px;
  background-color: #fff;
}

.fund_name_box {
  padding: 5px;
  margin: 10px 0px 0px 0px;
  background-color: #fff;
}

.list_del {
  cursor: pointer;
  color: red;
}

.item_box {
  margin: 10px 0px 10px 0px;
  background-color: #fff;
  padding: 5px;
}
</style>
