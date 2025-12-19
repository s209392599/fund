<script setup>
console.log('amain/src/views/preview/fund_duibi/duibi_07.vue');
const info = reactive({
  tableData: [],
});
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

    await server_fund_jd_InvestmentDistributionPageInfo({
      fund_code: item.fund_code,
    }).then((res) => {
      console.log(res);
      info.tableData[i] = {
        ...info.tableData[i],
        ...res.data,
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

// 转换资产分布数据
const Turn_invest = (lineData) => {
  let invest = lineData.invest || [];
  let html = '';
  let arr_type = ['股票', '债券', '银行存款及清算备付金', '基金', '其他',];
  let end_type = ['股票', '债券', '现金', '基金', '其他'];
  end_type.forEach((item_1, index_1) => {
    let find_item = invest.filter((item_2) => {
      return item_2.name === arr_type[index_1];
    })[0] || {};
    let ratio = find_item.hasOwnProperty('ratio') ? find_item.ratio : '-';
    html += `<div class="invest_item">${item_1}(${ratio})</div>`;

  });
  return html;
};
// 转换行业分布数据
const Turn_industry = (lineData) => {
  let industry = lineData.industry || [];
  let html = '';
  industry.forEach((item_1, index_1) => {
    let flag_isUp = item_1.hasOwnProperty('isUp');
    let ratio = '';
    if (flag_isUp) {
      ratio = `<svg width="12" height="12" viewBox="0 0 24 24">
        <path d="M12 4l-8 8h5v8h6v-8h5z" fill="#000" />
      </svg>`;
    } else {
      ratio = `<svg width="12" height="12" viewBox="0 0 24 24">
        <path d="M12 20l8-8h-5v-8h-6v8h-5z" fill="#000" />
      </svg>`;
    }
    ratio += item_1.ratio;

    html += `<div class="industry_item flex">
      <div class="industry_lie_1 truncate" title="${item_1.name}">${item_1.name}</div>
      <div class="industry_lie_2 truncate">${item_1.marketValue}</div>
      <div class="industry_lie_3">${ratio}</div>
    </div>`;
  });
  return html;
};

// 转换重仓债券数据
const Turn_bond = (lineData) => {
  let bond = lineData.bond || [];
  let html = '';
  bond.forEach((item_1, index_1) => {
    html += `<div class="bond_item_box flex justify-between items-center">
      <div class="bond_left">
        <div class="invest_item_name_text truncate">${item_1.name}</div>
        <div class="invest_item_name_text truncate" style="color:#999;">${item_1.code}</div>
        </div>
      <div class="bond_center truncate">${item_1.marketValue}</div>
      <div class="bond_right truncate">${item_1.ratio}</div>
    </div>`;
  });
  return html;
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="page_wrapper">
    <div id="list_wrapper">
      <div class="list_item" v-for="(item, index) in info.tableData" :key="item.fund_code">

        <div class="list_top flex justify-between">
          <div class="">{{ item.fund_code }}</div>
          <div class="">{{ item.fund_type }}</div>
          <div class="list_del" @click="btn_line_1(item, index)">删除</div>
        </div>

        <div class="fund_name_box">
          <div class="truncate" :title="item.fund_name" style="font-size: 12px;;">{{ item.fund_name }}</div>
        </div>

        <div class="item_box">
          <div class="item_title">资产分布</div>

          <div class="invest_wrapper" v-html="Turn_invest(item)"></div>
        </div>

        <div class="item_box">
          <div class="item_title">行业分布</div>

          <div class="industry_main_wrapper">
            <div class="industry_title_box flex">
              <div class="industry_lie_1">行业</div>
              <div class="industry_lie_2">市值(万元)</div>
              <div class="industry_lie_3">占净值比率</div>
            </div>

            <div class="industry_main_box" v-html="Turn_industry(item)"></div>
          </div>
        </div>

        <div class="item_box">
          <div class="item_title">重仓股票</div>
          <Chicang_01 :data="item.stock" class="stock_main" />
        </div>

        <div class="item_box">
          <div class="item_title">重仓债券</div>

          <div class="bond_title_box">
            <div class="bond_left">重仓债</div>
            <div class="bond_center">市值</div>
            <div class="bond_right">持仓占比</div>
          </div>

          <div class="bond_main" v-html="Turn_bond(item)"></div>
        </div>

        <div class="item_box">
          <div class="item_title">重仓基金</div>
          <Chicang_02 :data="item.fund" class="fund_main" />
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
  gap: 10px;
}

.list_item {
  position: relative;
  z-index: 2;
  width: 340px;
  min-width: 340px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f5f5f5;
}

.list_top {
  padding: 5px;
  margin: 10px 0px 0px 0px;
  background-color: #fff;
}

.fund_name_box {
  padding: 5px;
  margin: 5px 0px 0px 0px;
  background-color: #fff;
}

.list_del {
  cursor: pointer;
  color: red;
}

.item_box {
  margin: 10px 0px 5px 0px;
  background-color: #fff;
  padding: 5px;

  .item_title {
    position: relative;
    z-index: 2;
    padding: 5px 0px 5px 10px;
    font-size: 16px;
    color: #000;
  }

  :deep(.item_title::after) {
    content: '';
    position: absolute;
    left: 2px;
    top: 25%;
    display: block;
    width: 2px;
    height: 50%;
    background-color: #3117c6;

  }
}

// 行业分布
$industry_right_width: 72px;
$industry_center_width: 100px;
$industry_left_width: calc(100% - $industry_right_width - $industry_center_width);

.industry_main_wrapper {
  display: flex;
  flex-direction: column;

  .industry_title_box {
    padding: 5px;
    color: #999;
    border-bottom: 1px solid #eee;

    .industry_lie_1 {
      width: $industry_left_width;
      max-width: $industry_left_width;
    }

    .industry_lie_2 {
      text-align: right;
      width: $industry_center_width;
      max-width: $industry_center_width;
    }

    .industry_lie_3 {
      text-align: right;
      width: $industry_right_width;
      max-width: $industry_right_width;
    }
  }

  .industry_main_box {
    height: 180px;
    overflow: auto;

    :deep(.industry_item) {
      height: 18px;
      line-height: 18px;

      .industry_lie_1 {
        width: $industry_left_width;
        max-width: $industry_left_width;
      }

      .industry_lie_2 {
        text-align: right;
        width: $industry_center_width;
        max-width: $industry_center_width;
      }

      .industry_lie_3 {
        text-align: right;
        width: $industry_right_width;
        max-width: $industry_right_width;

        svg {
          vertical-align: middle;
        }
      }
    }
  }
}

.invest_wrapper {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;

  :deep(.invest_item) {
    width: 33.33%;
  }
}

// 重仓股票样式
.stock_main {
  width: 100%;
  height: 410px;
  overflow: auto;
}

// 重仓基金样式
.fund_main {
  width: 100%;
  height: 140px;
  overflow: auto;
}

// 重仓债券样式
$bond_right_width: 60px;
$bond_left_width: calc((100% - #{$bond_right_width}) * 0.6);
$bond_center_width: calc(100% - #{$bond_left_width} - #{$bond_right_width});

.bond_title_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  color: #999;
  border-bottom: 1px solid #eee;

  .bond_left {
    width: $bond_left_width;
    max-width: $bond_left_width;
  }

  .bond_center {
    max-width: $bond_center_width;
    width: $bond_center_width;
    text-align: right;
  }

  .bond_right {
    max-width: $bond_right_width;
    width: $bond_right_width;
    text-align: right;
  }
}

.bond_main {
  height: 300px;
  overflow: auto;

  :deep(.bond_item_box) {
    padding: 5px 0px 0px 0px;

    .bond_left {
      width: $bond_left_width;
      max-width: $bond_left_width;
    }

    .bond_center {
      max-width: $bond_center_width;
      width: $bond_center_width;
      text-align: right;
    }

    .bond_right {
      max-width: $bond_right_width;
      width: $bond_right_width;
      text-align: right;
    }
  }
}
</style>
