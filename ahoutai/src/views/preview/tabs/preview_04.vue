<script setup>
console.log('ahoutai/src/views/preview/tabs/preview_04.vu');

const info = reactive({
  active_type: '科创50',// 当前选中的分类
  // 分类的所有数据
  list: [
    {
      "type": "科创50",
      "data": [
        {
          "fund_code": "011609",
          "fund_name": "易方达上证科创50ETF联接C",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "011613",
          "fund_name": "华夏科创50ETF联接C",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        }
      ]
    },
    {
      "type": "北证50",
      "data": [
        {
          "fund_code": "017513",
          "fund_name": "广发北证50成份",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "017516",
          "fund_name": "易方达北证50成",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "018113",
          "fund_name": "工银北证50成份",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        }
      ]
    },
    {
      "type": "红利",
      "data": [
        {
          "fund_code": "023918",
          "fund_name": "华夏国证自由现金流ETF联接C",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "019261",
          "fund_name": "富国恒生红利ETF联接C",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "020867",
          "fund_name": "华安恒生港股通中国央企红利ETF发起式联接C",
          "fund_type": "指数型-股票",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "021143",
          "fund_name": "华夏港股通央企红利ETF联接C",
          "fund_type": "指数型-股票",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "021962",
          "fund_name": "景顺长城中证国新港股通央企红利ETF联接C",
          "fund_type": "指数型-股票",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        }
      ]
    },
    {
      "type": "量化",
      "data": [
        {
          "fund_code": "016858",
          "fund_name": "国金量化多因子股票C",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "021991",
          "fund_name": "中加专精特新量化混合C",
          "fund_type": "",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "011068",
          "fund_name": "华宝资源优选混合C",
          "fund_type": "混合型-偏股",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "002872",
          "fund_name": "华夏智胜价值成长股票C",
          "fund_type": "股票型",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "015881",
          "fund_name": "中欧小盘成长混合C",
          "fund_type": "混合型-偏股",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "002233",
          "fund_name": "工银丰收回报灵活配置混合C",
          "fund_type": "混合型-灵活",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "022270",
          "fund_name": "中信保诚周期优选混合C",
          "fund_type": "混合型-偏股",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        }
      ]
    },
    {
      "type": "工业母机",
      "data": [
        {
          "fund_code": "017574",
          "fund_name": "华夏中证机床ETF发起式联接C",
          "fund_type": "指数型-股票",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "017472",
          "fund_name": "国泰中证机床ETF发起联接C",
          "fund_type": "",
          "fund_desc": "指数型-股票",
          "update_time": "2025-12-26 17:27:47"
        }
      ]
    },
    {
      "type": "脑机-医药",
      "data": [
        {
          "fund_code": "000591",
          "fund_name": "中银健康生活混合",
          "fund_type": "混合型-偏股",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        },
        {
          "fund_code": "001056",
          "fund_name": "华银健康生活主题灵活配置",
          "fund_type": "混合型-灵活",
          "fund_desc": "",
          "update_time": "2025-12-26 17:27:47"
        }
      ]
    }
  ],
  tableData: [],
})
const tableMaxHeight = computed(() => {
  return `calc(100vh - 60px)`;
});


info.tableData = info.list[0].data;

// 新增分类
const btn_fn_1 = () => {
  const type = prompt('请输入分类名称', '');
  const str = (type || '').trim();
  if (str !== '') {
    // 判断是否存在
    const flag = info.list.some(item => item.type === str);
    if (flag) {
      ElMessage.error('分类已存在');
      return;
    }
    info.list.push({
      type: str,
      data: [],
    });
    changeType(str);
  }
};

// 保存数据
const btn_fn_2 = () => {
  console.log('保存数据', info.list);
};

// 新增基金
const btn_fn_3 = () => {
  const fund_code = prompt('请输入基金号', '');
  if (fund_code !== null && fund_code.trim() !== '') {
    info.tableData.push({
      fund_code: fund_code.trim(),
      fund_name: '',
      fund_type: '',
      fund_desc: '',
      update_time: '',
    });
  }
};
// 批量导入
const btn_fn_4 = () => {
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = '.xlsx, .xls';
  file.click();
};

// 切换分类
const changeType = (type) => {
  info.active_type = type || (info.list[0] || {}).type || '';
  if (info.active_type === '') {
    info.tableData = [];
    return;
  }
  info.tableData = info.list.find(item => item.type === info.active_type).data || [];
};

