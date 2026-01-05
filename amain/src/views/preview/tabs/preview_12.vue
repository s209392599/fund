<script setup>
console.log('src/views/preview/tabs/preview_12.vue');
// https://fundgz.1234567.com.cn/js/007467.js

const info = reactive({
  text: '',
  step: 1,
  tableData: [], // 列表数据
  tableHeight: 400,
});
const his_name_arr = ['近1周', '近1月', '近3月', '近6月', '近1年', '近3年', '近5年', '今年以来', '成立以来'];
const tableMaxHeight = computed(() => {
  return `calc(100vh - 135px)`;
});

const getList = () => {
  if (info.text.trim().length < 2) {
    ElMessage.warning('最少输入两个字符');
    info.tableData = [];
    return;
  }
  info.tableData = [];
  server_fund_apifolder_query_keywords({ text: info.text.trim() })
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

const resetForm = () => {
  info.search = '';
  getList();
};

// 去除A类
const removeA = () => {
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

// 得分
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
  } finally {
    return defen;
  }
};

const getAllInfo = async () => {
  for (let i = 0; i < info.tableData.length; i++) {
    const item = info.tableData[i];

    await server_fund_jd_detailPageInfoWithNoPin({
      fund_code: item.fund_code,
    }).then((res) => {
      info.tableData[i] = {
        ...info.tableData[i],
        ...res.data,
        fund_name: res.data?.headerOfItem?.fundName || '',
        fund_type: res.data?.headerOfItem?.fundTypeName || '',
      };
      info.step = 4;
    });
  }
};

// 去除小于1亿
const removeFn_1 = () => {
  var arr_1 = [];
  info.tableData.forEach((item) => {
    const obj_1 = item?.fundProfileOfItem || {};
    const fundScale = obj_1.fundScale || '';
    let flag_1 = fundScale.includes('亿元');
    if (flag_1 && parseFloat(fundScale) >= 1) {
      arr_1.push(item);
    }
  });
  info.tableData = [...arr_1];
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
  var tichu = ['基金管理有限公司', '基金管理股份有限公司', '基金管理有限责任公司'];
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
          let num_1 = parseInt(rank.split('/')[0]);
          let num_2 = parseInt(rank.split('/')[1]);
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

// 是否可买
const turnSacleFn = (row = {}) => {
  if (row.hasOwnProperty('isForSale')) {
    return row.isForSale ? '可买' : '不可买';
  }
  return '-';
};
// 复制数据
const copyData = () => {
  if (!info.tableData.length) {
    ElMessage.info('暂无数据');
    return;
  }
  const data = info.tableData.map(v => {
    return {
      fund_code: v.fund_code,
      fund_name: v.fund_name,
      fund_type: v.fund_type,
    };
  });
  fallbackCopyText(JSON.stringify(data));
};

// 涨跌幅的排序
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
// 去除不可买
const removeFn_2 = () => {
  var arr_2 = [];
  info.tableData.forEach((item) => {
    if (turnSacleFn(item) === '可买') {
      arr_2.push(item);
    }
  });
  info.tableData = [...arr_2];
  ElMessage.success('去除不可买成功');
};

</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item label="基金名称关键字">
          <el-input v-model="info.text" placeholder="最少两个字符" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="success" @click="removeA" :disabled="info.step < 2">去除A类</el-button>
          <el-button type="success" @click="getAllInfo" :disabled="info.step < 3">详细信息</el-button>
          <el-button type="success" @click="removeFn_2" :disabled="info.step < 4">去除不可买</el-button>
          <el-button type="success" @click="removeFn_1" :disabled="info.step < 4">去除小于1亿</el-button>
          <el-button type="success" @click="copyData">复制数据</el-button>
          <!-- <el-button type="success" @click="addFn">新增</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <div>
      <span class="" style="height:24px;line-height:24px">总数量：{{ info.tableData.length }}个(只展示前500条)</span>
    </div>

    <div class="main_box">
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
          <el-table-column prop="" label="基金名称" width="350">
            <template v-slot="{ row }">
              <div class="">{{ row?.headerOfItem?.fundName || row?.fund_name }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="" label="基金类型" width="130">
            <template v-slot="{ row }">
              <div class="">{{ row?.headerOfItem?.fundTypeName || row?.fund_type_name }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="" label="可买?" width="58">
            <template v-slot="{ row }">
              <span>{{ turnSacleFn(row) }}</span>
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

          <el-table-column prop="" label="机构占比" width="70">
            <template v-slot="{ row }">
              <div class="">{{ row?.fundProfileOfItem?.instPurchaseRatio }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="" label="基金经理" width="540">
            <template v-slot="{ row }">
              <div v-html="Turn_managerInfoList(row)"></div>
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
  </div>
</template>

<style scoped lang="scss"></style>
