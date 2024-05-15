<template>
  <div class="hello" style="padding:10px 0 0 0;">
    <!-- 业绩表现对比 -->
    <el-table :data="tableArr" stripe style="width: 100%" max-height="810" id="componentsFund02">
      <el-table-column fixed type="index" width="30"></el-table-column>
      <el-table-column prop="number" label="代号" min-width="57px"></el-table-column>
      <el-table-column fixed prop="name" label="基金名称" min-width="140px"></el-table-column>
      <el-table-column align="center" label="购买" min-width="40px">
        <template v-slot="{ row }">
          <span :style="{ color: getSetColor(row.status) }">{{ getSetStatus(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="建议" min-width="70px">
        <template v-slot="{ row }">
          <span :style="{ color: getAdviceColor(row.advice) }">{{ row.advice }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="end_date" label="日期" min-width="102px"></el-table-column>
      <el-table-column prop="unit_nav" label="净值" min-width="80px"></el-table-column>
      <el-table-column prop="unit_acc_nav" label="累计净值" min-width="80px"></el-table-column>
      <el-table-column prop="nav_grtd" label="日涨幅" min-width="80px"></el-table-column> -->

      <el-table-column label="历史平均收益率">
        <el-table-column prop="nav_grlty" align="right" label="6个月" min-width="60px">
          <template v-slot="{ row }"><span :class="getColor(row.avgRate_1)">{{ filterPercent(row.avgRate_1)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="nav_grlty" align="right" label="1年" min-width="60px">
          <template v-slot="{ row }"><span :class="getColor(row.avgRate_2)">{{ filterPercent(row.avgRate_2)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="nav_grlty" align="right" label="2年" min-width="60px">
          <template v-slot="{ row }"><span :class="getColor(row.avgRate_3)">{{ filterPercent(row.avgRate_3)
              }}</span></template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="历史盈利概率(持有两年)">
        <el-table-column prop="nav_grlty" align="right" label="10%以上" min-width="60px">
          <template v-slot="{ row }"><span :class="getColor(row.profitProbability_1)">{{
      filterPercent(row.profitProbability_1)
    }}</span></template>
        </el-table-column>
        <el-table-column prop="nav_grlty" align="right" label="5%~10%" min-width="60px">
          <template v-slot="{ row }"><span :class="getColor(row.profitProbability_2)">{{
      filterPercent(row.profitProbability_2)
    }}</span></template>
        </el-table-column>
        <el-table-column prop="nav_grlty" align="right" label="0%~5%" min-width="60px">
          <template v-slot="{ row }"><span :class="getColor(row.profitProbability_3)">{{
      filterPercent(row.profitProbability_3)
    }}</span></template>
        </el-table-column>
      </el-table-column>

      <el-table-column align="right" label="120天正收益比例" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.zheng_120)">{{ filterPercent(row.zheng_120)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="120天负收益<3%比例" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.down_3)">{{ filterPercent(row.down_3)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="周" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_0)">{{ filterPercent(row.jin_0)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="2周" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_9)">{{ filterPercent(row.jin_9)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="3周" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_10)">{{ filterPercent(row.jin_10)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="1月" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_1)">{{ filterPercent(row.jin_1)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="3月" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_2)">{{ filterPercent(row.jin_2)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="6月" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_3)">{{ filterPercent(row.jin_3)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="一年" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_4)">{{ filterPercent(row.jin_4)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="三年" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_5)">{{ filterPercent(row.jin_5)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="五年" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_6)">{{ filterPercent(row.jin_6)
            }}</span></template>
      </el-table-column>


      <el-table-column align="right" label="成立" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_8)">{{ filterPercent(row.jin_8)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="今年" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.jin_7)">{{ filterPercent(row.jin_7)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="近3年最大回撤" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.retracementValue)">{{ filterPercent(row.retracementValue)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="波动率(越小越好)" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.returnSd)">{{ filterPercent(row.returnSd)
            }}</span></template>
      </el-table-column>

      <el-table-column align="right" label="近3年净值修复天数" min-width="60px">
        <template v-slot="{ row }"><span :class="getColor(row.restoreDaysMap)">{{ row.restoreDaysMap
            }}</span></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Fund1',
  data() {
    return {
      fundURL: globalProperties.fundURL,
      tableArr: [],//基金信息
    }
  },
  created() {
    let arr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;
    // arr.length = 3;
    // console.log('arr', arr)
    //let arr = globalProperties.defaultArr;

    this.tableArr = arr.map((item, index) => {
      console.log(item);
      this.getFundHistoryPerformancePageInfo({//业绩表现
        number: item.number,
        index: index,
      });
      this.getAdvice({//诊断建议
        number: item.number,
        index: index,
      });
      this.getJingZhi({// 120天的净值
        number: item.number,
        index: index,
      })
      // 基金诊断
      this.getFundDiagnosisPageInfo({
        skuId: item.skuId,
        index: index,
      })

      return {
        number: item.number,
        name: item.name,
        status: item.status || '',
        end_date: '',//日期
        advice: '',//诊断建议(积极持有，持续观望)
        "jin_0": "",//周涨幅
        "jin_1": "",//近一月涨幅
        "jin_2": "",//近三月涨幅
        "jin_3": "",//近六月涨幅
        "jin_4": "",//近一年
        "jin_5": "",//近三年
        "jin_6": "",//近五年
        "jin_7": "",//今年以来
        "jin_8": "",//成立以来
        "jin_9": "",//近2周
        "jin_10": "",//近3周
        "zheng_120": "",//120天正收益比例
        "down_3": "",//120天负收益<3%比例
        "avgRate_1": '',// 历史平均收益率 -- 6个月
        "avgRate_2": '',// 历史平均收益率 -- 1年
        "avgRate_3": '',// 历史平均收益率 -- 2年
        "profitProbability_1": '',// 历史盈利概率 - 10%以上
        "profitProbability_2": '',// 历史盈利概率 - 5%~10%
        "profitProbability_3": '',// 历史盈利概率 - 0%~5%
        "retracementValue": '',// 基金诊断--近3年最大回撤
        "returnSd": '',// 基金诊断--波动率
        "restoreDaysMap": '',// 基金诊断--近3年净值修复天数

        "unit_nav": "",//净值
        "unit_acc_nav": "",//累计净值
        "nav_grtd": "",//日涨幅
        "srank_l1m": "",//近一月同类排名
        "srank_l3m": "",//近三月同类排名
        "srank_l6m": "",//近六月同类排名
        "srank_lty": "",//今年年以来培明
        "srank_l1y": "",//近一年排名
        "srank_l3y": "",//近三年排名
        "srank_l5y": "",//近五年排名
        "srank_base": "",//成立以来排名
        // "updated_at": +new Date(),//更新时间
        // "nav_growth": "",//
        // "fd_type": "",//
        // "aip_grl1y": "",//
        // "aip_grl2y": "",//
        // "aip_grl3y": "",//
        // "itg_aip_grl1y": "",//
        // "itg_aip_grl2y": "",//
        // "itg_aip_grl3y": "",//
        // "first_nav": "",//
      };
    })
  },
  methods: {
    getSetStatus(status) {
      console.log('status', status);
      if (!status) return '';
      if (status === "1") return '已买';
      if (status === "2") return '待移除';
      if (status === "3") return '待买';
      return '观察';
    },
    getSetColor(status) {
      console.log(240, 'status', status);
      if (status === "1") return '#ff6600';
      if (status === "2") return '#E6A23C';
      if (status === "3") return '#67C23A';
      return '#000000';
    },
    getAdvice(params) {//诊断建议，积极持有
      axios.get(`${this.fundURL}/advice/?code=${params.number}`)
        .then(res => {
          this.tableArr[params.index]["advice"] = res.data.advice || '';
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    getAdviceColor(str) {
      if (!str) return '';
      if (str.includes("积极持有")) {
        return '#ff801a'
      } else if (str.includes("谨慎持有")) {
        return '#44bf97'
      } else if (str.includes("持续观望")) {
        return 'yellowgreen'
      }
    },
    getColor(v) {
      if (!v) return '';
      if (Number(v) < 0) {
        return 'down'
      } else {
        return 'up';
      }
    },
    filterPercent(v) {
      if (!v) return '';
      return Number(v).toFixed(2) + "%";
      // let htmlClass = 'up';
      // if(Number(v) < 0) htmlClass = 'down';
      // return `<span class="${htmlClass}}">${Number(v).toFixed(2)}%</span>`;
    },
    getFundHistoryPerformancePageInfo(params) {
      axios.get(`${this.fundURL}/getFundHistoryPerformancePageInfo/?code=${params.number}`)
        .then(res => {
          let data = res.data || [];
          let obj_0 = data[0] || {};// 近1周
          let obj_1 = data[1] || {};// 近1月
          let obj_2 = data[2] || {};// 近3月
          let obj_3 = data[3] || {};// 近6月
          let obj_4 = data[4] || {};// 近1年
          let obj_5 = data[5] || {};// 近3年
          let obj_6 = data[6] || {};// 近5年
          let obj_7 = data[7] || {};// 今年以来
          let obj_8 = data[8] || {};// 成立以来

          this.tableArr[params.index]["jin_0"] = obj_0.rate || '';
          this.tableArr[params.index]["jin_1"] = obj_1.rate || '';
          this.tableArr[params.index]["jin_2"] = obj_2.rate || '';
          this.tableArr[params.index]["jin_3"] = obj_3.rate || '';
          this.tableArr[params.index]["jin_4"] = obj_4.rate || '';
          this.tableArr[params.index]["jin_5"] = obj_5.rate || '';
          this.tableArr[params.index]["jin_6"] = obj_6.rate || '';
          this.tableArr[params.index]["jin_7"] = obj_7.rate || '';
          this.tableArr[params.index]["jin_8"] = obj_8.rate || '';
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    getFundDiagnosisPageInfo(params) {
      axios.get(`${this.fundURL}/getFundDiagnosisPageInfo/?skuid=${params.skuId}`, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          let obj = res.data;
          console.log(238, obj);

          var avgRate = obj.avgRateList || {};
          this.tableArr[params.index]["avgRate_1"] = (avgRate[0] || {}).value || '';// 历史平均收益率 -- 6个月
          this.tableArr[params.index]["avgRate_2"] = (avgRate[1] || {}).value || '';// 历史平均收益率 -- 1年
          this.tableArr[params.index]["avgRate_3"] = (avgRate[2] || {}).value || '';// 历史平均收益率 -- 2年

          var profitProbability = obj.profitProbability || [];
          var dataProfit = profitProbability[2] || {};
          var probabilityIntervals = dataProfit.probabilityIntervals || [];
          this.tableArr[params.index]["profitProbability_1"] = (probabilityIntervals[0] || {}).value || '';// 历史盈利概率 - 10%以上
          this.tableArr[params.index]["profitProbability_2"] = (probabilityIntervals[1] || {}).value || '';// 历史盈利概率 - 5%~10%
          this.tableArr[params.index]["profitProbability_3"] = (probabilityIntervals[2] || {}).value || '';// 历史盈利概率 - 0%~5%

          var maxRetracement = obj.maxRetracement || {};
          console.log(`fund05.vue 315 [maxRetracement]`, maxRetracement);
          this.tableArr[params.index]["retracementValue"] = maxRetracement.retracementValue || '';// 近3年最大回撤

          var returnSd = obj.returnSd || {};
          this.tableArr[params.index]["returnSd"] = returnSd.value || '';// 波动率

          var restoreDaysMap = obj.restoreDaysMap || {};
          this.tableArr[params.index]["restoreDaysMap"] = restoreDaysMap.value || '';// 3年净值修复天数
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    getJingZhi(params) {
      axios.get(`${this.fundURL}/obtainNetWorth/?code=${params.number}&size=120&page=1`, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          let arr = res.data;
          console.log(`fund05.vue 234 [arr]`, arr);
          if (arr.length) {
            let num0 = Number(arr[0]["totalNetValue"]);
            let num10 = Number(arr[10]["totalNetValue"]);
            this.tableArr[params.index]["jin_9"] = ((num0 - num10) / num10 * 100).toFixed(2) || '';// 近2周

            let num15 = Number(arr[15]["totalNetValue"]);
            this.tableArr[params.index]["jin_10"] = ((num0 - num15) / num15 * 100).toFixed(2);// 近3周

            let earnNum = 0;
            let down_3 = 0;
            arr.forEach((item, index) => {
              if (parseFloat(item.dailyProfit || 0) >= 0) {// 正收益比率
                earnNum++;
              }
              if (parseFloat(item.dailyProfit || 0) <= -3) {// 正收益比率
                down_3++;
              }
            })
            this.tableArr[params.index]["zheng_120"] = (earnNum * 100 / arr.length).toFixed(2);// 120天正收益比例
            this.tableArr[params.index]["down_3"] = (down_3 * 100 / arr.length).toFixed(2);// 120天负收益<3%比例
          }
        })
        .catch(err => {
          console.log("err", err);
        })
    },
  }
};
</script>

<style scoped>
.fundImg {
  width: 352px;
  /* 440px */
  height: 277px;
}
</style>

<style>
#componentsFund02 td,
#componentsFund02 th {
  padding: 2px 0 !important;
}

.cell {
  padding: 0 2px !important;
}

.up {
  color: #ff6600;
}

.down {
  color: #0FA578;
}

.el-table__body tr.hover-row.el-table__row--striped>td,
.el-table__body tr.hover-row>td {
  background-color: #e0e2e8;
  color: #303133;
}

.el-table__body tr.hover-row.el-table__row--striped>td.el-table__cell,
.el-table__body tr.hover-row>td.el-table__cell {
  background-color: #e0e2e8;
}
</style>
