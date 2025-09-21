<script setup>
console.log('src/views/preview/tabs/preview_08.vue');

const diaForm = ref(null);
const info = reactive({
  tableData: [],
  formLabelWidth: '140px',
  update_flag: 'add',// 修改还是编辑
  dialogFormVisible: false,
  form: {
    "code": "",
    "name": "",
    "type": "",
    "zhang_url": "",
    "fixed": "",
    "point_line_down": "",
    "point_line_top": "",
    "desc": "",
  }
})
const rules = {
  code: [
    { required: true, message: '请输入基金代码', trigger: 'blur' },
    { min: 6, message: '至少输入6位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入基金名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请输入基金类型', trigger: 'blur' },
  ],
};

// 获取-列表数据
const query_list = () => {
  setTimeout(() => {
    server_fund_public_fund_query().then(res => {
      console.log('res', res);
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
      server_fund_public_fund_delete({ fundcode: row.code }).then(res => {
        console.log('res', res);
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
  console.log('$index', $index);
  const userInput = prompt('请输入第几行(正整数)');
  if (userInput) {
    let index = parseFloat(userInput) || 0;
    index = Math.min(index, info.tableData.length) - 1;
    if (index > -1 && index !== $index) {
      console.log('index', index, $index);
      server_fund_public_fund_sort({
        index_new: index,
        index_old: $index
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
    "code": "",
    "name": "",
    "type": "",
    "zhang_url": "",
    "fixed": "",
    "point_line_down": "",
    "point_line_top": "",
    "desc": "",
  }
  diaForm.value.resetFields();

}
// 弹窗提交
const onSubmit = () => {
  diaForm.value.validate((valid) => {
    if (valid) {
      console.log('form', info.form);

      if (info.update_flag === 'add') {
        server_fund_public_fund_add({
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
        server_fund_public_fund_update({
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

</script>

<template>
  <div class="page-wrapper pd-10">
    <div class="flex pb-5">
      <el-button type="primary" size="small" @click="addUser()">新增基金</el-button>
    </div>

    <el-table :data="info.tableData" border style="width: 100%" height="800">
      <el-table-column fixed label="序" type="index" width="50" />
      <el-table-column prop="code" label="基金代码" width="80" />
      <el-table-column prop="name" label="名称" width="250" />
      <el-table-column prop="type" label="类型" width="150" />
      <el-table-column prop="zhang_url" label="涨幅的URL" width="200" />
      <el-table-column prop="fixed" label="定投金额" width="100" />
      <el-table-column prop="point_line_down" label="低点" width="100" />
      <el-table-column prop="point_line_top" label="高点" width="100" />
      <el-table-column prop="desc" label="备注" width="300" />

      <el-table-column label="Operations" min-width="120">
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_edit(row, $index)">编辑</el-button>
          <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          <el-button link type="primary" size="small" @click="btn_cha(row, $index)">插入到</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="info.dialogFormVisible" :title="info.update_flag" width="500">
      <el-form :model="info.form" :rules="rules" ref="diaForm">
        <el-form-item label="基金代码" prop="code" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.code" autocomplete="off" />
        </el-form-item>

        <el-form-item label="名称" prop="name" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="类型" prop="type" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.type" autocomplete="off" />
        </el-form-item>

        <el-form-item label="涨幅的URL" prop="zhang_url" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.zhang_url" autocomplete="off" />
        </el-form-item>

        <el-form-item label="定投金额" prop="fixed" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fixed" autocomplete="off" />
        </el-form-item>

        <el-form-item label="净值提示-低点" prop="point_line_down" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.point_line_down" autocomplete="off" />
        </el-form-item>

        <el-form-item label="净值提示-高点" prop="point_line_top" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.point_line_top" autocomplete="off" />
        </el-form-item>

        <el-form-item label="备注" prop="desc" :label-width="info.formLabelWidth">
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

<style scoped lang="scss"></style>
