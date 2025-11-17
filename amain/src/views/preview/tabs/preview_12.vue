<script setup>
console.log('src/views/preview/tabs/preview_12.vue');

/*

jd_chi_cang
jd_fundDiagnosis
jd_fund_archive
jd_header_tag
jd_historyPerformance
jd_managerInfo
jd_proportion
jd_totalAsset

*/

const info = reactive({
  text: '北证50',
  step: 1,
  tableData: [], // 列表数据
  tableHeight: 400,
});
// 计算网页高度 - 40
info.tableHeight = document.documentElement.clientHeight - 150;

/*
jd_header_tag: jd_header_tag,// 头部标签
{"rankList":[],"highlights":{"tagList":["基金规模大"],"morningstarRating":"4"},"userFocus":[],"themeNameList":["半导体","机器视觉"]}
{
"rankList":["连续5年跑赢同类 · 第9名"],
"highlights":{"tagList":[],"morningstarRating":"2"},
"userFocus":[],"themeNameList":["农产品加工","免税店"]}


jd_historyPerformance,// 历史业绩
[{"avg":"2.36","rate":"2.12","name":"近1周","rank":"2495/4881"},
{"avg":"11.12","rate":"11.20","name":"近1月","rank":"2032/4859"},
{"avg":"23.08","rate":"28.29","name":"近3月","rank":"1210/4719"},
{"avg":"22.01","rate":"26.57","name":"近6月","rank":"1236/4609"},
{"avg":"57.35","rate":"55.06","name":"近1年","rank":"1913/4416"},
{"avg":"30.09","rate":"29.99","name":"今年以来","rank":"2013/4881"},
{"avg":"7.60","rate":"-17.99","name":"近3年","rank":"2772/3171"},
{"avg":"649.70","rate":"145.30","name":"成立以来","rank":"135/162"}]


jd_fundDiagnosis,// 综合诊断
99|29|11|51


jd_proportion,// 持仓分类占比
18.58|83.99|2.99|0.00|0.00


jd_totalAsset,// 资产
35940533.08


jd_chi_cang,// 持仓详情(股票占比)
{
  "stock":[
    {"name":"宁德时代","industryName":"电池","ratio":"1.26%"},
    {"name":"路维光电","industryName":"半导体","ratio":"1.16%"},
    {"name":"比亚迪","industryName":"汽车整车","ratio":"1.11%"},
    {"name":"科伦药业","industryName":"化学制药","ratio":"1.10%"},
    {"name":"中航沈飞","industryName":"军工装备","ratio":"1.06%"},
    {"name":"永兴材料","industryName":"能源金属","ratio":"0.93%"},
    {"name":"恺英网络","industryName":"游戏","ratio":"0.92%"},
    {"name":"潮宏基","industryName":"服装家纺","ratio":"0.81%"},
    {"name":"芯原股份","industryName":"半导体","ratio":"0.81%"},
    {"name":"中金黄金","industryName":"贵金属","ratio":"0.81%"}
  ],
  "bond":[
    {"name":"国债2420","industryName":"国债","ratio":"10.82%"},
    {"name":"19西咸02","industryName":"企业债","ratio":"5.76%"},
    {"name":"25国债01","industryName":"国债","ratio":"5.03%"},
    {"name":"兴业转债","industryName":"可转债","ratio":"4.85%"},
    {"name":"20国债04","industryName":"国债","ratio":"4.15%"}
  ],
  "fund":[]
}

jd_fund_archive,// 基金档案
{
  "establishedDateByCn":"2013年04月24日",
  "company_name":"华富基金管理有限公司",
  "fundScaleList":["0.37","0.31","0.32","0.33"],
  "instPurchaseRatio":"29.77",
  "purchaseRatio":"70.23",
  "companyManageScale":"978.06亿",
  "manageNumber":"72"
}

jd_managerInfo,// 基金经理
[
  {
    "yearPerformance":"3.40",
    "employPerformance":"13.99",
    "employmentDate":"2年357天",
    "accessionDateDesc":"2022.09.23-至今",
    "managerName":"戴弘毅",
    "accessionDate":"2年357天",
    "manageScale":"5.03亿元"
  }
]


*/

