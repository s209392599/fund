<script setup>
console.log('src/views/preview/tabs/preview_14.vue');
// 涨幅预览  这个要里面要做收益预估
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const info = reactive({
  width_name: isMobile ? 146 : 220, // 基金名称列的宽度
  tableData: [],
});

const getHistoryPerformance = (fund_code) => {
  server_fund_history_performance({
    fundcode: fund_code,
  }).then((res) => {
    if (res.code === 200) {
      info.tableData.forEach((item, index) => {
        if (
          item.fund_code === fund_code &&
          (!item.zhang_his || item.zhang_his.length === 0)
        ) {
          item.zhang_his = res.data || [];
        }
        const fundCode = item.fund_code;
        // 1. 创建 script 元素
        const script = document.createElement('script');
        script.src = `https://fundgz.1234567.com.cn/js/${fundCode}.js`;
        script.type = 'text/javascript';
        script.async = true; // 异步加载，避免阻塞渲染
        script.onload = () => {
          document.body.removeChild(script); // 3. 加载后移除
        };
        script.onerror = (error) => {
          document.body.removeChild(script); // 即使失败也移除
        };
        document.body.appendChild(script);
      });
    } else {
      ElMessage.error('获取列表失败，请重试！');
    }
  });
};
window.jsonpgz = (data) => {
  /*
    {
      "fundcode": "002834",
      "name": "华夏新锦绣混合C",
      "jzrq": "2025-08-12",
      "dwjz": "2.7597",
      "gsz": "2.7728",
      "gszzl": "0.48",
      "gztime": "2025-08-13 15:00"
    }
  */
  if (!data) {
    return false;
  }
  info.tableData.forEach((item) => {
    if (item.fund_code === data.fundcode) {
      item.zhang_today = data.gszzl || '-';
      item.dwjz = ['', null, undefined].includes(data.dwjz) ? '' : data.dwjz;
    }
  });
}

// 获取-列表数据
const query_list = () => {
  setTimeout(() => {
    server_fund_amain_public_funds().then((res) => {
      if (res.code === 200) {
        info.tableData = (res.data || []).map((item, index) => {
          item.zhang_his = [];
          return item;
        });
        info.tableData.forEach((item) => {
          getHistoryPerformance(item.fund_code);
        });
      } else {
        ElMessage.error('获取列表失败，请重试！');
      }
    });
  }, 300);
};
query_list();

const getHisdata = (row, index) => {
  const obj = row.zhang_his?.[index] || {};
  if (!obj.avg) return '-';

  const rate = Number(obj.rate);
  if (isNaN(rate)) return '-';

  const className = rate >= 0 ? 'color-red' : 'color-green';
  return `<span class="${className}">${obj.rate}</span>`;
};

const getToday = (row) => {
  const val = row.zhang_today;
  if (val === '-') return '-';

  const rate = Number(val);
  if (isNaN(rate)) return '-';

  const className = rate >= 0 ? 'color-red' : 'color-green';
  return `<span class="${className}">${val}</span>`;
};

const sortHistoricalData = (a, b, index) => {
  const objA = a.zhang_his?.[index] || {};
  const objB = b.zhang_his?.[index] || {};

  const valA = parseFloat(objA.rate) || 0;
  const valB = parseFloat(objB.rate) || 0;

  return valA - valB; // 升序
};

const sortToday = (a, b) => {
  const valA = parseFloat(a.zhang_today) || 0;
  const valB = parseFloat(b.zhang_today) || 0;
  return valA - valB;
};

// 历史排序快捷函数（一行一个）
const sortHisData0 = (a, b) => sortHistoricalData(a, b, 0);
const sortHisData1 = (a, b) => sortHistoricalData(a, b, 1);
const sortHisData2 = (a, b) => sortHistoricalData(a, b, 2);
const sortHisData3 = (a, b) => sortHistoricalData(a, b, 3);
const sortHisData4 = (a, b) => sortHistoricalData(a, b, 4);
const sortHisData5 = (a, b) => sortHistoricalData(a, b, 5);
const sortHisData6 = (a, b) => sortHistoricalData(a, b, 6);
const sortHisData7 = (a, b) => sortHistoricalData(a, b, 7);
const sortHisData8 = (a, b) => sortHistoricalData(a, b, 8);
</script>

