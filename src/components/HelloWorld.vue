<script setup>
const urlParams = new URLSearchParams(window.location.search);
// 地址(adress)中获取参数zhi
const ad_zhi = urlParams.get('zhi');
console.log('ad_zhi', ad_zhi);
if (ad_zhi) {
  console.log('斗志')
} else {
  console.log('没有');
}
</script>

<template>
  <div class="page-wrapper">
    <h1>boxue is 888! -- {{ ad_zhi ? ad_zhi : 'age:18' }}</h1>
  </div>
</template>

<style scoped></style>
