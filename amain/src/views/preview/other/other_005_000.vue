<script setup>
console.log('amain/src/views/preview/other/other_005_000.vue');

const localKey = 'choice_zixun_list';
const info = reactive({
  urlframe: '',
  list: [
    {
      "infocode": "NW202602053642763595",
      "showtime": "今天 16:25",
      "simdigest": "【“走势扭转”！免税店大扩容 高增长潜力票曝光】周四，大消费延续走强态势，免税概念领涨，茂业商业、杭州解百等涨停，百大集团、广百股份等跟涨。",
      "from": "东方财富研究中心"
    },
    {
      "infocode": "NW202602053642753441",
      "showtime": "今天 16:19",
      "simdigest": "白酒行业龙头贵州茅台（600519.SH）股价迎来反弹。2月5日，贵州茅台股价盘中逆势拉升涨超2%，总市值时隔8个多月重新站上2万亿元关口。",
      "from": "界面新闻"
    },
  ]
})

const getData = async () => {
  info.list = [];
  const res = await server_fund_choice_zixun_app({});
  console.log('res', res);
  if (res.code === 200) {
    info.list = res.data;
    if (res.data.length > 0) {
      info.urlframe = res.data[0].infocode;
    }
  }
}

const newsClick = (item) => {
  info.urlframe = item.infocode;
}

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="page_wrapper flex">
    <div class="page_left">
      <div class="news_item" :class="{ 'active': info.urlframe.includes(item.infocode) }"
        v-for="(item, index) in info.list" :key="item.infocode" @click="newsClick(item)">
        <div class="news_title">{{ index + 1 }}. {{ item.simdigest }}</div>
        <div class="news_time">
          <span class="news_time_show">{{ item.showtime }}</span>
          <span class="news_time_from ml-10">{{ item.from }}</span>
        </div>
      </div>
    </div>

    <div class="page_right flex-1">
      <iframe :src="`https://choicew2z.eastmoney.com/info/information/detail.html?infocode=` + info.urlframe"
        width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: 100%;
  overflow: auto;
}

.page_left {
  width: 300px;
  border-right: 1px solid #ddd;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;

  .news_item {
    padding: 2px 5px;
    cursor: pointer;

    .news_title {
      font-size: 14px;
      line-height: 16px;
      color: #333;
    }

    .news_time {
      font-size: 12px;
      color: #999;
    }

    &:hover {
      background-color: #f4f4f4;
    }

    &.active {
      background-color: #ded4d4;
    }


  }
}
</style>
