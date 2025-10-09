<script setup>
console.log('ahoutai/src/views/preview/tabs/preview_03.vue');
const info = reactive({
  val: '',
})
const btn_1 = () => {
  if (!info.val.trim()) {
    ElMessage.error('请输入操作建议！');
    return;
  }
  console.log(info.val);
  ElMessageBox.confirm(
    '确认发送吗?',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      server_fund_send_mail_operate({ msg: info.val }).then(res => {
        console.log('res', res);
        if (res.code === 200) {
          ElMessage.success('删除成功');
          // getAllUser();
        } else {
          ElMessage.error('删除失败，请重试！');
        }
      })
    })
    .catch(() => { })
}
</script>

<template>
  <div class="page-wrapper pd-10">
    <div class="flex pb-5">
      <el-button type="primary" size="small" @click="btn_1()">发送</el-button>
    </div>

    <div class="">
      <el-input v-model="info.val" style="width: 100%" :rows="20" type="textarea" placeholder="操作建议" />
    </div>

  </div>
</template>

<style scoped lang="scss"></style>
