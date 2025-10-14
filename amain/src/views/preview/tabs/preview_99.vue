<script setup>
// 我的页面
console.log('amain/src/views/preview/tabs/preview_99.vue');
const router = useRouter();

const info = reactive({
  text: '',
});

// 退出
const btn_fn_1 = () => {
  router.push('/');
};

const addFn = () => {
  console.log('新增');
};

</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="btn_fn_1">退出</el-button>
          <!-- <el-button type="success" @click="addFn">新增</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">

    </div>

  </div>
</template>

<style scoped lang="scss"></style>
