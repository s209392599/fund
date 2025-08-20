<script setup>
console.log('src/views/preview/tabs/preview_10.vue');

const info = reactive({
  showBtn: false,
  list: [
    {
      name: '阿里云函数计算控制台',
      adress: 'https://fc.console.aliyun.com/fc/service/cn-shanghai/fund/functions'
    },
    {
      name: '腾讯云宝塔面板',
      adress: 'https://150.158.175.108:60001/tencentcloud'
    },
    {
      name: '天天基金可转债排行',
      adress: 'http://fund.eastmoney.com/data/fundranking.html#tzq;c0;r;s6yzf;pn50;ddesc;qsd20201027;qed20211027;qdii;zq045;gg;gzbd;gzfs;bbzt;sfbb',
    },
    {
      name: '天天基金-基金对比',
      adress: 'http://fund.eastmoney.com/Compare/'
    },
    {
      name: '大盘云图',
      adress: 'https://summary.jrj.com.cn/dataCenter/dpyt/',
    },
    {
      name: '韭圈儿-基金对比',
      adress: 'https://www.funddb.cn/fund/fund_pk',
    },
    {
      name: '新发基金',
      adress: 'http://fund.eastmoney.com/data/xinfund.html',
    },
  ]
});

</script>

<template>
  <div class="page_wrapper">


    <div v-for="(item, index) in info.list" :key="index" class="nav_item">
      <a :href="item.adress" target="_blank">{{ item.name }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  padding: 10px;
}
</style>
