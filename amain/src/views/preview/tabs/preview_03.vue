<script setup>
console.log('amain/src/views/preview/tabs/preview_03.vue');
// 群主分类推荐
const info = reactive({
  list: [
    {
      type: '红利',
      desc: '',
      data: [
        {
          fund_code: '007467',
        },
        {
          fund_code: '008164',
        }
      ]
    },
    {
      type: '量化',
      desc: '',
      data: [
        {
          fund_code: '007467',
        },
        {
          fund_code: '008164',
        }
      ]
    },
    {
      type: '宽基',
      desc: '',
      data: [
        {
          fund_code: '007467',
        },
        {
          fund_code: '008164',
        }
      ]
    },
    {
      type: '科技',
      desc: '',
      data: [
        {
          fund_code: '007467',
        },
        {
          fund_code: '008164',
        }
      ]
    },
    {
      type: 'QDII',
      desc: '',
      data: [
        {
          fund_code: '007467',
        },
        {
          fund_code: '008164',
        }
      ]
    },
  ],
  tableData: [],
})


</script>

<template>
  <div class="page_wrapper">
    <div class="page_left"></div>
    <div class="page_right"></div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: calc(100vh - 40px);
  overflow: auto;
}
</style>
