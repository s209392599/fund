<script setup>
/* 指数中心 */
console.log('src/views/preview/tabs/preview_18.vue');
/*
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000001 上证指数
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=0.399001 深证成指
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000300 沪深300
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=100.HSI 恒生指数
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=100.NDX 纳斯达克
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=0.399006 创业板指数
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000680 科创综指
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000016 上证50
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000688 科创50
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=0.899050 北证50
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000510 中证A500
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=2.932000 中证2000
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=1.000012 国债指数
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RSINDEX&nid=101.GC00Y COMEX黄金
https://webquotepic.eastmoney.com/GetPic.aspx?id=899001_TB&imageType=FFRS&type=FFR 净流出
*/

const pre_now = `https://webquotepic.eastmoney.com/GetPic.aspx?`;

// https://data.eastmoney.com/bkzj/hy.html  资金流入流出在这里找基金号


// https://webquotepic.eastmoney.com/GetPic.aspx?nid=90.BK1033&imageType=rs 电池涨幅
// https://webquotepic.eastmoney.com/GetPic.aspx?nid=90.BK1033&imagetype=FFRS&type=ffr 电池主力净流入
// https://webquotepic.eastmoney.com/GetPic.aspx?nid=90.BK1033&imagetype=FFRS1&type=ffr


const info = reactive({
  list: [
    {
      name: '上证指数',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000001', // 今日涨幅
    },
    {
      name: '深证成指',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=0.399001', // 今日涨幅
    },
    {
      name: '沪深300',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000300', // 今日涨幅
    },
    {
      name: '港股通央企红利',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=2.931233', // 今日涨幅
    },
    {
      name: '中证红利',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000922', // 今日涨幅
    },
    {
      name: '恒生指数',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=100.HSI', // 今日涨幅
    },
    {
      name: '恒生科技指数',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=124.HSTECH', // 今日涨幅
    },
    {
      name: '纳斯达克',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=100.NDX', // 今日涨幅
    },
    {
      name: '创业板指数',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=0.399006', // 今日涨幅
    },
    {
      name: '科创综指',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000680', // 今日涨幅
    },
    {
      name: '上证50',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000016', // 今日涨幅
    },
    {
      name: '科创50',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000688', // 今日涨幅
    },
    {
      name: '北证50',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=0.899050', // 今日涨幅
    },
    {
      name: '中证A500',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000510', // 今日涨幅
    },
    {
      name: '中证2000',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=2.932000', // 今日涨幅
    },
    {
      name: '国债指数',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=1.000012', // 今日涨幅
    },
    {
      name: '黄金',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=101.GC00Y', // 今日涨幅
    },
    {
      name: '净流出',
      zhang_now: pre_now + 'id=899001_TB&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '上证指数主力静流入',
      zhang_now: pre_now + 'nid=1.000001&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '深证成指主力静流入',
      zhang_now: pre_now + 'nid=0.399001&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '沪深300主力静流入',
      zhang_now: pre_now + 'nid=1.000300&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '上证50主力静流入',
      zhang_now: pre_now + 'nid=1.000016&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '科创50主力静流入',
      zhang_now: pre_now + 'nid=1.000688&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '中证A500主力静流入',
      zhang_now: pre_now + 'nid=1.000510&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '北证50主力静流入',
      zhang_now: pre_now + 'nid=0.899050&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '创业板主力静流入',
      zhang_now: pre_now + 'nid=0.399006&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '半导体主力静流入',
      zhang_now: pre_now + 'nid=90.BK1036&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '电池今日涨幅',
      zhang_now: pre_now + 'nid=90.BK1033&imageType=rs', // 今日涨幅
    },
    {
      name: '电池主力静流入',
      zhang_now: pre_now + 'nid=90.BK1033&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '人形机器人主力静流入',
      zhang_now: pre_now + 'nid=90.BK1184&imageType=FFRS&type=FFR', // 今日涨幅
    },
    {
      name: '日经225',
      zhang_now: pre_now + 'imageType=RSINDEX&nid=100.N225', // 今日涨幅
    },
  ],
});
</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="main_box">
      <!-- 上证指数 -->
      <div class="list_item flex flex-col items-center" v-for="item in info.list" :key="item.name">
        <img class="list_img" :src="item.zhang_now" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.list_item {
  border: 1px solid #b39c9c;
  border-radius: 4px;
  padding: 8px;
  overflow: hidden;

  .list_img {
    width: 190px;
    max-width: 100%;
  }
}
</style>
