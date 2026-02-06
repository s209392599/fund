<script setup>
/* 综合信息 */
console.log('amain/src/views/preview/tabs/preview_20.vue');

const info = reactive({
  kanpan: {
    "market_degree": "34",// 市场热度
    "shsz_balance": "3279亿",// 两市成交额
    "shsz_balance_change_px": "-594亿",// 较上一日
    "preview_balance": "2.17万亿",// 今日量能预测
    "preview_balance_change_px": "-3068亿",// 较上一日
    "up_ratio": "88.00%",// 封板率
    "up_ratio_num": "14",// 封板
    "up_open_num": "2",// 触及
    "performance": "0.67%",// 昨涨停今表现
    "up_open_ratio": "40%",// 高开率
    "profit_ratio": "43%",// 获利率
    "up_down_dis": {
      "status": true,
      "suspend_num": 12,// 停牌
      "up_num": 20,// 涨停
      "down_num": 8,// 跌停
      "rise_num": 2198,// 上涨
      "fall_num": 3052,// 下跌
      "flat_num": 229,// 持平
      "down_10": 10,// 小于-8%
      "down_8": 27,// -8%
      "down_6": 96,// -6%
      "down_4": 420,// -4%
      "down_2": 2499,// -2%
      "up_2": 1888,// +2%
      "up_4": 211,// +4%
      "up_6": 59,// +6%
      "up_8": 12,// +8%
      "up_10": 28,// 大于+8%
    },
  },// 看盘信息
  // 主力流入
  zhuliuInObj: [
    {
      "secu_name": "平潭发展",
      "secu_code": "sz000592",
      "last_px": 11.83,
      "change": 0.1005,
      "main_fund_diff": 1136239673
    },
    {
      "secu_name": "中际旭创",
      "secu_code": "sz300308",
      "last_px": 570.9,
      "change": 0.0195,
      "main_fund_diff": 665543951
    },
    {
      "secu_name": "N北芯-U",
      "secu_code": "sh688712",
      "last_px": 49.92,
      "change": 1.8493,
      "main_fund_diff": 510031539
    },
    {
      "secu_name": "网宿科技",
      "secu_code": "sz300017",
      "last_px": 17.86,
      "change": 0.0682,
      "main_fund_diff": 503513272
    },
    {
      "secu_name": "二六三",
      "secu_code": "sz002467",
      "last_px": 7.34,
      "change": 0.1004,
      "main_fund_diff": 419389797
    },
    {
      "secu_name": "工业富联",
      "secu_code": "sh601138",
      "last_px": 54.15,
      "change": 0.0139,
      "main_fund_diff": 408231104
    },
    {
      "secu_name": "贵州茅台",
      "secu_code": "sh600519",
      "last_px": 1536.02,
      "change": 0.0072,
      "main_fund_diff": 357740328
    },
    {
      "secu_name": "遥望科技",
      "secu_code": "sz002291",
      "last_px": 9.04,
      "change": 0.0998,
      "main_fund_diff": 350435340
    },
    {
      "secu_name": "光线传媒",
      "secu_code": "sz300251",
      "last_px": 20.71,
      "change": 0.0832,
      "main_fund_diff": 331043492
    },
    {
      "secu_name": "海峡创新",
      "secu_code": "sz300300",
      "last_px": 13.97,
      "change": 0.1545,
      "main_fund_diff": 294127437
    }
  ],
  // 主力流出
  zhuliuOutObj: [
    {
      "secu_name": "紫金矿业",
      "secu_code": "sh601899",
      "last_px": 37.07,
      "change": -0.0534,
      "main_fund_diff": -1865263715
    },
    {
      "secu_name": "特变电工",
      "secu_code": "sh600089",
      "last_px": 27.85,
      "change": -0.043,
      "main_fund_diff": -1281951958
    },
    {
      "secu_name": "新易盛",
      "secu_code": "sz300502",
      "last_px": 390.9,
      "change": -0.0208,
      "main_fund_diff": -1143704173
    },
    {
      "secu_name": "洛阳钼业",
      "secu_code": "sh603993",
      "last_px": 21.98,
      "change": -0.0714,
      "main_fund_diff": -975991730
    },
    {
      "secu_name": "隆基绿能",
      "secu_code": "sh601012",
      "last_px": 18.31,
      "change": -0.0518,
      "main_fund_diff": -906126084
    },
    {
      "secu_name": "山子高科",
      "secu_code": "sz000981",
      "last_px": 4.85,
      "change": -0.0564,
      "main_fund_diff": -848896986
    },
    {
      "secu_name": "TCL中环",
      "secu_code": "sz002129",
      "last_px": 10.65,
      "change": 0.0076,
      "main_fund_diff": -782569284
    },
    {
      "secu_name": "金风科技",
      "secu_code": "sz002202",
      "last_px": 25.03,
      "change": -0.0825,
      "main_fund_diff": -760588104
    },
    {
      "secu_name": "蓝色光标",
      "secu_code": "sz300058",
      "last_px": 19.75,
      "change": -0.0271,
      "main_fund_diff": -664573865
    },
    {
      "secu_name": "阳光电源",
      "secu_code": "sz300274",
      "last_px": 146.23,
      "change": -0.0397,
      "main_fund_diff": -652491572
    }
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
        <div class="list_item_content">
          <div class="list_item_row flex items-center gap-10 justify-between">
            <div class="list_item_row_title">股票</div>
            <div class="list_item_row_content text-right">最新价</div>
            <div class="list_item_row_content text-right">涨跌幅</div>
            <div class="list_item_row_content text-right">主力流入</div>
          </div>

          <div class="list_item_row flex items-center gap-10 justify-between" v-for="item in info.zhuliuInObj">
            <div class="list_item_row_title" :title="item.secu_code">{{ item.secu_name }}</div>
            <div class="list_item_row_content text-right">{{ item.last_px }}</div>
            <div class="list_item_row_content text-right">{{ item.change }}</div>
            <div class="list_item_row_content text-right">{{ toBillion(item.main_fund_diff) }}</div>
          </div>
        </div>
      </div>

      <!-- 主力流出榜 -->
      <div class="list_item_box">
        <div class="list_item_title">主力流出榜</div>
        <div class="list_item_content">
          <div class="list_item_row flex items-center gap-10 justify-between">
            <div class="list_item_row_title">股票</div>
            <div class="list_item_row_content text-right">最新价</div>
            <div class="list_item_row_content text-right">涨跌幅</div>
            <div class="list_item_row_content text-right">主力流出</div>
          </div>

          <div class="list_item_row flex items-center gap-10 justify-between" v-for="item in info.zhuliuOutObj">
            <div class="list_item_row_title" :title="item.secu_code">{{ item.secu_name }}</div>
            <div class="list_item_row_content text-right">{{ item.last_px }}</div>
            <div class="list_item_row_content text-right">{{ item.change }}</div>
            <div class="list_item_row_content text-right">{{ toBillion(item.main_fund_diff) }}</div>
          </div>
        </div>
      </div>

      <div class="list_item_box"></div>

      <div class="list_item_box"></div>
      <div class="list_item_box"></div>

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
</style>
