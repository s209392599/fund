<script setup>
console.log('ahoutai/src/views/preview/tabs/preview_04.vu');
import { VueDraggable } from 'vue-draggable-plus';

const formRef = ref(null);
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
  dialogFormVisible: false,// 对话框是否显示
  update_flag: '',// 对话框的标题
  form: {},// 对话框的表单数据
  tableKey: new Date().getTime(),// 用于强制刷新表格
})
info.tableData = info.list[0].data;

const tableMaxHeight = computed(() => {
  return `calc(100vh - 60px)`;
});

// 表单验证规则
const rules = {
  fund_code: [
    { required: true, message: '请输入基金号', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '基金号必须是6位数字', trigger: 'blur' }
  ],
  fund_name: [{ required: true, message: '请输入基金名称', trigger: 'blur' }]
};

// 新增分类
const btn_fn_01 = () => {
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
const btn_fn_02 = () => {
  console.log('保存数据', info.list);
};

// 新增基金
const btn_fn_03 = () => {
  info.form = {
    fund_code: '',
    fund_name: '',
    fund_type: '',
    fund_desc: '',
    _originalFundCode: null, // 明确标识这是新增，不是编辑
  }
  info.dialogFormVisible = true;
};
// 批量导入
const btn_fn_04 = () => {
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = '.xlsx, .xls';
  file.click();
};
// 切换分类
const changeType = (type) => {
  info.tableData = [];
  info.active_type = type || (info.list[0] || {}).type || '';
  if (info.active_type === '') {
    info.tableData = [];
    return;
  }
  const foundItem = info.list.find(item => item.type === info.active_type);
  if (!foundItem) {
    info.tableData = [];
    return;
  }
  info.tableData = [...foundItem.data];
  info.tableKey = new Date().getTime();
};

// 编辑分类
const btn_fn_05 = (type) => {
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
const btn_fn_06 = (type) => {
  info.list = info.list.filter(item => item.type !== type);
  if (info.active_type === type) {
    changeType((info.list[0] || {}).type || '');
  }
};


// 编辑基金 - 修改
const btn_fn_07 = (row) => {
  console.log('编辑', row);
  info.update_flag = '编辑基金';
  info.form = {
    ...row,
    _originalFundCode: row.fund_code, // 保存原始基金号
  };
  console.log('info.form', info.form);
  info.dialogFormVisible = true;
};

// 删除基金
const btn_fn_08 = (row, index) => {
  // 从当前显示的表格数据中删除
  const tableIndex = info.tableData.findIndex(item => item.fund_code === row.fund_code);
  if (tableIndex !== -1) {
    info.tableData.splice(tableIndex, 1);
  }

  // 同步到分类数据
  const obj = info.list.find(item => item.type === info.active_type);
  if (obj) {
    obj.data = [...info.tableData];
  }
};

// 编辑基金的弹窗保存
const btn_fn_09 = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      let fundData = {
        fund_code: info.form.fund_code,
        fund_name: info.form.fund_name,
        fund_type: info.form.fund_type,
        fund_desc: info.form.fund_desc,
        update_time: CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"),
      }

      const obj = info.list.find(item => item.type === info.active_type);
      if (!obj) {
        ElMessage.error('分类不存在');
        return;
      }

      // 检查是否是编辑模式
      const isEditMode = info.form._originalFundCode;

      if (isEditMode) {
        // 编辑模式
        if (info.form._originalFundCode !== info.form.fund_code) {
          // 基金号被修改了，检查新基金号是否已存在
          const codeExists = obj.data.some(item =>
            item.fund_code === fundData.fund_code &&
            item.fund_code !== info.form._originalFundCode
          );
          if (codeExists) {
            ElMessage.error('基金号已存在');
            return;
          }
        }
      } else {
        // 新增模式，检查基金号是否已存在
        const codeExists = obj.data.some(item => item.fund_code === fundData.fund_code);
        if (codeExists) {
          ElMessage.error('基金号已存在');
          return;
        }
      }

      // 关键：直接操作 info.tableData 而不是 obj.data
      if (isEditMode) {
        // 编辑 - 替换现有项
        const index = info.tableData.findIndex(item => item.fund_code === info.form._originalFundCode);
        if (index !== -1) {
          // Vue 的响应式数组更新
          info.tableData.splice(index, 1, fundData);
        }
      } else {
        // 新增 - 添加到末尾
        info.tableData.push(fundData);
      }

      // 同步到 obj.data
      obj.data = [...info.tableData];

      info.dialogFormVisible = false;
      info.form = {
        index: null,
        _originalFundCode: null
      };

      // 等待下一个 tick 确保数据更新
      await nextTick();

      // 强制重新渲染表格
      info.tableKey = Date.now().getTime();

      ElMessage.success(isEditMode ? '编辑成功' : '新增成功');
    } else {
      console.log('表单验证失败');
      return false;
    }
  });
};

