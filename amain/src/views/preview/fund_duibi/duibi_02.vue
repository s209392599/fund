<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_02.vue');
/*
011496 多个基金经理
*/

const info = reactive({
  tableData: [],
});
const tableMaxHeight = computed(() => {
  return `calc(100vh - 140px)`;
});

const his_name_arr = ['近1周', '近1月', '近3月', '近6月', '近1年', '近3年', '近5年', '今年以来', '成立以来'];
if (localStorage.getItem('fund_duibi_arr')) {
  info.tableData = JSON.parse(localStorage.getItem('fund_duibi_arr'));
} else {
  localStorage.setItem('fund_duibi_arr', JSON.stringify([]));
}
// console.log(info.tableData);

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

    await server_fund_jd_detailPageInfoWithNoPin({
      fund_code: item.fund_code,
    }).then((res) => {
      console.log(res);
      info.tableData[i] = {
        ...info.tableData[i],
        ...res.data,
        fund_name: res.data?.headerOfItem?.fundName || '',
        fund_type: res.data?.headerOfItem?.fundTypeName || '',
      };

      if (i === info.tableData.length - 1) {
        ElMessage.success('已获取所有基金的交易规则');
      }
    });
  }
};

// 删除
const btn_line_1 = (row, index) => {
  info.tableData = info.tableData.filter((item) => item.fund_code !== row.fund_code);
};
// 榜单
const Turn_rankList = (row) => {
  const rankList = row?.headerOfItem?.rankList || [];
  return rankList.map((item) => item.wealthRank).join('；');
};
// 特色亮点
const TurnHighlights = (row) => {
  const highlights = row?.headerOfItem?.highlights || {};
  const tagList = highlights.tagList || [];
  var str = '';
  if (highlights.hasOwnProperty('morningstarRating')) {
    str += `晨星${highlights.morningstarRating}星；`;
  }
  return str + tagList.join('；');
};
// 用户关注
const Turn_userFocus = (row) => {
  const userFocus = row?.headerOfItem?.userFocus || [];
  return userFocus.map((item) => item.title).join('；');
};
// 投资方向
const TurnInvestDirection = (row) => {
  const themeNameList = row?.headerOfItem?.themeNameList || [];
  return themeNameList.map((item) => item.themeName).join('；');
};

// 管理公司
const Turn_company_name = (row) => {
  let company_name = row?.fundProfileOfItem?.company_name || '';
  // 剔除这些关键词
  var tichu = ['基金管理有限公司', '基金管理股份有限公司', '基金管理有限责任公司', '资产管理(广东)有限公司'];
  tichu.forEach((item) => {
    company_name = company_name.replace(item, '');
  });
  return company_name;
};
// 基金经理
const Turn_managerInfoList = (row) => {
  const managerInfoList = row?.fundManagerOfItem?.managerInfoList || [];
  let html = '';
  managerInfoList.forEach((item) => {
    const awardList = item.awardList || [];
    let str_award = awardList.map((v_1) => v_1.awardTypeName).join('、');// 金牛奖得主 等
    html += `<div>${item.managerName} ${str_award ? `(${str_award})` : ''}
        本基金:${item.accessionDate}(${item.employPerformance}%)
        从业:${item.employmentDate}(${item.yearPerformance}%)
      </div>`;
  });
  return html;
};
// 综合诊断
const Turn_fundDiagnosisData = (row, index) => {
  const obj_1 = row?.fundDiagnosisOfItem || {};
  const obj_2 = obj_1.fundDiagnosisData || {};
  return obj_2['tab' + index]?.overSameTypePercent || '';
};
// 历史业绩
const Turn_historyPerformanceList = (row, item, type) => {
  const obj_1 = row?.performanceOfItem || {};
  const obj_2 = obj_1.historyPerformanceMap || {};
  const arr = obj_2.historyPerformanceList || [];
  return arr
    .filter((item_1) => item_1.name === item)
    .map((item_1) => {
      if (type === 'rate') {
        return item_1.rate;
      } else if (type === 'avg') {
        return item_1.avg;
      } else if (type === 'rank') {
        let rank = item_1.rank || '-';
        if (rank.includes('/')) {
          let num_1 = rank.split('/')[0];
          let num_2 = rank.split('/')[1];
          if (num_2 > 0) {
            if (num_1 / num_2 > 0.5) {
              return `<span style="color: red">${rank}</span>`
            } else {
              return rank;
            }
          } else {
            return rank;
          }
        } else {
          return rank;
        }
      }
    })
    .join('；');
};

