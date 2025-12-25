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
      name: '新发基金(天天基金)',
      adress: 'http://fund.eastmoney.com/data/xinfund.html',
    },
    {
      name: '基金主题(天天基金)',
      adress: 'https://fund.eastmoney.com/ztjj/'
    },
    {
      name: '理杏仁',
      adress: 'https://www.lixinger.com/'
    },
    {
      name: '集思录',
      adress: "https://www.jisilu.cn/data/idx_performance/#idx"
    },
    {
      name: "分红发放日(天天基金)",
      adress: "https://fund.eastmoney.com/data/fundfenhong.html#FFR,desc,1,,,"
    },
    {
      name: "热销基金(天天基金)",
      adress: "https://fund.eastmoney.com/fundhot8.html"
    }, {
      name: "全球资讯(天天基金)",
      adress: "https://kuaixun.eastmoney.com/7_24.html"
    }, {
      name: "财联社(行情面板)",
      adress: "https://www.cls.cn/quotation"
    }
  ]
});
if (localStorage.getItem('email') === '209392599@qq.com') {
  info.showBtn = true;
}

// 新增地址
const addUser = () => {
  console.log('sdfsf');
}
/*
<div class="flex pb-5" v-if="info.showBtn">
      <el-button type="primary" size="small" @click="addUser()">新增地址</el-button>
    </div>
*/
</script>

<template>
  <div class="page_wrapper flex flex-wrap gap-10">
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
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0 10px;
  // border-bottom: 1px dashed #ccc;

  a {
    text-decoration: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
