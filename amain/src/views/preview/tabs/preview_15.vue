<script setup>
// 历史净值
console.log('amain/src/views/preview/tabs/preview_15.vue');

const info = reactive({
  tableData: [],
});
// 获取-列表数据
const query_list = () => {
  setTimeout(() => {
    server_fund_table_query_by_user({
      fund_user_id: localStorage.getItem('user_id'),
    }).then((res) => {
      console.log('res', res);
      if (res.code === 200) {
        info.tableData = res.data || [];
      } else {
        ElMessage.error('获取列表失败，请重试！');
      }
    });
  }, 300);
};
query_list();
</script>

<template>
  <div class="page_wrapper">
    <div class="imgbox">
      <a v-for="(item, index) in info.tableData" :key="index" target="_blank" :href="'http://fund.eastmoney.com/' + item.fund_code + '.html?spm=aladin'
        " class="type_1">
        <img class="fundImg" :src="`https://j3.dfcfw.com/images/RANK1/${item.fund_code}.png`" />
      </a>
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
  display: block;
  border: 1px solid #ddd;
  margin: 2px;
  height: 160px;
  width: calc(50% - 4px);
}

.type_1 img {
  width: 100%;
  height: 100%;
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
