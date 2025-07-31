<script setup>
console.log('server_testget', server_testget);

// import { server_testget } from '@/api/index';

import axios from 'axios';
axios.get('/api/testget', {
  params: {
    content: 'get请求参数'
  }
}).then(res => {
  console.log('axios=>', res.data);
}).catch(err => {
  console.log('err', err);
});

const getTestGet = async () => {
  server_testget({
    content: 'get请求参数'
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log('err', err)
  })
}

getTestGet();
</script>

<template>
  <div>login</div>
</template>

<style scoped lang="less"></style>
