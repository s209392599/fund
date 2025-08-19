<template>
  <el-form :model="form" :rules="rules" ref="loginForm" label-width="100px" class="login-form">
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <!-- <el-input type="password" v-model="form.password"></el-input> -->
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="width: 100%;">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
const router = useRouter();

const form = reactive({
  email: localStorage.getItem('email') || '',
  password: localStorage.getItem('password') || '',
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
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
      server_fund_login(form).then(res => {
        console.log('登录', res);
        if (res.code === 200) {
          // 登录成功
          localStorage.setItem('email', form.email);
          localStorage.setItem('password', form.password);
          // 存储基金信息
          localStorage.setItem('fund', JSON.stringify(res.data.fund || []));
          localStorage.setItem('loginTime', CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"));
          console.log('res', res.data)
          // 跳转到
          router.push('/preview');
        } else {
          // 登录失败
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
  width: 300px;
  margin: 100px auto;
}
</style>
