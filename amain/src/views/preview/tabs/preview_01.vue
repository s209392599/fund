<script setup>
console.log('src/views/preview/tabs/preview_01.vue');
// 涨幅预览  这个要里面要做收益预估
const info = reactive({
  tableData: []
});
// 获取-列表数据
const query_list = () => {
  setTimeout(() => {
    server_fund_amain_fund_query_by_user({
      fund_user_id: localStorage.getItem('user_id')
    }).then(res => {
      console.log('res', res);
      if (res.code === 200) {
        info.tableData = res.data.data || [];
      } else {
        ElMessage.error('获取列表失败，请重试！');
      }
    })
  }, 300);
}
query_list();

</script>

<template>
  <div class="page_wrapper">
    <!-- 图片 -->
    <div class="img-box">
      <template v-for="item in info.tableData" :key="item.id"> <!-- 推荐添加 :key -->
        <template v-if="item.fund_sign === '正常' && item.zhang_url?.startsWith('http')">
          <a class="type_1" :href="`https://fund.eastmoney.com/${item.fundcode}.html`" target="_blank">
            <img :src="item.zhang_url" :alt="item.fund_name">
          </a>
        </template>
      </template>
    </div>

    <!-- 文字提示 -->
    <div class="notion-box"></div>

    <!-- 表格展示区 -->
    <div class="table-box"></div>
  </div>
</template>

<style scoped lang="scss">
.img-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.type_1 {
  display: block;
  border: 1px solid #ddd;
  margin: 2px;
  height: 120px;
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

.lianghua_line {
  padding: 5px 0;
}

.color-red {
  color: red;
}

.color-green {
  color: #090;
}

.el-table .cell {
  padding: 0 5px !important;
}

.el-table .el-table__cell {
  padding: 2px 0;
}

.el-table .caret-wrapper {
  width: 15px;
  position: relative;
  left: -6px;
}

.fund_type {
  position: absolute;
  right: 0px;
  background-color: red;
  color: #fff;
  padding: 0px 3px;
  border-radius: 4px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  top: 2px;
}

.fund_name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
