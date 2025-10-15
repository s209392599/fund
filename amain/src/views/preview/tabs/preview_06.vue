<script setup>
console.log('src/views/preview/tabs/preview_06.vue');

const info = reactive({
  showBtn: false,
  list: [
    {
      name: '大盘云图',
      adress: 'https://summary.jrj.com.cn/dataCenter/dpyt/',
    },
    {
      name: 'A500云图',
      adress: 'https://52etf.site/',
    },
    {
      name: '天天基金云图',
      adress: 'https://quote.eastmoney.com/stockhotmap/',
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
      name: '韭圈儿-基金对比',
      adress: 'https://www.funddb.cn/fund/fund_pk',
    },
    {
      name: '新发基金',
      adress: 'http://fund.eastmoney.com/data/xinfund.html',
    },
    {
      name: '阿里云函数计算控制台',
      adress: 'https://fc.console.aliyun.com/fc/service/cn-shanghai/fund/functions'
    },
    {
      name: '腾讯云宝塔面板',
      adress: 'https://150.158.175.108:60001/tencentcloud'
    },
  ]
});
if (localStorage.getItem('email') === '209392599@qq.com') {
  info.showBtn = true;
}

// 新增地址
const addUser = () => {
  console.log('sdfsf');
}
</script>

<template>
  <div class="page_wrapper">
    <div class="flex pb-5" v-if="info.showBtn">
      <el-button type="primary" size="small" @click="addUser()">新增地址</el-button>
    </div>

    <div v-for="(item, index) in info.list" :key="index" class="nav_item">
      <a :href="item.adress" target="_blank">{{ item.name }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  padding: 10px;
}

.nav_item {
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  border-bottom: 1px dashed #ccc;

  a {
    // color: #000;
    text-decoration: none;
  }
}
</style>
