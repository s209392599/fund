<template>
  <el-form :model="form" :rules="rules" ref="loginForm" label-width="180px" class="login-form">
    <el-form-item label="账号" prop="user_email">
      <el-input v-model="form.user_email"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="user_password">
      <el-input v-model="form.user_password"></el-input>
    </el-form-item>
    <el-form-item label="二级密码" prop="user_token">
      <el-input v-model="form.user_token"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="width: 100%;">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
const router = useGlobalRouter();

const form = reactive({
  user_email: localStorage.getItem('user_email') || '',
  user_password: localStorage.getItem('user_password') || '',
  user_token: localStorage.getItem('user_token') || '',
});

const rules = {
  user_email: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  user_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度至少为4位', trigger: 'blur' }
  ]
};

const loginForm = ref(null);

const onSubmit = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      server_fund_amain_login(form).then(res => {
        console.log('登录', res);
        if (res.code === 200) {
          localStorage.setItem('user_id', res.data.id || '');
          localStorage.setItem('user_email', res.data.user_email || '');
          localStorage.setItem('user_password', form.user_password);
          localStorage.setItem('loginTime', CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"));
          router.push('/preview');
        } else {
          ElMessage.error('登录失败！')
        }
      })
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style scoped>
.login-form {
  width: 400px;
  margin: 100px auto 0;
}
</style>
