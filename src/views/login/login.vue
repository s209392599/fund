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
      <el-button type="primary" @click="onSubmit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

const form = reactive({
  email: '',
  password: ''
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