const sort_zhangfu_fn = (a, b, index) => {
  // 从a和b这两个行数据中获取对应的历史业绩数据进行比较
  const getRate = (item, period) => {
    const obj_1 = item?.performanceOfItem || {};
    const obj_2 = obj_1.historyPerformanceMap || {};
    const arr = obj_2.historyPerformanceList || [];
    const foundItem = arr.find(historyItem => historyItem.name === period);
    return foundItem ? parseFloat(foundItem.rate) || 0 : 0;
  };

  const rateA = getRate(a, his_name_arr[index]);
  const rateB = getRate(b, his_name_arr[index]);

  return rateA - rateB; // 降序排列
};

// 删除不可买
const btn_fn_01 = () => {
  info.tableData = info.tableData.filter((item) => item.isForSale === true);
  ElMessage.success('删除不可买成功');
};
// 删除小于1亿
const btn_fn_02 = () => {
  info.tableData = info.tableData.filter((item) => {
    let fundScale = item.fundProfileOfItem?.fundScale || '';
    return !fundScale.includes('万元')
  });
  ElMessage.success('删除小于1亿成功');
};
// 删除1、3、6月排名靠后
const btn_fn_03 = () => {
  info.tableData = info.tableData.filter((item) => {
    const perfObj = item?.performanceOfItem || {};
    const perfMap = perfObj.historyPerformanceMap || {};
    const perfList = perfMap.historyPerformanceList || [];

    const rank1 = perfList.find(v1 => v1.name === '近1月')?.rank || '';
    const rank3 = perfList.find(v1 => v1.name === '近3月')?.rank || '';
    const rank6 = perfList.find(v1 => v1.name === '近6月')?.rank || '';

    if (!rank1 || !rank3 || !rank6) {
      return true; // 如果缺少排名信息，则认为不符合条件，删除该基金
    }
    let flag_1 = parseInt(rank1.split('/')[0]) / parseInt(rank1.split('/')[1]) > 0.5;
    let flag_3 = parseInt(rank3.split('/')[0]) / parseInt(rank3.split('/')[1]) > 0.5;
    let flag_6 = parseInt(rank6.split('/')[0]) / parseInt(rank6.split('/')[1]) > 0.5;

    return !(flag_1 && flag_3 && flag_6);
  });
  ElMessage.success('删除1、3、6月排名靠后成功');
};

// sortInstPurchaseRatio
const sortInstPurchaseRatio = (a, b) => {
  let ratioA = parseFloat(a.fundProfileOfItem?.instPurchaseRatio || 0);
  let ratioB = parseFloat(b.fundProfileOfItem?.instPurchaseRatio || 0);
  return ratioB - ratioA; // 降序排列
};

