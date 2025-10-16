<script setup>
console.log('amain/src/views/preview/tabs/preview_07.vue');
// 基金维护
import { VueDraggable } from 'vue-draggable-plus';

// 判断是否为手机端
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const width_name = isMobile ? '240' : '240';

const diaForm = ref(null);
const info = reactive({
  table_height: isMobile ? 500 : 800,
  add_line_sign: 0,// 哪一个位置插入
  tableData: [],
  formLabelWidth: '110px',
  update_flag: '新增',// 修改还是编辑
  dialogFormVisible: false,
  edit_index: 0,// 编辑行的index
  form: {
    "fund_code": "",
    "fund_name": "",
    "fund_type": "",
    "zhang_url": "",
    "fund_fixed": 100,
    "fundgz": '2',// 1:天天基金有预测涨幅 2:没有
    "point_down": 1,
    "point_top": 1,
    "fund_desc": "",
    "fund_sign": "正常",
  }
})
const rules = {
  fund_code: [
    { required: true, message: '请输入基金代码', trigger: 'blur' },
    { min: 6, message: '至少输入6位', trigger: 'blur' }
  ],
  fund_name: [
    { required: true, message: '请输入基金名称', trigger: 'blur' },
  ],
  fund_type: [
    { required: true, message: '请输入基金类型', trigger: 'blur' },
  ],
};
// 获取-列表数据
const query_list = () => {
  setTimeout(() => {
    server_fund_amain_fund_query_by_user({
      fund_user_id: localStorage.getItem('user_id')
    }).then(res => {
      console.log('res', res);
      if (res.code === 200) {
        ElMessage.success('已读取最新数据');
        info.tableData = res.data.data || [];
      } else {
        ElMessage.error('获取列表失败，请重试！');
      }
    })
  }, 300);
}
query_list();

// 编辑
const btn_edit = (row, $index) => {
  info.form = Object.assign({}, info.form, row);
  info.update_flag = 'edit';// 标识编辑
  info.edit_index = $index;
  info.dialogFormVisible = true;// 打开弹窗
}
// 删除
const btn_del_fn = (row, $index) => {
  ElMessageBox.confirm(
    '确认删除吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      info.tableData.splice($index, 1); // 删除对应索引的数据
      ElMessage.success('删除成功');
    })
    .catch(() => { })
}
// 前插
const btn_pre = (row, $index) => {
  resetForm();
  info.add_line_sign = $index - 1;
  info.update_flag = '新增';// 标识新增
  info.dialogFormVisible = true;// 打开弹窗
}
// 后插
const btn_ape = (row, $index) => {
  resetForm();
  info.add_line_sign = $index + 1;
  info.update_flag = '新增';// 标识新增
  info.dialogFormVisible = true;// 打开弹窗
}
// 新增
const addNewFund = () => {
  resetForm();
  info.add_line_sign = info.tableData.length;// 最后一个位置插入
  info.update_flag = '新增';// 标识新增
  info.dialogFormVisible = true;// 打开弹窗
}
// 清空表单
const resetForm = () => {
  info.form = {
    "fund_code": "",
    "fund_name": "",
    "fund_type": "",
    "zhang_url": "",
    "fund_fixed": 100,
    "fundgz": '2',
    "point_down": 1,
    "point_top": 1,
    "fund_desc": "",
    "fund_sign": "正常",
  }
  diaForm?.value?.resetFields();

}
const tablechange = () => {
  if (info.update_flag === '新增') {
    let flag = info.tableData.some(v => v.fund_code === info.form.fund_code);
    if (!flag) {
      const maxIndex = info.tableData.length;
      const insertIndex = Math.max(0, Math.min(Math.floor(info.add_line_sign), maxIndex));
      let newObj = {
        ...info.form
      }
      info.tableData.splice(insertIndex, 0, newObj);
      info.dialogFormVisible = false;
    } else {
      ElMessage.error('已存在当前基金号');
    }
  } else {
    info.tableData[info.edit_index] = { ...info.tableData[info.edit_index], ...info.form };
    info.dialogFormVisible = false;
  }
}
// 弹窗提交
const onSubmit = () => {
  diaForm.value.validate((valid) => {
    if (valid) {
      if (info.form.fundgz === '2') {
        ElMessageBox.confirm(
          '可能读取不到实时涨幅，确认提交吗?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            tablechange();
          })
          .catch(() => { })
      } else {
        tablechange();
      }
    }
  });
};

