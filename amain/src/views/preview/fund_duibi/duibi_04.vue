<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_04.vue');
import xiufu from './xiufu.json'
const info = reactive({
  // tableData: [],
  tableData: xiufu,
});

/*
https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=007467&disclosureType=1&activeIndex=4

https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"007467","pageNum":1,"pageSize":20,"channel":"9"}

得换一个历史净值的接口
*/

// if (localStorage.getItem('fund_duibi_arr')) {
//   info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
// } else {
//   localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
// }

// 存储基金信息
const saveFundInfoToLocalstorage = () => {
  let arr = info.tableData.map(v => {
    return {
      fund_code: v.fund_code,
      fund_name: v.fund_name,
      fund_type: v.fund_type,
    };
  });
  localStorage.setItem('fund_duibi_arr', JSON.stringify(arr));
};

const getList = async () => {
  for (let i = 0; i < info.tableData.length; i++) {
    const item = info.tableData[i];

    await server_fund_jd_HistoryNetValuePageInfo({
      fund_code: item.fund_code,
    }).then((res) => {
      console.log(res);
      /*
      {000009 货币型的可能没有
        "date": "2025-02-15",
        "netValue": "1.0000"
      },

      {
      "date": "2025-12-21",
      "weeklyYield": "1.0480",
      "tenThousandProfit": "0.2852"
    }


      {007467
        "date": "2024-09-09",
        "netValue": "1.4613",
        "dailyProfit": "-1.61",
        "totalNetValue": "1.6413"
      },
      */
      let obj_1 = res.data || {};
      let majorChartPointList = obj_1.majorChartPointList || [];
      let zheng = '-';
      if (majorChartPointList.length > 1) {
        let count = 0;
        for (let j = 1; j < majorChartPointList.length - 1; j++) {
          let obj_2 = majorChartPointList[j] || {};
          let obj_3 = majorChartPointList[j + 1] || {};
          let close_1 = parseFloat(obj_2.yAxis) || 0;
          let close_2 = parseFloat(obj_3.yAxis) || 0;
          if (close_1 > close_2) {
            count++;
          }
        }
        obj_1.zheng = (count / (majorChartPointList.length - 1) * 100).toFixed(2) + '%';
      }
      info.tableData[i] = {
        ...info.tableData[i],
        ...obj_1,
      };

      saveFundInfoToLocalstorage();
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  info.tableData.splice(index, 1);
  saveFundInfoToLocalstorage();
};

onMounted(() => {
  // getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div id="list_wrapper">
      <div class="list_item" v-for="(item, index) in info.tableData" :key="item.fund_code">

        <div class="list_top flex justify-between" style="margin: 0px;">
          <div class="">{{ item.fund_code }}</div>
          <div class="">{{ item.fund_type }}</div>
          <div class="list_del" @click="btn_line_1(item, index)">删除</div>
        </div>

        <div class="fund_name_box item_box flex justify-between items-center">
          <div class="truncate flex-1" :title="item.fund_name" style="font-size: 12px;;">{{ item.fund_name }}</div>
          <div class="pl-5">{{ item.establishmentCycleDesc }}</div>
        </div>

        <div class="item_box flex justify-between items-center">
          <div class="">最大回撤 {{ item.maxRetracementValue }}%</div>
          <div class="">正收益天数比率 {{ item.zheng }}</div>
          <div class="">修复天数 {{ item.restoreDay }}天</div>
        </div>

        <div class="item_box" style="margin: 10px 0px 0px 0px;">
          <Chart_xiufu_01 :data="item" class="stock_main" />
        </div>

      </div><!-- list_item -->
    </div><!-- list_wrapper -->
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 5px 0px 0px 0px;
  font-size: 12px;
}

#list_wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.list_item {
  position: relative;
  z-index: 2;
  width: 430px;
  min-width: 430px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f5f5f5;
  overflow: hidden;
}

.list_top {
  padding: 5px;
  margin: 10px 0px 0px 0px;
  background-color: #fff;
}

.fund_name_box {
  padding: 5px;
  margin: 10px 0px 0px 0px;
  background-color: #fff;
}

.list_del {
  cursor: pointer;
  color: red;
}

.item_box {
  margin: 10px 0px 10px 0px;
  background-color: #fff;
  padding: 5px;
}
</style>
