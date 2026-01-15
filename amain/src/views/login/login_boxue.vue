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
import { useRouter } from 'vue-router';
const router = useRouter();

const form = reactive({
  user_email: localStorage.getItem('user_email') || '203812677@qq.com',
  user_password: localStorage.getItem('user_password') || 'qaz123..',
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
  let flag_1 = form.user_email === '203812677@qq.com';
  let flag_2 = form.user_password === 'qaz123..';
  if (flag_1 && flag_2) {
    localStorage.setItem('user_id', '57');
    localStorage.setItem('user_email', form.user_email);
    localStorage.setItem('user_password', form.user_password);
    localStorage.setItem('loginTime', CustomDateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"));
    router.push('/preview');
  }
};
</script>

<style scoped>
.login-form {
  width: 400px;
  margin: 100px auto 0;
}
</style>
