<script setup>
console.log('amain/src/views/preview/tabs/preview_04.vue');
import pLimit from 'p-limit';
// 请求控制器，用于取消请求
let abortController = null;

const info = reactive({
  tableData: [],
});

// 存储基金信息
const saveFundInfoToLocalstorage = () => {
  let arr = info.tableData.map(v => {
    return {
      fund_code: v.fund_code || '',
      fund_name: v.fund_name || '',
      fund_type: v.fund_type || '',
    };
  });
  localStorage.setItem('fund_duibi_arr', JSON.stringify(arr));
};
watch(() => info.tableData, () => {
  saveFundInfoToLocalstorage();
}, { deep: true });

const getHisData = async () => {
  // 取消之前的请求
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const { signal } = abortController;

  // 创建并发限制器，最多同时6个请求
  const limit = pLimit(6);


  const tasks = info.tableData.map((item, i) =>
    limit(async () => {
      // 检查是否已取消
      if (signal.aborted) return;

      let gz_arr = [];
      info.tableData[i].gszzl = '-';// 预测涨幅

      console.log(`开始请求 ${i + 1} - ${item.fund_code} - ${item.fund_name} 的数据...`);
      try {
        let res_1 = await server_fund_amain_getfundgz({
          fund_code: item.fund_code,
        });
        if (res_1.code === 200) {
          let obj = res_1.data || {};
          // console.log('obj', obj);
          /*
          {date: '2025-04-29', netValue: '1.0000', totalNetValue: '1.0000'}
          {
            "fund_code": "023918",
            "fund_name": "华夏国证自由现金流ETF发起式联接C",
            "gszzl": "0.68",
            "dwjz": "1.2468",
            "gsz": "1.2552",
            "gztime": "2026-01-09 15:00"
          }
          */
          let flag_1 = obj.hasOwnProperty('gztime') && obj.gztime !== '';
          let flag_2 = obj.hasOwnProperty('gsz') && obj.gsz !== '';
          let flag_3 = obj.hasOwnProperty('gszzl') && obj.gszzl !== '';
          if (flag_1 && flag_2 && flag_3) {
            let curDay = CustomDateFtt(new Date(), 'yyyy-MM-dd');
            gz_arr.push({
              date: curDay,
              netValue: obj.dwjz,
              totalNetValue: obj.gsz,
              gszzl: obj.gszzl,
            });

            // info.tableData[i].gszzl = Math.round(parseFloat(obj.gszzl) * 100 * 100) / 100;
            info.tableData[i].gszzl = parseFloat(obj.gszzl);
          }
        }
      } catch (e) {
      }

      await server_fund_jd_HistoryNetValuePageInfo({
        fund_code: item.fund_code,
        pageSize: 310, // 245 + 60
      }).then((res) => {
        let obj_1 = res.data || {};
        let majorChartPointList = obj_1.majorChartPointList || [];
        obj_1.zheng = '-';
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
          obj_1.zheng =
            ((count / (majorChartPointList.length - 1)) * 100).toFixed(2) + '%';
        }
        if (gz_arr.length > 0 && obj_1?.netValueList?.length > 0) {
          // 修正预测的累计净值
          let pre_totalNetValue = Number(obj_1.netValueList[obj_1.netValueList.length - 1].totalNetValue) * 10000;
          let gszzl = Number(gz_arr[gz_arr.length - 1].gszzl) * 100;
          let cur_totalNetValue = (pre_totalNetValue + gszzl) / 10000;
          gz_arr[gz_arr.length - 1].totalNetValue = cur_totalNetValue;

          obj_1.netValueList = obj_1.netValueList.concat(gz_arr);
        }
        info.tableData[i] = {
          ...info.tableData[i],
          ...obj_1,
        };

        // console.log('i', info.tableData[i]);
      });

    })
  );

  await Promise.all(tasks);
};


// 获取-列表数据
const query_list = () => {
  server_fund_table_query_by_user({
    fund_user_id: localStorage.getItem('user_id'),
  }).then((res) => {
    if (res.code === 200) {
      info.tableData = (res.data || []);
      getHisData();
    } else {
      ElMessage.error('获取列表失败，请重试！');
    }
  }).finally(() => {
  });
};
query_list();

onMounted(() => {
  query_list();
});

// 页面离开时取消所有请求
onBeforeUnmount(() => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
});
</script>

<template>
  <div class="page_wrapper">
    <div id="list_wrapper">
      <div class="list_item" v-for="(item, index) in info.tableData" :key="item.fund_code">
        <div class="list_top flex justify-between" style="margin: 0px">
          <div class="">
            <a :href="`https://fund.eastmoney.com/${item.fund_code}.html`" target="_blank"
              style="text-decoration: none">
              <span>{{ item.fund_code }}-{{ item.fund_name }}</span>
            </a>
          </div>
          <div class="">
            <span class="">{{ item.fund_type }}</span>
            <span class="pl-5">
              今日预测涨幅：
              <template v-if="item.gszzl !== '-'">
                <span v-if="item.gszzl >= 0" style="color: red;">{{ item.gszzl }}%</span>
                <span v-else style="color: #090;">{{ item.gszzl }}%</span>
              </template>
              <template v-else>-</template>
            </span>
          </div>
        </div>

        <div class="fund_name_box flex justify-between items-center">
          <div class="truncate flex-1" :title="item.fund_name" style="font-size: 12px"></div>
          <div class="pl-5">
          </div>
        </div>

        <div class="item_box">
          <Chart_jingzhi :data="item" class="stock_main" />
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
  width: calc(50% - 10px);
  min-width: calc(50% - 10px);
  height: auto;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f5f5f5;
  overflow: hidden;
}

/* 500px一个，超过1500放三个，2000放四个，2500放5个 */
@media screen and (min-width: 1500px) {
  .list_item {
    width: calc(33.33% - 10px);
    min-width: calc(33.33% - 10px);
  }
}

@media screen and (min-width: 2000px) {
  .list_item {
    width: calc(25% - 10px);
    min-width: calc(25% - 10px);
  }
}

@media screen and (min-width: 2500px) {
  .list_item {
    width: calc(20% - 10px);
    min-width: calc(20% - 10px);
  }
}


.list_top {
  padding: 5px 10px;
  background-color: #fff;
}

.fund_name_box {
  padding: 5px 10px;
  // margin: 10px 0px 0px 0px;
  background-color: #fff;
}

.item_box {
  // margin: 10px 0px 10px 0px;
  background-color: #fff;
  padding: 5px;
}
</style>
