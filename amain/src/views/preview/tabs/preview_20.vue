<script setup>
/* 综合信息 */
console.log('amain/src/views/preview/tabs/preview_20.vue');

const info = reactive({
  kanpan: {
    // "market_degree": "34",// 市场热度
    // "shsz_balance": "3279亿",// 两市成交额
    // "shsz_balance_change_px": "-594亿",// 较上一日
    // "preview_balance": "2.17万亿",// 今日量能预测
    // "preview_balance_change_px": "-3068亿",// 较上一日
    // "up_ratio": "88.00%",// 封板率
    // "up_ratio_num": "14",// 封板
    // "up_open_num": "2",// 触及
    // "performance": "0.67%",// 昨涨停今表现
    // "up_open_ratio": "40%",// 高开率
    // "profit_ratio": "43%",// 获利率
    // "up_down_dis": {
    //   "status": true,
    //   "suspend_num": 12,// 停牌
    //   "up_num": 20,// 涨停
    //   "down_num": 8,// 跌停
    //   "rise_num": 2198,// 上涨
    //   "fall_num": 3052,// 下跌
    //   "flat_num": 229,// 持平
    //   "down_10": 10,// 小于-8%
    //   "down_8": 27,// -8%
    //   "down_6": 96,// -6%
    //   "down_4": 420,// -4%
    //   "down_2": 2499,// -2%
    //   "up_2": 1888,// +2%
    //   "up_4": 211,// +4%
    //   "up_6": 59,// +6%
    //   "up_8": 12,// +8%
    //   "up_10": 28,// 大于+8%
    // },
  },// 看盘信息
  // 主力流入
  zhuliuInObj: [
    // {
    //   "secu_name": "平潭发展",
    //   "secu_code": "sz000592",
    //   "last_px": 11.83,
    //   "change": 0.1005,
    //   "main_fund_diff": 1136239673
    // },
  ],
  // 主力流出
  zhuliuOutObj: [
    // {
    //   "secu_name": "紫金矿业",
    //   "secu_code": "sh601899",
    //   "last_px": 37.07,
    //   "change": -0.0534,
    //   "main_fund_diff": -1865263715
    // },
  ],
});

const getKanPanData = async () => {
  info.kanpan = {};
  let res = await server_fund_cls_kanpan_app({});
  if (res.code === 200) {
    info.kanpan = res.data;
  }
};
// 主力流入
const getZhuliInData = async () => {
  let res = await server_fund_cls_zhuliu({});
  if (res.code === 200) {
    info.zhuliuInObj = res.data;
  }
};
// 主力流出
const getZhuliuOutData = async () => {
  let res = await server_fund_cls_zhuliu({
    main_fund_diff: 1
  });
  if (res.code === 200) {
    info.zhuliuOutObj = res.data;
  }
};

// 显示值
const ss = (val) => {
  if ([null, undefined, ''].includes(val)) {
    return '';
  } else {
    return val;
  }
};
// 转换为亿的单位
const toBillion = (val) => {
  if ([null, undefined, ''].includes(val)) {
    return '';
  } else {
    return (val / 100000000).toFixed(2) + '亿';
  }
};

onMounted(() => {
  getKanPanData();// 看盘数据
  getZhuliInData();// 主力流入
  getZhuliuOutData();// 主力流出
});


</script>

