<script setup>
console.log('ahoutai/src/views/preview/tabs/preview_01.vue');
import { VueDraggable } from 'vue-draggable-plus';

// 判断是否为手机端
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const width_name = isMobile ? '146' : '240';
const tableMaxHeight = computed(() => {
  return `calc(100vh - 90px)`;
});

const diaForm = ref(null);
const info = reactive({
  tableData: [],
  formLabelWidth: '140px',
  update_flag: 'add',// 修改还是编辑
  dialogFormVisible: false,
  form: {
    "fund_code": "",
    "fund_name": "",
    "fund_type": "",
    "zhang_url": "",
    "fund_fixed": "",
    "point_down": "",
    "point_top": "",
    "fund_desc": "",
    "fund_sign": "当前",
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
    server_fund_manage_fund_query().then(res => {
      if (res.code === 200) {
        info.tableData = res.data || [];
      } else {
        ElMessage.error('获取列表失败，请重试！');
      }
    })
  }, 1000);
}
query_list();

// 编辑
const btn_edit = (row, $index) => {
  info.form = Object.assign({}, info.form, row);
  info.update_flag = 'edit';// 标识编辑
  info.dialogFormVisible = true;// 打开弹窗
}
// 删除
const btn_del = (row, $index) => {
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
      server_fund_manage_fund_delete({ id: row.id }).then(res => {
        if (res.code === 200) {
          ElMessage.success('删除成功');
          query_list();
        } else {
          ElMessage.error('删除失败，请重试！');
        }
      })
    })
    .catch(() => { })
}
// 插入到
const btn_cha = (row, $index) => {
  const userInput = prompt('请输入第几行(正整数)');
  if (userInput) {
    let index = parseFloat(userInput) || 0;
    index = Math.min(index, info.tableData.length) - 1;
    if (index > -1 && index !== $index) {
      console.log('index', index, $index);
      server_fund_public_fund_sort({
        fund_code: row.fund_code,
        index_new: index + 1,
        index_old: $index
      }).then(res => {
        if (res.code === 200) {
          ElMessage.success('操作成功');
          query_list();
        } else {
          ElMessage.error('操作失败，请重试！');
        }
      })
    }
  }
}
// 新增
const addUser = () => {
  console.log("新增");
  resetForm();
  info.update_flag = 'add';// 标识新增
  info.dialogFormVisible = true;// 打开弹窗
}
// 清空表单
const resetForm = () => {
  info.form = {
    "fund_code": "",
    "fund_name": "",
    "fund_type": "",
    "zhang_url": "",
    "fund_fixed": "",
    "point_down": "",
    "point_top": "",
    "fund_desc": "",
    "fund_sign": "当前",
  }
  diaForm?.value?.resetFields();

}
// 弹窗提交
const onSubmit = () => {
  diaForm.value.validate((valid) => {
    if (valid) {
      console.log('form', JSON.stringify(info.form));

      if (info.update_flag === 'add') {
        server_fund_manage_fund_add({
          form: info.form
        }).then(res => {
          console.log('新增', res);
          if (res.code === 200) {
            ElMessage.success('新增成功');
            info.dialogFormVisible = false;
            resetForm();
            query_list();
          } else {
            ElMessage.error('新增失败！')
          }
        })
      } else {
        server_fund_manage_fund_update({
          form: info.form
        }).then(res => {
          console.log('更新', res);
          if (res.code === 200) {
            ElMessage.success('更新成功');
            info.dialogFormVisible = false;
            resetForm();
            query_list();
          } else {
            ElMessage.error('更新失败！')
          }
        })
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
const updateOrder = () => {
  const email = localStorage.getItem('email') || null;
  if (!email) {
    ElMessage.error('请先登录！');
    return;
  }
  server_fund_public_fund_sort({
    email: email,
    fund_code: info.tableData.map(item => item.fund_code)
  }).then(res => {
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
  console.log('info.tableData', info.tableData);
};
// 复制基金号
const btn_fn_03 = () => {
  const str = info.tableData.map(v => v.fund_code).join(',');
  fallbackCopyText(str);
}
// 复制基金数组
const btn_fn_04 = () => {
  const str = info.tableData.map(v => {
    return {
      fund_code: v.fund_code,
      fund_name: v.fund_name,
      fund_type: v.fund_type
    }
  });
  fallbackCopyText(JSON.stringify(str));
}
</script>

<template>
  <div class="page-wrapper pd-10">
    <div class="flex pb-5">
      <el-button type="primary" size="small" @click="addUser()">新增基金</el-button>
      <el-button type="primary" size="small" @click="updateOrder()">更新服务器排序</el-button>
      <el-button type="primary" size="small" @click="btn_fn_03()">复制基金号</el-button>
      <el-button type="primary" size="small" @click="btn_fn_04()">复制基金数组</el-button>
    </div>

    <VueDraggable v-model="info.tableData" :animation="150" target="tbody" :disabled="false" @end="onDragEnd"
      class="el-table" handle=".drag-handle" filter=".no-drag">

      <el-table :data="info.tableData" border style="width: 100%" :max-height="tableMaxHeight">
        <el-table-column fixed label="拽" type="index" width="40" align="center">
          <template #default="{ $index }">
            <div class="drag-handle"
              style="cursor: grab; color: #909399; display: flex; align-items: center;justify-content:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" />
              </svg>
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed label="序" type="index" width="50" align="right" />

        <el-table-column label="Operations" width="140">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_edit(row, $index)">编辑</el-button>
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
            <el-button link type="primary" size="small" @click="btn_cha(row, $index)">插入到</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="fund_code" align="center" label="基金号" width="64">
          <template v-slot="{ row }">
            <a :href="`https://fund.eastmoney.com/${row.fund_code}.html`" target="_blank"
              style="text-decoration: none;">
              <span v-if="row.sign === '历史'" style="color:#876ad2;font-weight: 700;">{{ row.fund_code }}</span>
              <span v-else>{{ row.fund_code }}</span>
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="fund_name" label="Name" :width="width_name" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.sign === '历史'" style="color:#876ad2;font-weight: 700;">{{ row.fund_name }}</span>
            <span v-else>{{ row.fund_name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" width="70" align="center" sortable show-overflow-tooltip>
          <template v-slot="{ row }">
            <span v-if="row.sign === '历史'" style="color:#876ad2;font-weight: 700;">{{ row.fund_type }}</span>
            <span v-else>{{ row.fund_type }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="zhang_url" label="涨幅的URL" width="320" />
        <el-table-column prop="fixed" label="定投金额" width="70" align="right" />
        <el-table-column prop="point_down" label="低点" width="100" align="right" />
        <el-table-column prop="point_top" label="高点" width="100" align="right" />
        <el-table-column prop="fund_desc" label="备注" width="300" />


      </el-table>
    </VueDraggable>

    <el-dialog v-model="info.dialogFormVisible" :title="info.update_flag" width="500">
      <el-form :model="info.form" :rules="rules" ref="diaForm">
        <el-form-item label="基金代码" prop="fund_code" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_code" autocomplete="off" />
        </el-form-item>

        <el-form-item label="名称" prop="fund_name" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="类型" prop="fund_type" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_type" autocomplete="off" />
        </el-form-item>

        <el-form-item label="涨幅的URL" prop="zhang_url" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.zhang_url" autocomplete="off" />
        </el-form-item>

        <el-form-item label="定投金额" prop="fund_fixed" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_fixed" autocomplete="off" />
        </el-form-item>

        <el-form-item label="净值提示-低点" prop="point_down" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.point_down" autocomplete="off" />
        </el-form-item>

        <el-form-item label="净值提示-高点" prop="point_top" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.point_top" autocomplete="off" />
        </el-form-item>

        <el-form-item label="备注" prop="fund_desc" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_desc" autocomplete="off" />
        </el-form-item>

        <el-form-item label="状态" prop="fund_sign" :label-width="info.formLabelWidth">
          <el-radio-group v-model="info.form.fund_sign">
            <el-radio value="正常">正常</el-radio>
            <el-radio value="历史">历史</el-radio>
            <el-radio value="观察">观察</el-radio>
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

<style scoped lang="scss"></style>
