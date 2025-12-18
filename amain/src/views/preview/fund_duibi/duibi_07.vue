<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_07.vue');

const info = reactive({
  tableData: [],
});
new Array(40).fill(0).forEach((v, i) => {
  info.tableData.push({
    fund_code: '000001',
    fund_name: '测试基金' + i,
    fund_type: '测试类型' + i,
  });
});
// if (localStorage.getItem('fund_duibi_arr')) {
//   info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
// } else {
//   localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
// }
// console.log(info.tableData);

// 存储基金信息
const saveFundInfoToLocalstorage = () => {
  let arr = info.tableData.map(v => {
    return {
      fund_code: v.fund_code,
      fund_name: v.fund_name,
      fund_type: v.fund_type,
    };
  });
  localStorage.setItem('fund_duibi_arr', JSON.stringify(arr));
};

const getList = async () => {
  for (let i = 0; i < info.tableData.length; i++) {
    const item = info.tableData[i];

    await server_fund_jd_getFundDividendPageInfo({
      fund_code: item.fund_code,
    }).then((res) => {
      console.log(res);
      let arr = res.data.dividendList || [];
      info.tableData[i].dividendList = arr;

      let cur_year = new Date().getFullYear();
      let last_year = cur_year - 1;
      let total_year_count = 0;
      let last_year_count = 0;
      arr.forEach((item) => {
        let year = new Date(item.executeDate).getFullYear();
        // 使用 parseInt 或 Math.round 来避免浮点数精度问题
        if (year === cur_year) {
          total_year_count += Math.round(Number(item.unitProfit) * 10000);
        } else if (year === last_year) {
          last_year_count += Math.round(Number(item.unitProfit) * 10000);
        }
      });

      info.tableData[i].total_year_count = total_year_count;
      info.tableData[i].last_year_count = last_year_count;

      saveFundInfoToLocalstorage();
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  info.tableData.splice(index, 1);
  saveFundInfoToLocalstorage();
};

onMounted(() => {
  // getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div id="list_wrapper">
      <div class="list_item" v-for="(item, index) in info.tableData" :key="item.fund_code">
        <div class="list_del" @click="btn_line_1(item, index)">删除</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 5px 0px 0px 0px;
}

#list_wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list_item {
  position: relative;
  z-index: 2;
  width: 260px;
  min-width: 260px;
  border: 1px solid #ccc;
  border-radius: 12px;
  height: 2000px;
  overflow: hidden;
}
</style>
