<script setup>
import { watch } from 'vue';

console.log('amain/src/views/preview/fund_duibi/duibi_01.vue');
const tableMaxHeight = computed(() => {
  return `calc(100vh - 145px)`;
});
const info = reactive({
  tableData: []
})
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}

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
  console.log('触发了保存基金信息到本地存储');
};
watch(() => info.tableData, () => {
  saveFundInfoToLocalstorage();
}, { deep: true });

// 一个字符串必须是6位，且都是数字0-9
function isSixDigitNumber(str) {
  return /^[0-9]{6}$/.test(str);
}

const btn_fn_01 = () => {
  var str = prompt(`示例：012345,012365,123445`, "");
  if (str !== null) {
    str = str.trim();
    let fundList = str.split(',');
    fundList.forEach(item => {
      let fund_code = item.trim();
      if (isSixDigitNumber(fund_code)) {
        let flag = info.tableData.some((item) => item.fund_code === fund_code);
        console.log('基金代码', fund_code, '是否存在', flag, info.tableData.map(v => v.fund_code));
        if (!flag) {
          info.tableData.push({
            fund_code: fund_code,
            fund_name: '',
            fund_type: '',
          });
        } else {
          ElMessage.error(`基金 ${fund_code} 已存在`);
        }
      }
    });
  }
};
const btn_fn_02 = () => {
  if (confirm('确定要删除所有基金吗？')) {
    info.tableData = [];
  }
};
const btn_line_1 = (row, index) => {
  info.tableData = info.tableData.filter((item) => item.fund_code !== row.fund_code);
};
// const btn_line_2 = (row, index) => {
//   console.log('插入到基金', row, index);
// };
const btn_fn_03 = () => {
  let str = info.tableData.map(v => v.fund_code).join(',');
  fallbackCopyText(str);
};
const btn_fn_04 = () => {
  var str = prompt(`示例：[{"fund_code": "", "fund_name": "", "fund_type": ""}]`, "");
  if (str !== null) {
    str = str.trim();
    console.log('str', str);
    /*
[
  {"fund_code": ""},
  {"fund_code": "", "fund_name": "", "fund_type": ""},
  {"fund_code": "012345", "fund_name": "", "fund_type": ""},
  {"fund_code": "012365", "fund_name": "", "fund_type": ""},
  {"fund_code": "123445", "fund_name": "测试", "fund_type": "故意"},
  {"fund_code": "015790", "fund_name": "测试1", "fund_type": "故意2"}
]
    */
    var arr = [];
    try {
      arr = JSON.parse(str);
    } catch (e) {
      ElMessage.error('无法解析');
      return false;
    }
    if (Array.isArray(arr)) {
    } else {
      ElMessage.error('不是数组字符串');
      return false;
    }
    arr.forEach(item => {
      if (item.fund_code && isSixDigitNumber(item.fund_code)) {
        let flag = info.tableData.some((v) => v.fund_code === item.fund_code);
        console.log('基金代码', item.fund_code, '是否存在', flag, info.tableData.map(v => v.fund_code));
        if (!flag) {
          info.tableData.push({
            fund_code: item.fund_code || '',
            fund_name: item.fund_name || '',
            fund_type: item.fund_type || '',
          });
        }
      }
    });
    ElMessage.success('添加完毕');
  }
};
const btn_fn_05 = () => {
  if (!info.tableData.length) {
    ElMessage.error('没有基金信息');
    return false;
  }
  var data = info.tableData.map(v => {
    return {
      fund_code: v.fund_code,
      fund_name: v.fund_name,
      fund_type: v.fund_type
    }
  });
  let str = JSON.stringify(data);
  fallbackCopyText(str);
};
// 基金搜索
const btn_fn_06 = () => {
  info.tableData = [];

  // 第二步
  var str = prompt(`输入基金名称(至少两个字符)`, "");
  str = (str || '').trim();
  if (str.length < 2) {
    ElMessage.error('输入的基金名称至少两个字符');
    return false;
  }

  server_fund_apifolder_query_keywords({ text: str })
    .then((res) => {
      if (res.code === 200) {
        if (!res.data.length) {
          ElMessage.info('暂无数据');
          return;
        }
        if (res.data.length > 500) {
          ElMessage.warning('最多显示500条数据');
          info.tableData = res.data.slice(0, 500);
        } else {
          info.tableData = [...res.data];
        }
      }
    })
    .catch(() => {
    })
    .finally(() => {
      info.step = info.tableData.length ? 2 : 1;
    });
};
// 去除A类
const btn_fn_07 = () => {
  info.tableData = info.tableData.filter(v => !v.fund_name.endsWith('A'));
};
</script>

<template>
  <div class="page_wrapper">
    <div class="pb-5">
      <el-button class="top_btn btn_1" @click="btn_fn_01()">添加基金(逗号)</el-button>
      <el-button class="top_btn btn_2" @click="btn_fn_04()">添加基金(包含基金名称)</el-button>
      <el-button class="top_btn btn_3" @click="btn_fn_02()">删除所有基金</el-button>
      <el-button class="top_btn btn_4" @click="btn_fn_03()">复制基金号(逗号)</el-button>
      <el-button class="top_btn btn_5" @click="btn_fn_05()">复制基金号(数组)</el-button>
      <el-button class="top_btn btn_6" @click="btn_fn_06()">基金搜索</el-button>
      <el-button class="top_btn btn_7" @click="btn_fn_07()">去除A类</el-button>
      <span class="ml-10">基金数({{ info.tableData.length }}个)</span>
    </div>

    <el-table :data="info.tableData" style="width: 100%" border stripe :max-height="tableMaxHeight">
      <el-table-column fixed type="index" align="center" label="序" width="80"></el-table-column>

      <el-table-column label="操作" width="80" fixed align="center">
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_line_1(row, $index)">删除</el-button>
          <!-- <el-button link type="primary" size="small" @click="btn_line_2(row, $index)">插入到</el-button> -->
        </template>
      </el-table-column>

      <el-table-column fixed prop="fund_code" align="center" label="基金号" width="80">
        <template v-slot="{ row }">
          <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank" style="text-decoration: none">
            <span>{{ row.fund_code }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column prop="fund_name" label="基金名称" width="380" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span>{{ row.fund_name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="fund_type" label="类型" width="150" align="center" sortable show-overflow-tooltip>
        <template v-slot="{ row }">
          <span>{{ row.fund_type }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px 0px 0px 0px;
}

:deep(.top_btn) {
  color: #fff;
  border: none;

  &.btn_1 {
    background-color: #7e57c2 !important; // 紫色
  }

  &.btn_2 {
    background-color: #26a69a !important; // 青色
  }

  &.btn_3 {
    background-color: #ff7043 !important; // 橙红色
  }

  &.btn_4 {
    background-color: #ffa726 !important; // 橙黄色
  }

  &.btn_5 {
    background-color: #29b6f6 !important; // 天蓝色
  }

  &.btn_6 {
    background-color: #f56c6c !important; // 红色
  }

  &.btn_7 {
    background-color: #409eff !important; // 蓝色
  }
}
</style>
