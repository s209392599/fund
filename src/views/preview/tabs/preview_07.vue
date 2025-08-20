<script setup>
const diaForm = ref(null);
const info = reactive({
  tableData: [],
  formLabelWidth: '140px',
  update_flag: 'add',// 修改还是编辑
  dialogFormVisible: false,
  form: {
    "email": "test@qq.com",
    "name": "1231",
    "update_time": "",
    "password": "1231312",
    "fund": [],
    "active": '',
    "desc": 'ceshi',
  }
})
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  name: [
    { required: true, message: '请输入备注', trigger: 'blur' },
    { min: 1, message: '至少输入1位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度至少为4位', trigger: 'blur' }
  ]
};

// 获取所有用户
const getAllUser = () => {
  server_fund_get_all_user_info({}).then(res => {
    info.tableData = res.data;
  })
}
getAllUser();

// 添加class
const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 === 1 ? 'warning-row' : 'success-row';
}
// 编辑
const btn_edit = (row, $index) => {
  console.log("编辑", row, $index);
  console.log("编辑", row.email);
}
// 停用
const btn_stop = (row, $index) => {
  console.log("停用");
}
// 删除
const btn_del = (row, $index) => {
  console.log("删除", row.email);
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
      server_fund_del_user_info({ email: row.email }).then(res => {
        console.log('res', res);
        if (res.code === 200) {
          ElMessage.success('删除成功');
          getAllUser();
        } else {
          ElMessage.error('删除失败，请重试！');
        }
      })
    })
    .catch(() => { })
}
// 新增
const addUser = () => {
  console.log("新增");
  info.update_flag = 'add';// 标识新增
  info.dialogFormVisible = true;// 打开弹窗
}
// 清空表单
const resetForm = () => {
  diaForm.value.resetFields();
}
const onSubmit = () => {
  console.log('diaForm', diaForm);
  diaForm.value.validate((valid) => {
    if (valid) {
      console.log('form', info.form);
      info.form.update_time = CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss");

      server_fund_add_user_info({
        form: info.form
      }).then(res => {
        console.log('新增', res);
        if (res.code === 200) {
          ElMessage.success('新增成功');
          info.dialogFormVisible = false;
          resetForm();
          getAllUser();
        } else {
          ElMessage.error('新增失败！')
        }
      })

    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<template>
  <div class="page-wrapper">
    <div class="flex pb-5">
      <el-button type="primary" size="small" @click="addUser()">新增用户</el-button>
    </div>

    <el-table :data="info.tableData" border :row-class-name="tableRowClassName" style="width: 100%" height="500">
      <el-table-column fixed label="序" type="index" width="50" />
      <el-table-column prop="email" label="邮箱" width="300" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="password" label="密码" width="200" />
      <el-table-column prop="desc" label="备注" width="200" />
      <el-table-column label="Operations" min-width="120">
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_edit(row, $index)">编辑</el-button>
          <el-button link type="primary" size="small" @click="btn_stop(row, $index)">停用</el-button>
          <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="info.dialogFormVisible" :title="info.update_flag" width="500">
      <el-form :model="info.form" :rules="rules" ref="diaForm">
        <el-form-item label="邮箱" prop="email" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="名称" prop="name" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="密码" prop="password" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.password" autocomplete="off" />
        </el-form-item>

        <el-form-item label="激活状态" :label-width="info.formLabelWidth">
          <el-select v-model="info.form.active" placeholder="请选择状态">
            <el-option label="在用" value="" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.desc" autocomplete="off" />
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
.page-wrapper {
  padding: 10px;
}
</style>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