<template>
  <div class="page_wrapper">
    <!-- 图片 -->
    <div class="img-box">
      <template v-for="item in info.tableData" :key="item.id">
        <!-- 推荐添加 :key -->
        <template v-if="item.fund_sign === '正常' && item.zhang_url?.startsWith('http')">
          <a class="type_1" :href="`https://fund.eastmoney.com/${item.fundcode}.html`" target="_blank">
            <img :src="item.zhang_url" :alt="item.fund_name" />
          </a>
        </template>
      </template>
    </div>

    <!-- 文字提示 -->
    <div style="padding: 0px 10px 0px 10px">注：“今日”这一列是预测涨幅，非当日实际涨幅；手机端可滑动查看</div>

    <!-- 表格展示区 -->
    <div class="table-box">
      <el-table :data="info.tableData" style="width: 100%" border stripe max-height="520">
        <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

        <el-table-column fixed prop="fund_code" align="center" label="基金号" width="64">
          <template v-slot="{ row }">
            <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank" style="text-decoration: none">
              <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_code }}</span>
              <span v-else>{{ row.fund_code }}</span>
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="fund_name" label="基金名称" :width="info.width_name" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_name }}</span>
            <span v-else>{{ row.fund_name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="fund_type" label="类型" width="70" align="center" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_type }}</span>
            <span v-else>{{ row.fund_type }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="区间" width="40" :sort-method="sortToday">
          <template v-slot="{ row }">
            <span v-if="!['', null, undefined].includes(row.dwjz)">
              <span v-if="Number(row.dwjz) > Number(row.point_top)" style="color:red;">过高</span>
              <span v-else-if="Number(row.dwjz) > Number(row.point_down)" style="color:#0e48ff;">过低</span>
              <span v-else>正常</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="今日" width="56" sortable :sort-method="sortToday">
          <template v-slot="{ row }">
            <span v-html="getToday(row)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近1周" width="66" sortable :sort-method="sortHisData0">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 0)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近1月" width="66" sortable :sort-method="sortHisData1">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 1)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近3月" width="66" sortable :sort-method="sortHisData2">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 2)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近6月" width="66" sortable :sort-method="sortHisData3">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 3)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近1年" width="66" sortable :sort-method="sortHisData4">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 4)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近3年" width="66" sortable :sort-method="sortHisData5">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 5)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="近5年" width="66" sortable :sort-method="sortHisData6">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 6)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="今年" width="66" sortable :sort-method="sortHisData7">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 7)"></span>
          </template>
        </el-table-column>

        <el-table-column align="right" label="成立" width="66" sortable :sort-method="sortHisData8">
          <template v-slot="{ row }">
            <span v-html="getHisdata(row, 8)"></span>
          </template>
        </el-table-column>

        <el-table-column prop="fund_fixed" label="定投" width="76" align="right" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span class="">{{ row.fund_fixed }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="point_top" label="高点" width="66"></el-table-column>
        <el-table-column prop="point_down" label="低点" width="66"></el-table-column>
        <el-table-column prop="dwjz" label="净值" width="66"></el-table-column>

        <el-table-column prop="fund_desc" label="备注" width="300" show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">历史数据</span>
            <span v-else>{{ row.fund_desc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-box {
  padding: 4px;
}

.img-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.type_1 {
  display: block;
  border: 1px solid #ddd;
  margin: 2px;
  height: 120px;
  width: calc(50% - 4px);
}

.type_1 img {
  width: 100%;
  height: 100%;
}

@media (min-width: 1440px) {
  .type_1 {
    width: calc(33.33% - 4px);
    height: 140px;
  }
}

@media (min-width: 1677px) {
  .type_1 {
    width: calc(25% - 4px);
    height: 140px;
  }
}

.lianghua_line {
  padding: 5px 0;
}

.color-red {
  color: red !important;
}

.color-green {
  color: #090 !important;
}

:deep(.el-table) {
  .cell {
    padding: 0 5px !important;
  }

  .el-table__cell {
    padding: 2px 0;
  }

  .caret-wrapper {
    width: 15px;
    position: relative;
    left: -6px;
  }

  .color-red {
    color: red !important;
  }

  .color-green {
    color: #090 !important;
  }
}

.fund_type {
  position: absolute;
  right: 0px;
  background-color: red;
  color: #fff;
  padding: 0px 3px;
  border-radius: 4px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  top: 2px;
}

.fund_name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type_status {
  position: absolute;
  right: 3px;
  bottom: 3px;
  z-index: 4;
  font-size: 24px;
  color: #000;
}

.type_status.top {
  font-size: 24px;
  color: red;
}

.type_status.down {
  color: #0e48ff;
  font-size: 24px;
}
</style>
