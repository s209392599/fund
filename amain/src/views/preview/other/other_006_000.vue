<script setup>
console.log('amain/src/views/preview/other/other_006_000.vue');

const localKey = 'choice_zixun_list';
const info = reactive({
  urlframe: '',
  list: [
    {
      "seq": "674606528",
      "title": "GLP-1减重药成新“药王”，港股通医药ETF易方达涨1.10%",
      "ctime": "2026-02-06 11:35:45",
      "source": "财闻",
      "url": "http://news.10jqka.com.cn/m674606528_494/"
    },
    {
      "seq": "674606520",
      "title": "2026年将新增建设5G基站2.1万个，通信ETF银华涨1.02%",
      "ctime": "2026-02-06 11:35:28",
      "source": "财闻",
      "url": "http://news.10jqka.com.cn/m674606520_494/"
    },
  ]
})

const getData = async () => {
  info.list = [];
  const res = await server_fund_tonghusshun_news_app({});
  console.log('res', res);
  if (res.code === 200) {
    info.list = res.data;
    if (res.data.length > 0) {
      info.urlframe = res.data[0].url;
    }
  }
}

const newsClick = (item) => {
  info.urlframe = item.url;
}

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="page_wrapper flex">
    <div class="page_left">
      <div class="news_item" :class="{ 'active': info.urlframe.includes(item.url) }" v-for="(item, index) in info.list"
        :key="item.seq" @click="newsClick(item)">
        <div class="news_title">{{ index + 1 }}. {{ item.title }}</div>
        <div class="news_time">
          <span class="news_time_show">{{ item.ctime }}</span>
          <span class="news_time_from ml-10">{{ item.source }}</span>
        </div>
      </div>
    </div>

    <div class="page_right flex-1">
      <iframe :src="info.urlframe" width="100%" height="100%" frameborder="0"></iframe>
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

.page_right {
  max-width: 750px;
  border-right: 1px solid #ddd;
}
</style>
