<template>
  <el-form :model="form" :rules="rules" ref="loginForm" label-width="100px" class="login-form">
    <el-form-item label="账号" prop="user_name">
      <el-input v-model="form.user_name"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="二级密码" prop="erji_password">
      <el-input v-model="form.erji_password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="width: 100%;">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
const router = useGlobalRouter();

const form = reactive({
  user_name: localStorage.getItem('user_name') || '',
  password: localStorage.getItem('password') || '',
  erji_password: localStorage.getItem('erji_password') || '',
});

const rules = {
  user_name: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
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
          // 登录成功
          if (res.data.hasOwnProperty('id')) {
            localStorage.setItem('user_id', res.data.id);
          }
          if (res.data.hasOwnProperty('user_email')) {
            localStorage.setItem('user_email', res.data.user_email);
          }
          localStorage.setItem('user_name', form.user_name);
          localStorage.setItem('password', form.password);
          localStorage.setItem('loginTime', CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"));
          router.push('/preview');
        } else {
          // 登录失败
          ElMessage.error('登录失败22！')
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
  width: 300px;
  margin: 100px auto 0;
}
</style>