const getList = () => {
  if (info.text.trim() === '') {
    info.tableData = [];
    return;
  }
  server_fund_mysql_query_keywords({ text: info.text.trim() })
    .then((res) => {
      console.log('关键词搜索', 'res', res);
      if (res.code === 200) {
        info.tableData = [...res.data];
        if (!info.tableData.length) {
          ElMessage.info('暂无数据');
        }
        // // 不以ETF结尾的基金
        // info.tableData = [...res.data].filter(item => !item.name.endsWith('ETF'));
        // info.tableData.push({
        //   code: '008164',
        //   name: 'aaaaaa',
        // })
        // // getFundGZ();// 查看是否可以读取到当日的涨幅
        // getFundGZ(info.tableData.map(item => item.code));
      } else {
        info.tableData = [];
        ElMessage.error(res.msg || '获取列表失败');
      }
    })
    .catch(() => {
      info.tableData = [];
      ElMessage.error('获取列表失败');
    })
    .finally(() => {
      info.step = info.tableData.length ? 2 : 1;
    });
};

const resetForm = () => {
  info.search = '';
  getList();
};

// 去除A类
const removeA = () => {
  console.log('去除name最后一个字符是A');
  ElMessageBox.confirm('确认去除吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      info.tableData = info.tableData.filter(
        (item) => item.fund_name[item.fund_name.length - 1] !== 'A'
      );
    })
    .catch(() => { })
    .finally(() => {
      info.step = info.tableData.length ? 3 : 1;
    });
};

const addFn = () => {
  console.log('新增');
};
const btn_del = (row, $index) => {
  console.log('删除', row);
  // info.tableData.splice($index, 1);

  // 创建新数组而不是直接修改原数组
  const newData = info.tableData.filter(
    (item) => item.fund_code !== row.fund_code
  );

  // 使用markRaw减少响应式开销
  info.tableData = markRaw(newData);
};

const defenFn = (jd_historyPerformance) => {
  let defen = 0;
  try {
    if (jd_historyPerformance.length) {
      let obj = {
        近1周: 5,
        近1月: 10,
        近3月: 30,
        近6月: 35,
        近1年: 20,
      };
      defen = 0;
      jd_historyPerformance.forEach((v) => {
        if (v.name === '近1周') {
          defen += v.rate * obj['近1周'] * 100;
        } else if (v.name === '今年以来') {
          defen += v.rate * obj['近1月'] * 100;
        } else if (v.name === '今年以来') {
          defen += v.rate * obj['近3月'] * 100;
        } else if (v.name === '近6月') {
          defen += v.rate * obj['近6月'] * 100;
        } else if (v.name === '近1年') {
          defen += v.rate * obj['近1年'] * 100;
        }
      });
      defen = Number(defen.toFixed(2));
    }
    return defen;
  } catch (err) {
    // console.log(err, row);
  } finally {
    return defen;
  }
};

