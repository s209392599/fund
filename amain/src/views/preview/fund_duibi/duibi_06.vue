<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_06.vue');

const info = reactive({
  tableData: [],
});
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}
console.log(info.tableData);

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
  localStorage.setItem('fund_duibi_arr', JSON.stringify(info.tableData));
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div id="list_wrapper">
      <div class="list_item" v-for="(item, index) in info.tableData" :key="item.fund_code">
        <div class="list_title">
          <div class="list_fundcode">{{ item.fund_code }}</div>
          <div class="list_fundname" :title="item.fund_name">{{ item.fund_name }}</div>
        </div>

        <div class="list_title">
          <div class="list_fundcode">去年:{{ item.last_year_count }}</div>
          <div class="list_fundname">今年:{{ item.total_year_count }}</div>
          <div class="list_del" @click="btn_line_1(item, index)">删除</div>
        </div>


        <div class="list_main">
          <div class="list_line" v-for="(item_2, index_2) in (item.dividendList || [])" :key="index_2">
            <div class="list_dengjiri">{{ item_2.executeDate }}</div>
            <!-- <div class="list_fafangri">{{ item_2.reDate }}</div> -->
            <div class="list_meifennum">{{ item_2.unitProfit }}</div>
          </div>
        </div>
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
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
}

.list_item {
  width: 260px;
  border: 1px solid #ccc;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list_title {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #ccc;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.list_fundcode {
  width: 60px;
}

.list_fundname {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.list_main {
  flex: 1;
  width: 100%;
  overflow: auto;
}

.list_line {
  width: 100%;
  height: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding: 0 8px;
}

.list_dengjiri,
.list_fafangri {
  width: 35%;
  text-align: left;
}

.list_meifennum {
  width: 30%;
  text-align: right;
}

.list_del {
  width: 60px;
  background-color: #f0f0f0;
  text-align: center;
  color: red;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 10px;
  height: 26px;
  line-height: 26px;
}
</style>
