<script setup>
console.log('ahoutai/src/views/preview/tabs/preview_02.vue');

const maxTableHeight = 'calc(100vh - 100px)';

const diaForm = ref(null);
const info = reactive({
  tableData: [
    {
      "id": 1,
      "user_email": "209392599@qq.com",
      "user_password": "qaz123..",
      "fund_count": 100,
      "user_remark": "郭坤",
      "expiration_time": "2098-12-31T16:00:00.000Z",
      "fund_list": null,
      "user_token": "boxue666",
      "create_time": "2025-09-23T04:24:38.000Z",
      "update_time": "2026-01-06T23:34:27.000Z",
      "user_status": null
    },
    {
      "id": 57,
      "user_email": "203812677@qq.com",
      "user_password": "qaz123..",
      "fund_count": 30,
      "user_remark": "自己的测试号",
      "expiration_time": "2098-12-31T16:00:00.000Z",
      "fund_list": "[{\"id\":41,\"fund_code\":\"023918\",\"fund_name\":\"华夏国证自由现金流ETF发起式联接C\",\"sort_order\":1,\"fund_type\":\"红利\",\"fund_sign\":\"正常\",\"point_top\":\"1.3200\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/023918.png\"},{\"id\":42,\"fund_code\":\"019261\",\"fund_name\":\"富国恒生红利ETF联接C\",\"sort_order\":2,\"fund_type\":\"红利\",\"fund_sign\":\"正常\",\"point_top\":\"1.4200\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/019261.png\"},{\"id\":45,\"fund_code\":\"020989\",\"fund_name\":\"南方恒生科技ETF发起联接(QDII)C\",\"sort_order\":3,\"fund_type\":\"恒生科技\",\"fund_sign\":\"正常\",\"point_top\":\"1.4200\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/020989.png\"},{\"id\":46,\"fund_code\":\"020256\",\"fund_name\":\"中欧中证机器人指数发起C\",\"sort_order\":4,\"fund_type\":\"科技\",\"fund_sign\":\"正常\",\"point_top\":\"1.7400\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/020256.png\"},{\"id\":47,\"fund_code\":\"012863\",\"fund_name\":\"汇添富中证电池主题ETF发起式联接C\",\"sort_order\":5,\"fund_type\":\"科技\",\"fund_sign\":\"正常\",\"point_top\":\"0.8700\",\"point_down\":\"0.7000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/012863.png\"},{\"id\":49,\"fund_code\":\"023765\",\"fund_name\":\"华夏中证5G通信主题ETF联接D\",\"sort_order\":6,\"fund_type\":\"科技\",\"fund_sign\":\"正常\",\"point_top\":\"2.3500\",\"point_down\":\"2.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/023765.png\"},{\"id\":50,\"fund_code\":\"022425\",\"fund_name\":\"广发中证A500ETF联接C\",\"sort_order\":7,\"fund_type\":\"宽基\",\"fund_sign\":\"正常\",\"point_top\":\"1.2800\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/022425.png\"},{\"id\":53,\"fund_code\":\"024203\",\"fund_name\":\"永赢制造升级智选混合发起C\",\"sort_order\":8,\"fund_type\":\"核能\",\"fund_sign\":\"正常\",\"point_top\":\"1.0000\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":55,\"fund_code\":\"016858\",\"fund_name\":\"国金量化多因子股票C\",\"sort_order\":9,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"1.0000\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":65,\"fund_code\":\"025416\",\"fund_name\":\"新华优选分红混合C\",\"sort_order\":10,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"2.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":70,\"fund_code\":\"002233\",\"fund_name\":\"工银丰收回报灵活配置混合C\",\"sort_order\":11,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"3.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":74,\"fund_code\":\"020726\",\"fund_name\":\"建信灵活配置混合C\",\"sort_order\":12,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"4.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":75,\"fund_code\":\"018561\",\"fund_name\":\"中信保诚多策略混合(LOF)C\",\"sort_order\":13,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"4.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":76,\"fund_code\":\"014521\",\"fund_name\":\"诺安利鑫灵活配置混合C\",\"sort_order\":14,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"4.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":77,\"fund_code\":\"012351\",\"fund_name\":\"万家元贞量化选股股票C\",\"sort_order\":15,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"4.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"50\",\"zhang_url\":\"无\"},{\"id\":54,\"fund_code\":\"021991\",\"fund_name\":\"中加专精特新量化选股混合发起式C\",\"sort_order\":16,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"1.0000\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":71,\"fund_code\":\"022004\",\"fund_name\":\"博道大盘成长股票C\",\"sort_order\":17,\"fund_type\":\"量化\",\"fund_sign\":\"正常\",\"point_top\":\"3.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":61,\"fund_code\":\"003027\",\"fund_name\":\"安信新价值混合C\",\"sort_order\":18,\"fund_type\":\"债券\",\"fund_sign\":\"正常\",\"point_top\":\"1.0000\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"无\"},{\"id\":64,\"fund_code\":\"025857\",\"fund_name\":\"华夏中证电网设备主题ETF发起式联接C\",\"sort_order\":19,\"fund_type\":\"电网\",\"fund_sign\":\"正常\",\"point_top\":\"2.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/025857.png\"},{\"id\":67,\"fund_code\":\"021959\",\"fund_name\":\"南方中证沪深港黄金产业股票指数发起C\",\"sort_order\":20,\"fund_type\":\"黄金\",\"fund_sign\":\"正常\",\"point_top\":\"3.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"30\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/021959.png\"},{\"id\":69,\"fund_code\":\"018168\",\"fund_name\":\"国泰有色矿业ETF联接C\",\"sort_order\":21,\"fund_type\":\"金属\",\"fund_sign\":\"正常\",\"point_top\":\"3.0000\",\"point_down\":\"1.0000\",\"fund_desc\":\"\",\"fund_fixed\":\"50\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/018168.png\"},{\"id\":60,\"fund_code\":\"012922\",\"fund_name\":\"易方达全球成长精选混合(QDII)人民币C\",\"sort_order\":22,\"fund_type\":\"美股\",\"fund_sign\":\"正常\",\"point_top\":\"1.0000\",\"point_down\":\"1.0000\",\"fund_desc\":null,\"fund_fixed\":\"100\",\"zhang_url\":\"https://j4.dfcfw.com/charts/pic6/012922.png\"}]",
      "user_token": null,
      "create_time": "2025-10-14T06:26:09.000Z",
      "update_time": "2026-01-06T23:34:28.000Z",
      "user_status": null
    }
  ],
  formLabelWidth: '140px',
  update_flag: 'add',// 修改还是编辑
  dialogFormVisible: false,
  search_name: '',
  form: {
    id: null,
    user_email: "",// 邮箱
    user_password: "",// 密码
    fund_count: 30,// 基金数量
    user_remark: "",// 备注
    expiration_time: "2099-01-01",// 过期时间
    fund_list: [],// 基金列表
    user_token: "",// 专属令牌(二级密码)
  }
})
const rules = {
  user_email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  user_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度至少为4位', trigger: 'blur' }
  ],
  expiration_time: [
    { required: true, message: '请选择过期时间', trigger: 'change' }
  ]
};