watch(() => info.tableData, (newVal, oldVal) => {
  nextTick(() => {
    saveFundInfoToLocalstorage();
  });
}, { deep: true });

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="page_wrapper">

    <div class="pb-5">
      <el-button class="top_btn btn_1" @click="btn_fn_01()">删除不可买</el-button>
      <el-button class="top_btn btn_2" @click="btn_fn_02()">删除小于1亿</el-button>
      <el-button class="top_btn btn_3" @click="btn_fn_03()">删除1、3、6月排名靠后</el-button>
      <!-- <el-button class="top_btn btn_4" @click="btn_fn_04()"></el-button> -->
      <!-- <el-button class="top_btn btn_5" @click="btn_fn_05()">复制基金号(数组)</el-button> -->
      <span class="ml-10">基金数量：{{ info.tableData.length }}</span>
    </div>

    <el-table :data="info.tableData" style="width: 100%" border stripe :max-height="tableMaxHeight">
      <el-table-column fixed type="index" align="center" label="序" width="36"></el-table-column>

      <el-table-column label="操作" width="45" fixed>
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_line_1(row, $index)">删除</el-button>
        </template>
      </el-table-column>

      <el-table-column fixed prop="fund_code" align="center" label="基金号" width="64">
        <template v-slot="{ row }">
          <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank" style="text-decoration: none">
            <span>{{ row.fund_code }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column label="基本信息" align="center">
        <el-table-column prop="" label="基金名称" width="350" sortable>
          <template v-slot="{ row }">
            <div class="">{{ row?.headerOfItem?.fundName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="基金类型" width="130">
          <template v-slot="{ row }">
            <div class="">{{ row?.headerOfItem?.fundTypeName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="可买?" width="58">
          <template v-slot="{ row }">
            <span>{{ row?.isForSale ? '可买' : '不可买' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="" label="锁定" width="120">
          <template v-slot="{ row }">
            <span>{{ row?.headerOfItem?.lockOrCloseTipsMap?.tag || '' }}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="历史业绩" align="center">
        <template v-for="(item, index_1) in his_name_arr" :key="item">
          <el-table-column :label="item" align="center">
            <el-table-column prop="" label="涨跌幅" width="80" align="right" sortable
              :sort-method="(a, b) => sort_zhangfu_fn(a, b, index_1)">
              <template v-slot="{ row }">
                <div v-html="Turn_historyPerformanceList(row, item, 'rate')"></div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="同类均值" width="70" align="right">
              <template v-slot="{ row }">
                <div v-html="Turn_historyPerformanceList(row, item, 'avg')"></div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="同类排名" width="94" align="right">
              <template v-slot="{ row }">
                <div v-html="Turn_historyPerformanceList(row, item, 'rank')"></div>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
      </el-table-column>

      <el-table-column label="定投业绩" align="center"></el-table-column>

      <el-table-column label="综合诊断 (收益能力等是超越多少同类)" align="center">
        <el-table-column prop="" label="基准" width="48">
          <template v-slot="{ row }">
            <div class="">{{ row?.fundDiagnosisOfItem?.codeDesc }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="收益能力" width="70" align="right">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_fundDiagnosisData(row, 1)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="性价比" width="54" align="right">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_fundDiagnosisData(row, 2)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="抗下跌" width="54" align="right">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_fundDiagnosisData(row, 3)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="抗波动" width="54" align="right">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_fundDiagnosisData(row, 4)"></div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="基金档案" align="center">
        <el-table-column prop="" label="成立时间" width="100">
          <template v-slot="{ row }">
            <div class="">{{ row?.fundProfileOfItem?.establishedDate }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="基金规模" width="100">
          <template v-slot="{ row }">
            <div class="">{{ row?.fundProfileOfItem?.fundScale }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="规模变化" width="220">
          <template v-slot="{ row }">
            <div class="">{{
              row?.fundProfileOfItem?.fundScaleList?.join('；')
            }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="机构占比" width="100" sortable :sort-method="(a, b) => sortInstPurchaseRatio(a, b)">
          <template v-slot="{ row }">
            <div class="">{{ row?.fundProfileOfItem?.instPurchaseRatio }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="基金经理" width="540">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_managerInfoList(row)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="管理公司" width="90">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_company_name(row)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="管理资产" width="100">
          <template v-slot="{ row }">
            <div class="">{{ row?.fundProfileOfItem?.companyManageScale }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="基金数量" width="70">
          <template v-slot="{ row }">
            <div class="">{{ row?.fundProfileOfItem?.manageNumber }}</div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="基金标签" align="center">
        <el-table-column prop="" label="榜单" width="258">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_rankList(row)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="特色亮点" width="380">
          <template v-slot="{ row }">
            <div class="" v-html="TurnHighlights(row)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="用户关注" width="270">
          <template v-slot="{ row }">
            <div class="" v-html="Turn_userFocus(row)"></div>
          </template>
        </el-table-column>

        <el-table-column prop="" label="投资方向" width="258">
          <template v-slot="{ row }">
            <div class="" v-html="TurnInvestDirection(row)"></div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 5px 0px 0px 0px;
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
}
</style>
