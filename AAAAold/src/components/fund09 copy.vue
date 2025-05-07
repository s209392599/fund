<template>
  <div class="about">
    <div style="height: 15px"></div>

    <el-table :data="tableData" stripe style="width: 100%" max-height="765" id="viewsAbout">
      <el-table-column fixed type="index" width="28px"></el-table-column>
      <el-table-column fixed prop="number" label="代号" width="64px"></el-table-column>
      <el-table-column prop="name" label="名称" width="126px"></el-table-column>
      <el-table-column prop="update_zhangfu" label="万元收入" width="66px" align="right">
        <template v-slot="{ row }">
          <span class="cell_zhangfu" :class="getColor(row.update_zhangfu)">{{ row.update_zhangfu }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="时间" width="60px">
        <template v-slot="{ row }">
          <span :class="getColor_time(row.update_time)">{{ turn_time(row.update_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_danweijingzhi" label="单位净值" width="70px" align="right"></el-table-column>
      <el-table-column prop="update_leijijingzhijingzhi" label="累计净值" width="70px" align="right"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Edit',
  data() {
    return {
      fundURL: globalProperties.fundURL,
      tableData: [],
    };
  },
  created() {
    let arr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;

    this.tableData = arr.map((item, index) => {
      this.getShouyi({//业绩表现
        number: item.number,
        index: index,
      });
      return {
        number: item.number,
        name: item.name,
        remarks: item.remarks,
        notice: item.notice,
        update_time: '',// 更新时间
        update_zhangfu: '',// 今日涨幅
        update_danweijingzhi: '',// 单位净值
        update_leijijingzhijingzhi: '',// 累计净值
      }
    });
  },
  methods: {
    getShouyi(params) {
      setTimeout(() => {
        axios.get(`${this.fundURL}/obtainNetWorth/?code=${params.number}&size=1`)
          .then(res => {
            console.log(`fund09.vue 40 [res]`, res);
            let data = res.data || [];
            var obj = data[0] || {};
            this.tableData[params.index]["update_time"] = obj.date || '';
            this.tableData[params.index]["update_zhangfu"] = Math.round(Number(obj.dailyProfit || 0) * 100);
            this.tableData[params.index]["update_danweijingzhi"] = obj.netValue || '';
            this.tableData[params.index]["update_leijijingzhijingzhi"] = obj.totalNetValue || '';
          }).catch(err => {
            console.log("err", err);
          })
      }, 10 * params.index)
    },
    getColor(v) {
      if (!v) return '';
      if (Number(v) < 0) {
        return 'down'
      } else {
        return 'up';
      }
    },
    turn_time(v) {
      if (!v) return '';
      let date = new Date(v);
      let month_1 = date.getMonth() + 1;
      month_1 = month_1 > 9 ? month_1 : `0${month_1}`;
      let day_1 = date.getDate();
      day_1 = day_1 > 9 ? day_1 : `0${day_1}`;
      return `${month_1}-${day_1}`;
    },
    getColor_time(v) {
      if (!v) return '';
      let now = new Date();
      let date = new Date(v);
      let year_1 = now.getFullYear();
      let month_1 = now.getMonth() + 1;
      let day_1 = now.getDate();
      let year_2 = date.getFullYear();
      let month_2 = date.getMonth() + 1;
      let day_2 = date.getDate();
      if (year_1 === year_2 && month_1 === month_2 && day_1 === day_2) {
        return '';
      } else {
        return 'down';
      }
    },
  },
};
</script>

<style>
#viewsAbout td,
#viewsAbout th {
  padding: 2px 0 !important;
}

.el-table .cell {
  padding-left: 1px;
  padding-right: 2px;
}

.cell_zhangfu {
  font-size: 16px;
  font-weight: 700;
  padding-right: 5px;
}

.up {
  color: #ff6600;
}

.down {
  color: #0FA578;
}
</style>
