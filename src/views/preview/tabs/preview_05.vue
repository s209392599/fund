<script setup>
console.log('src/views/preview/tabs/preview_05.vue');

const info = reactive({
  showBtn: false,
  list: [
    {
      "code": "007467",
      "name": "华泰柏瑞中证红利低波ETF联接C",
      "short_name": "",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 30,
      "type": "红利"
    },
    {
      "code": "019260",
      "name": "富国恒生红利ETF联接A",
      "short_name": "",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 30,
      "type": "红利"
    },
    {
      "code": "020989",
      "name": "南方恒生科技指数发起(QDII)C",
      "short_name": "",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 30,
      "type": "红利"
    },
    {
      "code": "023918",
      "name": "华夏国证自由现金流ETF发起式联接C",
      "short_name": "",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 30,
      "type": "红利"
    },
    {
      "code": "018561",
      "name": "中信保诚多策略混合(LOF)C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 100,
      "type": "量化"
    },
    {
      "code": "020726",
      "name": "建信灵活配置混合C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 100,
      "type": "量化"
    },
    {
      "code": "002834",
      "name": "华夏新锦绣混合C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 100,
      "type": "量化"
    },
    {
      "code": "016858",
      "name": "国金量化多因子股票C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "量化"
    },
    {
      "code": "018729",
      "name": "华夏智胜新锐股票C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "量化"
    },
    {
      "code": "023350",
      "name": "诺安多策略混合C",
      "short_name": "",
      "zhang_url": "服务器监听",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "量化"
    },
    {
      "code": "023521",
      "name": "博时上证科创板人工智能ETF发起式联接C",
      "short_name": "",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "机器人"
    },
    {
      "code": "020973",
      "name": "易方达机器人ETF联接C",
      "short_name": "",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "机器人"
    },
    {
      "code": "017437",
      "name": "华宝纳斯达克精选股票发起式",
      "short_name": "",
      "zhang_url": "不提供",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "美股"
    },
    {
      "code": "016452",
      "name": "南方纳斯达克100指数发起",
      "short_name": "",
      "zhang_url": "不提供",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "",
      "fixed": 50,
      "type": "美股"
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
</script>

<template>
  <div class="page_wrapper">
    <a v-for="(item, index) in info.list" :key="index" target="_blank"
      :href="'http://fund.eastmoney.com/' + (item.code) + '.html?spm=aladin'" class="item">
      <img class="fundImg" :src="`https://j3.dfcfw.com/images/JJJZ12/${item.code}.png`" />
    </a>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  padding: 10px;
}

.item {
  display: inline-block;
  border: 1px solid #eee;
  margin: 5px;
  padding: 4px;
}
</style>
