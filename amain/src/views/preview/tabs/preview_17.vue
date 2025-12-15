<script setup>
/* 指数中心 */
console.log('src/views/preview/tabs/preview_17.vue');
/*
https://quote.eastmoney.com/center/  行情中心
https://quote.eastmoney.com/center/hszs.html

恒生指数：
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&nid=100.HSI
上证指数：
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=1.000001
https://quote.eastmoney.com/zs000001.html#fullScreenChart  上证指数全屏版
https://webquoteklinepic.eastmoney.com/GetPic.aspx?imageType=KXL&nid=1.000001 成交量
北证50：
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=0.899050
创业板指数：
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=0.399006
https://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=0.399006&imageType=KXL
科创50：
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=1.000688
https://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=1.000688&imageType=KXL

股票：
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=0.000001
https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&nid=0.002074
两市资金流向：
https://webquotepic.eastmoney.com/GetPic.aspx?id=899001_TB&imageType=FFRS&type=FFR

https://webquotepic.eastmoney.com/GetPic.aspx?imageType=RS4UI&nid=100.HSCEI  国企指数
来源：https://quote.eastmoney.com/gb/zsHSI.html



*/

const pre_now = `https://webquotepic.eastmoney.com/GetPic.aspx?`;
const pre_his = `https://webquoteklinepic.eastmoney.com/GetPic.aspx?`;

const info = reactive({
  list: [
    {
      name: '上证指数',
      zhang_now: pre_now + 'imageType=r&nid=1.000001', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=1.000001', // 历史涨幅
    },
    {
      name: '深成指数',
      zhang_now: pre_now + 'imageType=r&nid=0.399001', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=0.399001', // 历史涨幅
    },
    {
      name: '恒生指数',
      zhang_now: pre_now + 'imageType=r&nid=100.HSI', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=100.HSI', // 历史涨幅
    },
    {
      name: '纳斯达克指数',
      zhang_now: pre_now + 'imageType=r&nid=100.NDX', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=100.NDX', // 历史涨幅
    },
    {
      name: '创业板指',
      zhang_now: pre_now + 'imageType=r&nid=0.399006', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=0.399006', // 历史涨幅
    },
    {
      name: '科创50',
      zhang_now: pre_now + 'imageType=r&nid=1.000688', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=1.000688', // 历史涨幅
    },
    {
      name: '北证50',
      zhang_now: pre_now + 'imageType=r&nid=0.899050', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=0.899050', // 历史涨幅
    },
    {
      name: '中证A500',
      zhang_now: pre_now + 'imageType=r&nid=1.000510', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=1.000510', // 历史涨幅
    },
    {
      name: '国企指数',
      zhang_now: pre_now + 'imageType=r&nid=1.000012', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=1.000012', // 历史涨幅
    },
    {
      name: '黄金',
      zhang_now: pre_now + 'imageType=r&nid=101.GC00Y', // 今日涨幅
      zhang_history: pre_his + 'imageType=KXL&formula=BOLL&nid=101.GC00Y', // 历史涨幅
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
        <img class="list_img" :src="item.zhang_history" />
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
    width: 320px;
    max-width: 100%;
  }
}
</style>
