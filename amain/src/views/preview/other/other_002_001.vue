<script setup>
console.log('amain/src/views/preview/other/other_002_001.vue');
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})
const info = reactive({
  ri_zhou: [],
  zhou_yue: [],
  ri_zhou_yue: []
})

watch(() => props.data, (newVal = {}) => {
  // console.log('props.data changed:', newVal);
  info.ri_zhou = newVal.all_jiaocha_ri_zhou || [];
  info.zhou_yue = newVal.all_jiaocha_zhou_yue || [];
  info.ri_zhou_yue = newVal.all_jiaocha_ri_zhou_yue || [];

  // console.log('info.ri_zhou', info.ri_zhou);
  // console.log('info.zhou_yue', info.zhou_yue);
  // console.log('info.ri_zhou_yue', info.ri_zhou_yue);
}, { deep: true, immediate: true })

const del_item = (type, fund_code) => {
  if (type === 'ri_zhou') {
    info.ri_zhou = info.ri_zhou.filter(item => item.fund_code !== fund_code);
  } else if (type === 'zhou_yue') {
    info.zhou_yue = info.zhou_yue.filter(item => item.fund_code !== fund_code);
  } else if (type === 'ri_zhou_yue') {
    info.ri_zhou_yue = info.ri_zhou_yue.filter(item => item.fund_code !== fund_code);
  }
}
const copy_fn = (type) => {
  if (type === 'rizhou') {
    fallbackCopyText(JSON.stringify(info.ri_zhou));
  } else if (type === 'zhouyue') {
    fallbackCopyText(JSON.stringify(info.zhou_yue));
  } else if (type === 'rizhouyue') {
    fallbackCopyText(JSON.stringify(info.ri_zhou_yue));
  }
}
</script>

<template>
  <div class="page_wrapper">
    <div class="desc">算法说明：读取日周月的排行榜前500名，去除A类进行交叉排名取交集</div>

    <div class="flex flex-row gap-10 jiaocha_wrapper">
      <!-- 日周交叉 -->
      <div class="jiaocha_box flex flex-col">
        <div class="jiaocha_box_title flex justify-between items-center pl-10 pr-10">
          <div class="jiaocha_box_text">日周交叉</div>
          <div class="btn_copy" @click="copy_fn('rizhou')">复制</div>
          <div class="">{{ info.ri_zhou?.length || '-' }}个基金</div>
        </div>
        <div class="jiaocha_box_content flex-1">
          <div class="jiaocha_box_item flex justify-between items-center" v-for="item in info.ri_zhou"
            :key="item.fund_code">
            <div class="jiaocha_item_name">
              <a :href="`https://fund.eastmoney.com/${item.fund_code}.html`" target="_blank">{{ item.fund_code }}-{{
                item.fund_name }}</a>
            </div>
            <div class="jiaocha_item_del" @click="del_item('ri_zhou', item.fund_code)">删除</div>
          </div>
        </div>
      </div>
      <!-- 周月交叉 -->
      <div class="jiaocha_box">
        <div class="jiaocha_box_title flex justify-between items-center pl-10 pr-10">
          <div class="jiaocha_box_text">周月交叉</div>
          <div class="btn_copy" @click="copy_fn('zhouyue')">复制</div>
          <div class="">{{ info.zhou_yue?.length || '-' }}个基金</div>
        </div>
        <div class="jiaocha_box_content">
          <div class="jiaocha_box_item flex justify-between items-center" v-for="item in info.zhou_yue"
            :key="item.fund_code">
            <div class="jiaocha_item_name">
              <a :href="`https://fund.eastmoney.com/${item.fund_code}.html`" target="_blank">{{ item.fund_code }}-{{
                item.fund_name }}</a>
            </div>
            <div class="jiaocha_item_del" @click="del_item('zhou_yue', item.fund_code)">删除</div>
          </div>
        </div>
      </div>

      <!-- 日周月交叉 -->
      <div class="jiaocha_box">
        <div class="jiaocha_box_title flex justify-between items-center pl-10 pr-10">
          <div class="jiaocha_box_text">日周月交叉</div>
          <div class="btn_copy" @click="copy_fn('rizhouyue')">复制</div>
          <div class="">{{ info.ri_zhou_yue?.length || '-' }}个基金</div>
        </div>
        <div class="jiaocha_box_content">
          <div class="jiaocha_box_item flex align-center" v-for="item in info.ri_zhou_yue" :key="item.fund_code">
            <div class="jiaocha_item_name">
              <a :href="`https://fund.eastmoney.com/${item.fund_code}.html`" target="_blank">{{ item.fund_code }}-{{
                item.fund_name }}</a>
            </div>
            <div class="jiaocha_item_del" @click="del_item('ri_zhou_yue', item.fund_code)">删除</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/views/preview/other/css/other_002_001.scss';
</style>