// 编辑分类
const btn_fn_5 = (type) => {
  const str_1 = prompt('请输入分类名称', '');
  const str_2 = (str_1 || '').trim();
  if (str_2 !== '') {
    // 判断是否存在
    const flag = info.list.some(item => item.type === str_2);
    if (flag) {
      ElMessage.error('分类已存在');
      return;
    }
    // 修改名称
    const obj = info.list.find(item => item.type === type);
    if (obj) {
      obj.type = str_2;
    }
    // 如果是当前分类，也要修改
    if (info.active_type === type) {
      info.active_type = str_2;
    }
    changeType(str_2);
  }
};

// 删除分类
const btn_fn_6 = (type) => {
  info.list = info.list.filter(item => item.type !== type);
  if (info.active_type === type) {
    changeType((info.list[0] || {}).type || '');
  }
};


// 编辑
const btn_fn_7 = (row, index) => {
  console.log('编辑', row, index);
};

// 删除
const btn_fn_8 = (row, index) => {
  console.log('删除', row, index);
};
</script>

<template>
  <div class="page-wrapper h-full flex">
    <div class="page_left flex flex-col">
      <div class="left_top flex items-center justify-center">
        <el-button type="primary" @click="btn_fn_1()">新增分类</el-button>
        <el-button type="primary" @click="btn_fn_2()">保存数据</el-button>
      </div>

      <div class="left_content flex-1">
        <div class="left_item flex" v-for="item in info.list" :key="item.type"
          :class="{ 'active': item.type === info.active_type }" @click="changeType(item.type)">
          <div class="type_text flex-1">{{ item.type }}</div>
          <div class="type_edit" @click.stop="btn_fn_5(item.type)">
            <span style="font-family: Arial; font-size: 16px;">&#x270E;</span> <!-- 显示为 ✎ -->
          </div>
          <div class="type_del" @click.stop="btn_fn_6(item.type)">
            <span style="font-family: Arial; font-size: 16px;">&#x2716;</span> <!-- 显示为 ✖ -->
          </div>
        </div>
      </div>
    </div>

    <div class="page_right flex-1 flex_col">
      <div class="right_top items-center flex pl-10 pr-10 border-b">
        <el-button type="primary" @click="btn_fn_3()" :disabled="!info.active_type">新增基金</el-button>
        <el-button type="primary" @click="btn_fn_4()" :disabled="!info.active_type">批量导入</el-button>
      </div>

      <div class="right_content flex-1 pd-10">
        <el-table :data="info.tableData" border style="width: 100%" :max-height="tableMaxHeight">
          <el-table-column fixed label="序" type="index" width="50" align="center" />

          <el-table-column fixed label="操作" width="100" align="center">
            <template #default="{ row, $index }">
              <el-button link type="primary" size="small" @click="btn_fn_7(row, $index)">编辑</el-button>
              <el-button link type="primary" size="small" @click="btn_fn_8(row, $index)">删除</el-button>
            </template>
          </el-table-column>

          <el-table-column fixed prop="fund_code" align="center" label="基金号" width="80">
            <template v-slot="{ row }">
              <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank"
                style="text-decoration: none">
                <span>{{ row.fund_code }}</span>
              </a>
            </template>
          </el-table-column>

          <el-table-column prop="fund_name" label="基金名称" width="380" />
          <el-table-column prop="fund_type" label="基金类型" width="130" />
          <el-table-column prop="fund_desc" label="备注" width="280" />
        </el-table>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.page-wrapper {
  .page_left {
    min-width: 200px;
    max-width: 200px;
    border-right: 1px solid #e8e8e8;

    .left_top {
      height: 50px;
      border-bottom: 1px solid #e8e8e8;
    }

    .left_content {
      height: calc(100% - 50px);
      overflow: auto;
      padding: 0px 5px;

      .left_item {
        margin: 4px 0;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        padding: 0px 10px;
        border-radius: 4px;

        .type_text {
          &:hover {
            color: #e722e3;
          }
        }

        .type_edit,
        .type_del {
          width: 20px;
          height: 100%;
          cursor: pointer;
          margin-right: 0px 5px;

          &:hover {
            color: #e722e3;
          }
        }

        &:hover {
          background-color: #f0f0f0;
        }

        &.active {
          background-color: #e722e3 !important;

          .type_text {
            color: #fff !important;
          }

          .type_edit:hover,
          .type_del:hover {
            color: #fff !important;
          }
        }
      }
    }
  }
}

.page_right {
  .right_top {
    height: 50px;
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>
