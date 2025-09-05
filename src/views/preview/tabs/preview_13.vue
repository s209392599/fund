<script setup>
console.log('src/views/preview/tabs/preview_13.vue');
// 基金持仓，要支持再次的手动输入

const info = reactive({
  text: '',
  list: [
    {
      "code": "007467",
      "name": "华泰柏瑞中证红利低波ETF联接C",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "流动仓-长期存在",
      "fixed": 30,
      "type": "红利",
      list: []
    },
    {
      "code": "019260",
      "name": "富国恒生红利ETF联接A",
      "zhang_url": "",
      "point_line_top": null,
      "point_line_down": null,
      "desc": "流动仓",
      "fixed": 30,
      "type": "红利",
      list: []
    },
  ],// 列表数据
});
const getList = () => {

};
</script>

<template>
  <div class="page_wrapper pd-10">
  </div>
</template>

<style scoped lang="scss"></style>