const SaveData = () => {
  const fund_info = info.tableData.map((item, index) => {
    item.sort_order = index + 1;
    return item;
  })
  server_fund_amain_save_fund_data({
    fund_info: fund_info,
    fund_user_id: localStorage.getItem('user_id'),
  }).then(res => {
    console.log('res', res);
    if (res.code === 200) {
      ElMessage.success('操作成功');
      query_list();
    } else {
      ElMessage.error('操作失败，请重试！');
    }
  })
}

const onDragEnd = (evt) => {
  console.log('拖拽完成:', info.tableData.map(item => item.fund_code));
};

const btn_fn_2 = () => {
  if (!info.form.fund_code || info.form.fund_code.length !== 6) {
    ElMessage.error('请输入正确的基金代码');
    return;
  }
  window.open(`https://j4.dfcfw.com/charts/pic6/${info.form.fund_code}.png`, '_blank');
}
const btn_fn_3 = () => {
  if (!info.form.fund_code || info.form.fund_code.length !== 6) {
    ElMessage.error('请输入正确的基金代码');
    return;
  }
  info.form.zhang_url = `https://j4.dfcfw.com/charts/pic6/${info.form.fund_code}.png`;
}
const btn_fn_4 = () => {
  info.form.zhang_url = '无';
}

const change_fund_code = (val) => {
  var isSixDigitNumber = /^\d{6}$/.test(val);// 6位数字类型
  if (isSixDigitNumber) {
    info.form.zhang_url = `https://j4.dfcfw.com/charts/pic6/${info.form.fund_code}.png`;
    server_fund_amain_getfundgz({
      fundcode: val,
    }).then(res => {
      if (res.code === 200) {
        info.form.fund_name = res.data.fund_name;
        if (res.data.fund_name.length) {
          info.form.fundgz = '1';
        }
      } else {
        ElMessage.error('获取实时涨幅失败！')
      }
    })
  } else {
    info.form.zhang_url = '';
  }
}
// 合并群主基金
const groupPublic = () => {
  server_fund_amain_public_funds().then(res => {
    console.log('res', res);
    if (res.code === 200) {
      const arr_1 = [...info.tableData];
      const arr_2 = res.data || [];
      arr_2.forEach(item => {
        const flag = arr_1.some(fund => fund.fund_code === item.fund_code);
        if (!flag) {
          arr_1.push(item);
        }
      });
      info.tableData = [...arr_1];
    } else {
      ElMessage.error('操作失败，请重试！');
    }
  })
}

</script>

<template>
  <div class="page-wrapper pd-10">
    <div>注：基金数量有变化时一定要点<span style="color:red;">“保存数据”</span>按钮！</div>
    <div class="top_btn_wrapper flex flex-wrap pb-5">
      <el-button type="primary" size="small" @click="addNewFund()">新增基金</el-button>
      <el-button type="primary" size="small" @click="SaveData()"
        :disabled="info.tableData.length === 0">保存数据</el-button>
      <el-button type="primary" size="small" @click="info.tableData = []"
        :disabled="info.tableData.length === 0">全部删除</el-button>
      <el-button type="primary" size="small" @click="groupPublic()">合并群主基金</el-button>
      <el-button type="primary" size="small" @click="query_list()">刷新数据</el-button>
    </div>

