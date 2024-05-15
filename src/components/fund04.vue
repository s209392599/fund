<template>
  <div class="hello">
    <!-- 历史收益图片 (天天基金) -->
    <a v-for="(item,index) in info" :key="index" target="_blank"
      :href="'http://fund.eastmoney.com/'+(numberArr[index])+'.html?spm=aladin'"
      class="item"
    >
      <img class="fundImg" :src="item" />
    </a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Fund1',
  data(){
    return {
      numberArr:[],//基金号码的数组
      info:[],
    }
  },
  created(){
    let arr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;
    console.log(arr);
    this.info = arr.map((item,index) => {
      this.numberArr.push(item.number);
      let thisTime = +new Date();
      return `https://j3.dfcfw.com/images/JJJZ12/${item.number}.png?t=${thisTime}`
    })
  },
};
</script>

<style scoped>
.fundImg{
  width: 352px;/* 440px */
  height: 277px;
}
</style>