const onDragEnd = (evt) => {
  console.log(info.tableData.map(item => item.fund_code));
  const find_index = info.list.findIndex(item => item.type === info.active_type);
  if (find_index === -1) return;

  // 直接更新分类的数据
  info.list[find_index].data = [...info.tableData];
};
</script>

<template>
  <div class="page-wrapper h-full flex">
    <div class="page_left flex flex-col">
      <div class="left_top flex items-center justify-center">
        <el-button type="primary" @click="btn_fn_01()">新增分类</el-button>
        <el-button type="primary" @click="btn_fn_02()">保存数据</el-button>
      </div>

      <div class="left_content flex-1">
        <div class="left_item flex" v-for="item in info.list" :key="item.type"
          :class="{ 'active': item.type === info.active_type }" @click="changeType(item.type)">
          <div class="type_text flex-1">{{ item.type }}</div>
          <div class="type_edit" @click.stop="btn_fn_05(item.type)">
            <span style="font-family: Arial; font-size: 16px;">&#x270E;</span> <!-- 显示为 ✎ -->
          </div>
          <div class="type_del" @click.stop="btn_fn_06(item.type)">
            <span style="font-family: Arial; font-size: 16px;">&#x2716;</span> <!-- 显示为 ✖ -->
          </div>
        </div>
      </div>
    </div>

    <div class="page_right flex-1 flex_col">
      <div class="right_top items-center flex pl-10 pr-10 border-b">
        <el-button type="primary" @click="btn_fn_03()" :disabled="!info.active_type">新增基金</el-button>
        <el-button type="primary" @click="btn_fn_04()" :disabled="!info.active_type">批量导入</el-button>
      </div>

      <div class="right_content flex-1 pd-10">
        <VueDraggable v-model="info.tableData" :animation="150" target="tbody" :disabled="false" @end="onDragEnd"
          class="el-table" handle=".drag-handle" filter=".no-drag">
          <el-table :data="info.tableData" :key="info.tableKey" border style="width: 100%" :max-height="tableMaxHeight">
            <el-table-column fixed label="序" type="index" width="50" align="center" />

            <el-table-column fixed label="拽" type="" width="40" align="center">
              <template #default="{ $index }">
                <div class="drag-handle"
                  style="cursor: grab; color: #909399; display: flex; align-items: center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" />
                  </svg>
                </div>
              </template>
            </el-table-column>

            <el-table-column fixed label="操作" width="100" align="center">
              <template #default="{ row, $index }">
                <el-button link type="primary" size="small" @click="btn_fn_07(row, $index)">编辑</el-button>
                <el-button link type="primary" size="small" @click="btn_fn_08(row, $index)">删除</el-button>
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
            <el-table-column prop="update_time" label="更新时间" width="160" />
          </el-table>
        </VueDraggable>
      </div>
    </div>
  </div>

  <!-- 编辑基金的弹窗 -->
  <el-dialog v-model="info.dialogFormVisible" title="编辑基金" width="400px" :close-on-click-modal="false">
    <el-form :model="info.form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="基金号" prop="fund_code">
        <el-input v-model="info.form.fund_code" placeholder="请输入基金号" />
      </el-form-item>
      <el-form-item label="基金名称" prop="fund_name">
        <el-input v-model="info.form.fund_name" placeholder="请输入基金名称" />
      </el-form-item>
      <el-form-item label="基金类型" prop="fund_type">
        <el-input v-model="info.form.fund_type" placeholder="请输入基金类型" />
      </el-form-item>
      <el-form-item label="备注" prop="fund_desc">
        <el-input v-model="info.form.fund_desc" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="btn_fn_09()">保存</el-button>
      <el-button type="primary" @click="info.dialogFormVisible = false">取消</el-button>
    </template>
  </el-dialog>
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