<!--
handle=".drag-handle"  只允许通过手柄拖拽
filter=".no-drag"     过滤不可拖拽元素
-->
    <VueDraggable v-model="info.tableData" :animation="150" target="tbody" :disabled="false" @end="onDragEnd"
      class="el-table"
      handle=".drag-handle"
      filter=".no-drag"
    >
      <el-table :data="info.tableData" border style="width: 100%" :height="info.table_height">
      <el-table-column
          fixed
          type="index"
          align="center"
          label="序"
          width="36"
        ></el-table-column>

    <el-table-column fixed label="拽" type="index" width="40" align="center">
      <template #default="{ $index }">
        <div class="drag-handle" style="cursor: grab; color: #909399; display: flex; align-items: center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
          </svg>
        </div>
      </template>
    </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_edit(row, $index)">编辑</el-button>
            <el-button link type="primary" size="small" @click="btn_del_fn(row, $index)">删除</el-button>
            <el-button link type="primary" size="small" @click="btn_pre(row, $index)">前插</el-button>
            <el-button link type="primary" size="small" @click="btn_ape(row, $index)">后插</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="fund_code" align="center" label="基金号" width="64">
          <template v-slot="{ row }">
            <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank"
              style="text-decoration: none;">
              <span v-if="row.fund_sign === '历史'" style="color:#876ad2;font-weight: 700;">{{ row.fund_code }}</span>
              <span v-else>{{ row.fund_code }}</span>
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="fund_name" label="基金名称" :width="width_name" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.fund_sign === '历史'" style="color:#876ad2;font-weight: 700;">{{ row.fund_name }}</span>
            <span v-else>{{ row.fund_name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="fund_type" label="类型" width="70" align="center" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.fund_sign === '历史'" style="color:#876ad2;font-weight: 700;">{{ row.fund_type }}</span>
            <span v-else>{{ row.fund_type }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="fund_fixed" label="定投金额" width="70" align="right" />
        <el-table-column prop="point_down" label="低点" width="100" align="right" />
        <el-table-column prop="point_top" label="高点" width="100" align="right" />
        <el-table-column prop="fund_sign" label="状态" width="50" align="center" />
        <el-table-column prop="fund_desc" label="备注" width="300" />
        <el-table-column prop="zhang_url" label="涨幅的URL" width="320" />
      </el-table>
    </VueDraggable>

    <el-dialog v-model="info.dialogFormVisible" :title="info.update_flag" width="500">
      <el-form :model="info.form" :rules="rules" ref="diaForm">
        <el-form-item label="基金代码" prop="fund_code" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_code" @change="change_fund_code" autocomplete="off" />
        </el-form-item>

        <el-form-item label="名称" prop="fund_name" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="类型" prop="fund_type" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_type" autocomplete="off" />
        </el-form-item>

        <el-form-item label="涨幅的URL" prop="zhang_url" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.zhang_url" autocomplete="off" />
          <div class="">
            <el-button link type="primary" size="small" @click="btn_fn_2">去查看是否正常</el-button>
            <el-button link type="primary" size="small" @click="btn_fn_3">默认</el-button>
            <el-button link type="primary" size="small" @click="btn_fn_4">无</el-button>
          </div>
        </el-form-item>

        <el-form-item label="定投金额" prop="fund_fixed" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_fixed" type="number" min="0" autocomplete="off" />
        </el-form-item>

        <el-form-item label="净值提示-低点" prop="point_down" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.point_down" type="number" min="0.0001" autocomplete="off" />
        </el-form-item>

        <el-form-item label="净值提示-高点" prop="point_top" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.point_top" type="number" min="0.0001" autocomplete="off" />
        </el-form-item>

        <el-form-item label="备注" prop="fund_desc" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_desc" autocomplete="off" />
        </el-form-item>

        <el-form-item label="状态" prop="fund_sign" :label-width="info.formLabelWidth">
          <el-radio-group v-model="info.form.fund_sign">
            <el-radio value="正常">正常</el-radio>
            <el-radio value="观察">观察</el-radio>
            <el-radio value="历史">历史</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="info.dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.top_btn_wrapper button {
  margin: 5px;
}
</style>
