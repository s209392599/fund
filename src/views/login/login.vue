<script setup>

// const getTestGet = async () => {
//   server_testget({
//     content: 'get请求参数'
//   }).then(res => {
//     console.log('get示例返回值', res)
//   }).catch(err => {
//     console.log('err', err)
//   })
// }

// getTestGet();

// const getTestPost = async () => {
//   server_testpost({
//     content: 'post请求参数'
//   }).then(res => {
//     console.log('post示例返回值', res)
//   }).catch(err => {
//     console.log('err', err)
//   })
// }

// getTestPost();

const testFn = () => {
  server_fund_today_rate_by_timer({ fundcode: '023350' }).then(res => {
    console.log('testFn返回值', res)
  }).catch(err => {
    console.log('err', err)
  })
}

testFn();
</script>

<template>
  <div>login</div>
</template>

<style scoped lang="less"></style>
