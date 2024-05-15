<template>
  <div class="hello" style="padding:10px 0 0 0;">
    <!-- 业绩表现对比 -->
    <el-table :data="tableArr" stripe style="width: 100%" max-height="810" id="componentsFund02">
      <el-table-column fixed type="index" width="30"></el-table-column>
      <el-table-column prop="number" label="代号" min-width="57px"></el-table-column>
      <el-table-column fixed prop="name" label="基金名称" min-width="200px"></el-table-column>
      <!-- <el-table-column prop="end_date" label="日期" min-width="102px"></el-table-column>
      <el-table-column prop="unit_nav" label="净值" min-width="80px"></el-table-column>
      <el-table-column prop="unit_acc_nav" label="累计净值" min-width="80px"></el-table-column>
      <el-table-column prop="nav_grtd" label="日涨幅" min-width="80px"></el-table-column> -->

      <el-table-column align="center" label="建议" min-width="70px">
        <template v-slot="{ row }">
          <span :style="{ color: getAdviceColor(row.advice) }">{{ row.advice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" label="周涨幅" min-width="66px">
        <template v-slot="{ row }"><span :class="getColor(row.nav_grl1w)">{{ filterPercent(row.nav_grl1w)
            }}</span></template>
      </el-table-column>

      <el-table-column label="近一个月">
        <el-table-column prop="nav_grl1m" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grl1m)">{{ filterPercent(row.nav_grl1m)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_l1m" align="right" label="同类排名" min-width="80px"></el-table-column>
      </el-table-column>

      <el-table-column label="近三个月">
        <el-table-column prop="nav_grl3m" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grl3m)">{{ filterPercent(row.nav_grl3m)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_l3m" align="right" label="同类排名" min-width="80px"></el-table-column>
      </el-table-column>

      <el-table-column label="今年以来">
        <el-table-column prop="nav_grlty" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grlty)">{{ filterPercent(row.nav_grlty)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_lty" align="right" label="同类排名" min-width="80px"></el-table-column>
      </el-table-column>

      <el-table-column label="近一年">
        <el-table-column prop="nav_grl1y" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grl1y)">{{ filterPercent(row.nav_grl1y)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_l1y" align="right" label="同类排名" min-width="80px"></el-table-column>
      </el-table-column>

      <el-table-column label="近两年">
        <el-table-column prop="nav_grl2y" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grl2y)">{{ filterPercent(row.nav_grl2y)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_l6m" align="right" label="同类排名" min-width="100px"></el-table-column>
      </el-table-column>

      <el-table-column label="近三年">
        <el-table-column prop="nav_grl3y" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grl3y)">{{ filterPercent(row.nav_grl3y)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_l3y" align="right" label="同类排名" min-width="100px"></el-table-column>
      </el-table-column>

      <el-table-column label="近五年">
        <el-table-column prop="nav_grl5y" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grl5y)">{{ filterPercent(row.nav_grl5y)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_l5y" align="right" label="同类排名" min-width="100px"></el-table-column>
      </el-table-column>

      <el-table-column label="成立以来">
        <el-table-column prop="nav_grbase" align="right" label="涨跌幅" min-width="66px">
          <template v-slot="{ row }"><span :class="getColor(row.nav_grbase)">{{ filterPercent(row.nav_grbase)
              }}</span></template>
        </el-table-column>
        <el-table-column prop="srank_base" align="right" label="同类排名" min-width="100px"></el-table-column>
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

    //let arr = globalProperties.defaultArr;

    this.tableArr = arr.map((item, index) => {

      this.getAchievement({//业绩表现
        number: item.number,
        index: index,
      });

      return {
        number: item.number,
        name: item.name,
        end_date: '',//日期
        "unit_nav": "",//净值
        "unit_acc_nav": "",//累计净值
        "nav_grtd": "",//日涨幅
        "nav_grl1w": "",//周涨幅
        "nav_grl1m": "",//近一月涨幅
        "nav_grl3m": "",//近三月涨幅
        "nav_grl6m": "",//近六月涨幅
        "nav_grlty": "",//今年以来
        "nav_grl1y": "",//近一年
        "nav_grl2y": "",//近两年
        "nav_grl3y": "",//近三年
        "nav_grl5y": "",//近五年
        "nav_grbase": "",//近三年同类平均？
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
    getAchievement(params) {
      axios.get(`${this.fundURL}/achievement/?code=${params.number}`)
        .then(res => {
          let data = res.data.data || {};
          for (let x in data) {
            this.tableArr[params.index][x] = data[x];
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
</style>