const getAllInfo = () => {
  const funds = info.tableData.map((v) => v.fund_code);
  if (funds === 0) {
    ElMessage.info('请先选择基金数据');
    return;
  }
  server_fund_mysql_fundinfo_byfunds({
    funds: funds,
  })
    .then((res) => {
      console.log('关键词搜索', 'res', res);
      if (res.code === 200) {
        let arr_1 = res.data || [];
        let arr_2 = arr_1.map((item) => {
          let jd_historyPerformance = item.jd_historyPerformance
            ? JSON.parse(item.jd_historyPerformance)
            : [];
          if (jd_historyPerformance) {
            jd_historyPerformance = jd_historyPerformance.map((i) => {
              return {
                ...i,
                avg: i.avg ? parseFloat(i.avg) : '',
                rate: i.rate ? parseFloat(i.rate) : '',
              };
            });
          }
          item.score = defenFn(jd_historyPerformance);
          return {
            ...item,
            jd_header_tag: item.jd_header_tag
              ? JSON.parse(item.jd_header_tag)
              : null,
            jd_historyPerformance: jd_historyPerformance,
            jd_fundDiagnosis: item.jd_fundDiagnosis,
            jd_proportion: item.jd_proportion,
            jd_totalAsset: item.jd_totalAsset,
            jd_chi_cang: item.jd_chi_cang ? JSON.parse(item.jd_chi_cang) : null,
            jd_fund_archive: item.jd_fund_archive
              ? JSON.parse(item.jd_fund_archive)
              : null,
            jd_managerInfo: item.jd_managerInfo
              ? JSON.parse(item.jd_managerInfo)
              : null,
          };
        });
        info.tableData = [...arr_2];
      } else {
        // info.tableData = [];
        ElMessage.error(res.msg || '获');
      }
    })
    .catch((err) => {
      info.tableData = [];
      console.log(err.message);
    })
    .finally(() => {
      if (info.tableData.length) {
        info.step = 4;
      }
    });
};
// 资产转换
const turnAssetFn = (str) => {
  if (!str || str.length === 0) return 0;
  if (['0', '', 'undefined'].includes(str)) return 0;
  var num_1 = parseFloat(str);
  return num_1;
};
// 去除小于1亿
const removeFn_1 = () => {
  var arr_1 = [];
  info.tableData.forEach((item) => {
    if (!['0', '', 'undefined'].includes(item.jd_totalAsset)) {
      if (
        item.jd_totalAsset &&
        parseFloat(item.jd_totalAsset) > 1 * 10000 * 10000
      ) {
        arr_1.push(item);
      }
    }
  });
  info.tableData = [...arr_1];
  // info.step = info.tableData.length ? 5 : 1;
};
// 涨幅转换
const zhangFn = (arr_1, num, row) => {
  // 检查 arr_1 是否为非空数组
  if (!Array.isArray(arr_1) || arr_1.length === 0) {
    return '';
  }
  const obj = {
    1: '近1周',
    2: '近1月',
    3: '近3月',
    4: '近6月',
    5: '近1年',
    6: '今年以来',
    7: '近3年',
    8: '成立以来',
  };

  if (!obj[num]) {
    return '';
  }
  const arr_2 = arr_1.filter((item) => item.name === obj[num]);
  if (arr_2.length > 0) {
    const selectedObj = arr_2[0];
    if (
      selectedObj.hasOwnProperty('avg') &&
      ![null, undefined].includes(selectedObj.avg)
    ) {
      const rate = parseFloat(selectedObj.rate);
      if (!isNaN(rate)) {
        return rate;
      }
    }
  }
  return '';
};

const sortByYearRate = (num) => {
  let obj = {
    1: '近1周',
    2: '近1月',
    3: '近3月',
    4: '近6月',
    5: '近1年',
    6: '今年以来',
    7: '近3年',
    8: '成立以来',
  };
  // 提取 a 和 b 的 "近1年" 涨幅值
  const getValue = (item) => {
    const arr_1 = item.jd_historyPerformance;
    if (!Array.isArray(arr_1) || arr_1.length === 0) return '';

    const period = obj[num];
    const match = arr_1.find((i) => i.name === period);
    if (match && match.rate !== undefined) {
      return parseFloat(match.rate);
    }
    return '';
  };
  return function (a, b, order) {
    const valA = getValue(a);
    const valB = getValue(b);

    // 处理 NaN 情况：让空值排在最后
    if (valA === '') return order === 'ascending' ? 1 : -1;
    if (valB === '') return order === 'ascending' ? -1 : 1;

    // 正常数值比较
    return order === 'ascending' ? valB - valA : valA - valB;
  };
};

// 转换标签
const turn_rankList = (row = {}) => {
  const jd_header_tag = row.jd_header_tag || {};
  const rankList = jd_header_tag.rankList || [];
  return rankList.join('；');
};
const turn_tagList = (row = {}) => {
  const jd_header_tag = row.jd_header_tag || {};
  const highlights = jd_header_tag.highlights || {};
  const tagList = highlights.tagList || [];
  var str = '';
  if (highlights.hasOwnProperty('morningstarRating')) {
    str += `晨星${highlights.morningstarRating}星；`;
  }

  return str + tagList.join('；');
};
const turn_userFocus = (row = {}) => {
  const jd_header_tag = row.jd_header_tag || {};
  const userFocus = jd_header_tag.userFocus || [];
  return userFocus.join('；');
};
const turn_themeNameList = (row = {}) => {
  const jd_header_tag = row.jd_header_tag || {};
  const themeNameList = jd_header_tag.themeNameList || [];
  return themeNameList.join('；');
};