<template>
  <div class="page_wrapper">
    <div class="main_box">
      <div class="list_item_box">
        <div class="list_item_title">看盘</div>

        <div class="list_item_content">
          <div class="">市场热度：{{ ss(info.kanpan?.market_degree) }}</div>
          <div class="">
            <span class="">两市成交额：{{ ss(info.kanpan?.shsz_balance) }}</span>
            <span class="">({{ ss(info.kanpan?.shsz_balance_change_px) }})</span>
          </div>
          <div class="">
            <span class="">今日量能预测：{{ ss(info.kanpan?.preview_balance) }}</span>
            <span class="">({{ ss(info.kanpan?.preview_balance_change_px) }})</span>
          </div>
          <div class="">
            <span class="">封板率：{{ ss(info.kanpan?.up_ratio) }}</span>
            <span class="ml-10">封板({{ ss(info.kanpan?.up_ratio_num) }})</span>
            <span class="ml-10">触及({{ ss(info.kanpan?.up_open_num) }})</span>
          </div>
          <div class="">
            <span class="">昨涨停今表现：{{ ss(info.kanpan?.performance) }}</span>
            <span class="ml-10">高开率({{ ss(info.kanpan?.up_open_ratio) }})</span>
            <span class="ml-10">获利率({{ ss(info.kanpan?.profit_ratio) }})</span>
          </div>

          <div class="">
            <span class="">上涨({{ ss(info.kanpan?.up_down_dis?.rise_num) }})</span>
            <span class="ml-10">下跌({{ ss(info.kanpan?.up_down_dis?.fall_num) }})</span>
            <span class="ml-10">持平({{ ss(info.kanpan?.up_down_dis?.flat_num) }})</span>
          </div>

          <div class="">
            <span class="">涨停({{ ss(info.kanpan?.up_down_dis?.up_num) }})</span>
            <span class="ml-10">停牌({{ ss(info.kanpan?.up_down_dis?.suspend_num) }})</span>
            <span class="ml-10">跌停({{ ss(info.kanpan?.up_down_dis?.down_num) }})</span>
          </div>

          <div class="flex items-center gap-10 justify-between">
            <span class="">涨：2%({{ ss(info.kanpan?.up_down_dis?.up_2) }})</span>
            <span class="">4%({{ ss(info.kanpan?.up_down_dis?.up_4) }})</span>
            <span class="">6%({{ ss(info.kanpan?.up_down_dis?.up_6) }})</span>
            <span class="">8%({{ ss(info.kanpan?.up_down_dis?.up_8) }})</span>
            <span class="">大8({{ ss(info.kanpan?.up_down_dis?.up_10) }})</span>
          </div>

          <div class="flex items-center gap-10 justify-between">
            <span class="">跌：2%({{ ss(info.kanpan?.up_down_dis?.down_2) }})</span>
            <span class="">4%({{ ss(info.kanpan?.up_down_dis?.down_4) }})</span>
            <span class="">6%({{ ss(info.kanpan?.up_down_dis?.down_6) }})</span>
            <span class="">8%({{ ss(info.kanpan?.up_down_dis?.down_8) }})</span>
            <span class="">小8({{ ss(info.kanpan?.up_down_dis?.down_10) }})</span>
          </div>
        </div>
      </div>

      <!-- 主力流入榜 -->
      <div class="list_item_box ">
        <div class="list_item_title">主力流入榜</div>
        <div class="list_item_content line_liuru">
          <div class="list_item_row flex items-center gap-10 justify-between">
            <div class="list_item_row_title line_liuru_1">股票</div>
            <div class="list_item_row_content text-right line_liuru_2">最新价</div>
            <div class="list_item_row_content text-right line_liuru_3">涨跌幅</div>
            <div class="list_item_row_content text-right line_liuru_4">主力流入</div>
          </div>

          <div class="list_item_row flex items-center gap-10 justify-between" v-for="item in info.zhuliuInObj">
            <div class="list_item_row_title line_liuru_1" :title="item.secu_code">{{ item.secu_name }}</div>
            <div class="list_item_row_content text-right line_liuru_2">{{ item.last_px }}</div>
            <div class="list_item_row_content text-right line_liuru_3">{{ item.change }}</div>
            <div class="list_item_row_content text-right line_liuru_4">{{ toBillion(item.main_fund_diff) }}</div>
          </div>
        </div>
      </div>

      <!-- 主力流出榜 -->
      <div class="list_item_box">
        <div class="list_item_title">主力流出榜</div>
        <div class="list_item_content line_liuru">
          <div class="list_item_row flex items-center gap-10 justify-between">
            <div class="list_item_row_title line_liuru_1">股票</div>
            <div class="list_item_row_content text-right line_liuru_2">最新价</div>
            <div class="list_item_row_content text-right line_liuru_3">涨跌幅</div>
            <div class="list_item_row_content text-right line_liuru_4">主力流出</div>
          </div>

          <div class="list_item_row flex items-center gap-10 justify-between" v-for="item in info.zhuliuOutObj">
            <div class="list_item_row_title line_liuru_1" :title="item.secu_code">{{ item.secu_name }}</div>
            <div class="list_item_row_content text-right line_liuru_2">{{ item.last_px }}</div>
            <div class="list_item_row_content text-right line_liuru_3">{{ item.change }}</div>
            <div class="list_item_row_content text-right line_liuru_4">{{ toBillion(item.main_fund_diff) }}</div>
          </div>
        </div>
      </div>

      <!-- <div class="list_item_box"></div>

      <div class="list_item_box"></div>

      <div class="list_item_box"></div> -->

    </div>
  </div>
</template>

<style scoped lang="scss">
.main_box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.list_item_box {
  display: flex;
  flex-direction: column;
  padding: 5px;
  overflow: hidden;

  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

@media screen and (max-width: 1920px) {
  .list_item_box {
    width: 33.33%;
  }
}

@media screen and (max-width: 1768px) {
  .list_item_box {
    width: 50%;
  }
}

@media screen and (max-width: 1499px) {
  .list_item_box {
    width: 50%;
  }
}

@media screen and (max-width: 768px) {
  .list_item_box {
    width: 100%;
  }
}

.list_item_title {
  height: 28px;
  line-height: 28px;
  font-size: 22px;
  font-weight: bold;
  text-indent: 10px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 4px;
    background: #f00;
    position: absolute;
    left: 0;
    top: 2px;
    height: 24px;
  }
}

.list_item_content {
  flex: 1;
}

.line_liuru {
  .list_item_row {
    .line_liuru_1 {
      width: 100px;
    }

    .line_liuru_2 {
      width: 80px;
      padding: 0 5px;
      text-align: right;
    }

    .line_liuru_3 {
      width: 80px;
      padding: 0 5px;
      text-align: right;
    }

    .line_liuru_4 {
      width: 90px;
      padding: 0 5px;
      text-align: right;
    }

    .list_item_row_title,
    .list_item_row_content {
      border-right: 1px solid #ccc;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }

    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>
