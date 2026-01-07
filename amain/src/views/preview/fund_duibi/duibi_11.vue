<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_11.vue');
const info = reactive({
  tableData: [],
});
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}
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

watch(() => info.tableData, (newVal, oldVal) => {
  nextTick(() => {
    saveFundInfoToLocalstorage();
  });
}, { deep: true });

// 删除基金
const btn_fn_01 = (fund_code) => {
  info.tableData = info.tableData.filter(v => v.fund_code !== fund_code);
};
// 去预览
const btn_fn_02 = (fund_code) => {
  window.open(`http://fund.eastmoney.com/${fund_code}.html?spm=aladin`, '_blank');
};
</script>

<template>
  <div class="page_wrapper">
    <div class="imgbox">
      <div v-for="(item, index) in info.tableData" :key="index" class="type_1">
        <img class="fundImg" :src="`https://j3.dfcfw.com/images/SYL1/${item.fund_code}.png`"
          @click.stop="btn_fn_02(item.fund_code)" />

        <el-button class="btn_del" type="warning" @click.stop="btn_fn_01(item.fund_code)">删除</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.imgbox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}


.type_1 {
  position: relative;
  z-index: 2;
  display: block;
  border: 1px solid #ddd;
  margin: 2px;
  height: 160px;
  width: calc(50% - 4px);

  img {
    width: 100%;
    height: 100%;
  }

  .btn_del {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
    display: none;
  }

  &:hover {
    .btn_del {
      display: block;
    }
  }
}

@media (min-width: 1440px) {
  .type_1 {
    width: calc(33.33% - 4px);
    height: 140px;
  }
}

@media (min-width: 1677px) {
  .type_1 {
    width: calc(25% - 4px);
    height: 140px;
  }
}
</style>