// 获取所有用户
const getAllUser = () => {
  // server_fund_get_all_user_info({}).then(res => {
  //   info.tableData = res.data;
  // })
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
// 清空表单
const resetForm = () => {
  // 手动重置表单数据为初始值
  info.form = {
    id: null,
    user_email: "",// 邮箱
    user_password: "",// 密码
    fund_count: 30,// 基金数量
    user_remark: "",// 备注
    expiration_time: "2099-01-01",// 过期时间
    fund_list: [],// 基金列表
    user_token: "",// 专属令牌 (二级密码)
  }
  // 如果表单引用存在，清除验证状态
  if (diaForm.value) {
    diaForm.value.clearValidate();
  }
}
// 新增
const addUser = async () => {
  info.update_flag = 'add';// 标识新增
  info.dialogFormVisible = true;// 打开弹窗
  await nextTick();
  resetForm();
}
// 取消
const dialogCancelFn = () => {
  resetForm();
  info.dialogFormVisible = false;
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

    <el-table :data="info.tableData" border :row-class-name="tableRowClassName" style="width: 100%"
      :height="maxTableHeight">
      <el-table-column fixed label="序" type="index" width="50" align="center" />
      <el-table-column fixed label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button link type="primary" size="small" @click="btn_edit(row, $index)">编辑</el-button>
          <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="user_remark" label="备注" width="190" />
      <el-table-column prop="user_email" label="账号" width="240" />
      <el-table-column prop="user_password" label="密码" width="200" />
      <el-table-column prop="fund_count" label="基金数量" width="100" />
      <el-table-column prop="fund_list" label="基金列表" width="150" :show-overflow-tooltip="true" />

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

    <el-dialog v-model="info.dialogFormVisible" :title="info.update_flag === 'add' ? '新增' : '编辑'" width="500">
      <el-form :model="info.form" :rules="rules" ref="diaForm">
        <el-form-item label="用户备注" prop="user_remark" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_remark" autocomplete="off" />
        </el-form-item>

        <el-form-item label="邮箱" prop="user_email" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="密码" prop="user_password" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_password" autocomplete="off" />
        </el-form-item>

        <el-form-item label="基金数量" :label-width="info.formLabelWidth">
          <el-input type="number" min="1" step="1" v-model="info.form.fund_count" autocomplete="off" />
        </el-form-item>

        <!-- 过期时间 -->
        <el-form-item label="过期时间" prop="expiration_time" :label-width="info.formLabelWidth">
          <el-date-picker v-model="info.form.expiration_time" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>

        <!-- 基金列表 -->
        <el-form-item label="基金列表" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.fund_list" autocomplete="off" />
        </el-form-item>

        <!-- 专属令牌 -->
        <el-form-item label="专属令牌" :label-width="info.formLabelWidth">
          <el-input v-model="info.form.user_token" autocomplete="off" />
        </el-form-item>

        <!-- <el-form-item label="激活状态" :label-width="info.formLabelWidth">
          <el-select v-model="info.form.user_status" placeholder="请选择状态">
            <el-option label="在用" value="" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogCancelFn">取消</el-button>
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