// watch(
//   () => info.tableData,
//   async (newVal) => {
//     await nextTick(); // 确保 DOM 更新完成
//     info.tablata = newVal.map((row) => ({
//       ...row,
//       defen: defenFn(row),
//     }));
//   },
//   { immediate: true }
// );
</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item label="关键字">
          <el-input v-model="info.text" placeholder="搜索的文字" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList" data-num="2">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="success" @click="removeA" :disabled="info.step < 2" data-num="3">去除A类</el-button>
          <el-button type="success" @click="getAllInfo" :disabled="info.step < 3" data-num="4">详细信息</el-button>
          <el-button type="success" @click="removeFn_1" :disabled="info.step < 4" data-num="5">去除小于1亿</el-button>
          <el-button type="success" @click="console.log([...info.tableData])">打印数据</el-button>
          <!-- <el-button type="success" @click="addFn">新增</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <div>
      <span class="">总数量：{{ info.tableData.length }}个</span>
    </div>

    <div class="main_box">
      <el-table :data="info.tableData" border style="width: 100%" :height="info.tableHeight">
        <el-table-column fixed label="序" type="index" width="50" />

        <!-- <el-table-column prop="fund_code" label="基金号" width="80" /> -->

        <el-table-column fixed prop="fund_code" align="center" label="基金号" width="64">
          <template v-slot="{ row }">
            <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank" style="text-decoration: none">
              <span v-if="row.sign === '历史'" style="color: #876ad2; font-weight: 700">{{ row.fund_code }}</span>
              <span v-else>{{ row.fund_code }}</span>
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="fund_name" label="基金名称" width="240" show-overflow-tooltip />
        <el-table-column prop="fund_type_name" label="基金类型" width="110" show-overflow-tooltip />

        <el-table-column prop="score" label="得分" width="120" align="right" sortable>
          <template #default="{ row, $index }">
            <span>{{ row.score }}</span>
          </template>
        </el-table-column>

        <el-table-column label="总资产" width="120" align="right" sortable>
          <template #default="{ row, $index }">
            <span>{{ turnAssetFn(row.jd_totalAsset) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="近1周" width="100" align="right" sortable :sort-method="sortByYearRate(1)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 1) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="近1月" width="100" align="right" sortable :sort-method="sortByYearRate(2)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="近3月" width="100" align="right" sortable :sort-method="sortByYearRate(3)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 3) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="近6月" width="100" align="right" sortable :sort-method="sortByYearRate(4)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 4) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="近1年" width="100" align="right" sortable :sort-method="sortByYearRate(5)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 5) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="今年以来" width="100" align="right" sortable :sort-method="sortByYearRate(6)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 6) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="近3年" width="100" align="right" sortable :sort-method="sortByYearRate(7)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 7, row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="成立以来" width="100" align="right" sortable :sort-method="sortByYearRate(8)">
          <template #default="{ row, $index }">
            <span>{{ zhangFn(row.jd_historyPerformance, 8) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="榜单" width="150" align="right" sortable>
          <template #default="{ row, $index }">
            <span>{{ turn_rankList(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="特色亮点" width="250" align="right" sortable>
          <template #default="{ row, $index }">
            <span>{{ turn_tagList(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="用户关注" width="250" align="right" sortable>
          <template #default="{ row, $index }">
            <span>{{ turn_userFocus(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="投资方向" width="250" align="right" sortable>
          <template #default="{ row, $index }">
            <span>{{ turn_themeNameList(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Operations" min-width="120">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--
      基金经理的返回值
      {
        "yearPerformance":"6.06",
        "employPerformance":"105.86",
        "employmentDate":"14年217天",
        "accessionDateDesc":"2013.03.29-至今",
        "managerName":"何秀红",
        "accessionDate":"12年170天",
        "manageScale":"81.94亿元",
        "awardList":[
          {"awardTypeName":"金牛奖"},
          {"awardTypeName":"金基金奖"},
          {"awardTypeName":"明星基金奖"}
        ]
      },
      -->
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
