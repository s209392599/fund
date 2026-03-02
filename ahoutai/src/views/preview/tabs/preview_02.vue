<script setup>
console.log('ahoutai/src/views/preview/tabs/preview_02.vue');

const maxTableHeight = 'calc(100vh - 100px)';

const diaForm = ref(null);
const info = reactive({
  tableData: [],
  formLabelWidth: '140px',
  update_flag: 'add',// 修改还是编辑
  dialogFormVisible: false,
  search_name: '',
  /*
    {
      "id": 1,
      "user_email": "209392599@qq.com",
      "user_password": "qaz123..",
      "fund_count": 100,
      "user_remark": "郭坤",
      "expiration_time": "2098-12-31T16:00:00.000Z",
      "create_time": "2025-09-23T04:24:38.000Z",
      "update_time": "2026-01-06T23:34:27.000Z",
      "user_token": "boxue666",
      "user_status": null
    }
  */
  form: {
    "user_email": "",
    "user_email": "",
    "zh_name": "",
    "user_password": "",
    "fund_count": 30,
    "remark": "",
    "expiration_time": "",// 过期时间
    "create_time": "",// 创建时间
    "update_time": "",// 更新时间
    "user_token": "",// 专属令牌(二级密码)
    "user_status": "",// 用户状态(1:停用，其他为可用)
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

const queryBtn = () => {
  if (!info.search_name) {
    ElMessage.error('请输入账号或名称');
    return;
  }
  server_fund_get_all_user_info({
    search_name: info.search_name
  }).then(res => {
    info.tableData = res.data;
  })
}
// 重置
const resetFn = () => {
  info.search_name = '';
  getAllUser();
}

// 添加class
const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 === 1 ? 'warning-row' : 'success-row';
}
// 编辑
const btn_edit = (row, $index) => {
  info.form = Object.assign({}, info.form, row);
  info.update_flag = 'edit';// 标识编辑
  info.dialogFormVisible = true;// 打开弹窗
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
// 弹窗提交
const onSubmit = () => {
  diaForm.value.validate((valid) => {
    if (valid) {
      console.log('form', info.form);
      info.form.update_time = CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss");

      if (info.update_flag === 'add') {
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
        server_fund_update_user_info({
          form: info.form
        }).then(res => {
          console.log('更新', res);
          if (res.code === 200) {
            ElMessage.success('更新成功');
            info.dialogFormVisible = false;
            resetForm();
            getAllUser();
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
</script>

<template>
  <div class="page-wrapper">
    <div class="flex pb-5">
      <el-button type="primary" size="small" @click="addUser()">新增用户</el-button>

      <el-input v-model="info.search_name" style="width: 240px" placeholder="Please input" />
      <el-button type="primary" size="small" @click="queryBtn()">搜索</el-button>
      <el-button type="primary" size="small" @click="resetFn()">重置</el-button>
    </div>

    <!--
    {
  "id": 1,
  "user_email": "209392599@qq.com",
  "zh_name": "郭坤",
  "user_password": "1234",
  "fund_count": 100,
  "remark": null,
  "expiration_time": "2098-12-31T16:00:00.000Z",
  "create_time": "2025-09-23T04:24:38.000Z",
  "update_time": "2025-09-23T05:01:25.000Z",
  "user_token": null
}
    -->
    <el-table :data="info.tableData" border :row-class-name="tableRowClassName" style="width: 100%"
      :height="maxTableHeight">
      <el-table-column fixed label="序" type="index" width="50" align="center" />
      <el-table-column fixed label="操作" width="140">
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_edit(row, $index)">编辑</el-button>
          <el-button link type="primary" size="small" @click="btn_stop(row, $index)">停用</el-button>
          <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="user_remark" label="备注" width="150" />
      <el-table-column prop="user_email" label="账号" width="240" />
      <el-table-column prop="user_password" label="密码" width="200" />
      <el-table-column prop="fund_count" label="基金数量" width="100" />
      <el-table-column prop="create_time" label="创建时间" width="145">
        <template #default="{ row }">
          {{ CustomDateFtt(new Date(row.create_time), "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="145">
        <template #default="{ row }">
          {{ CustomDateFtt(new Date(row.update_time), "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="user_token" label="user_token" width="100" />

    </el-table>

    <el-dialog v-model="info.dialogFormVisible" :title="info.update_flag" width="500">
      <el-form :model="info.form" :rules="rules" ref="diaForm">
        <el-form-item label="邮箱" prop="email" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="名称" prop="name" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="密码" prop="password" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.password" autocomplete="off" />
        </el-form-item>

        <el-form-item label="激活状态" :label-width="info.formLabelWidth">
          <el-select v-model="info.form.user_status" placeholder="请选择状态">
            <el-option label="在用" value="" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_remark" autocomplete="off" />
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
/* .el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
} */
</style>
