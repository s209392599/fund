<script setup>
import Duibi_01 from '../fund_duibi/duibi_01.vue';
// 基金对比
console.log('src/views/preview/tabs/preview_13.vue');

const info = reactive({
  active_tab: '1',
  list_tabs: [
    {
      id: '1',
      name: '表格数据',
    },
    {
      id: '2',
      // 涨幅排名、基金标签(特色亮点、用户关注、投资方向)、规模、管理公司、基金经理、持有人结构
      // 限购金额、关联指数、基金诊断、持有建议
      name: '基本信息',
    },
    {
      id: '3',
      name: '买卖费率',
    },
    {
      id: '4',
      name: '累计净值(日均线)', // 均线
    },
    {
      id: '5',
      name: '修复',
    },
    {
      id: '6',
      name: '分红',
    },
    {
      id: '7',
      name: '持仓', // 前十大持仓(或债券持仓)和比例
    },
    {
      id: '8',
      name: '近来对比',
    },
    {
      id: '9',
      name: '预测涨幅',
    },
    {
      id: '10',
      name: '纯涨幅',
    },
    {
      id: '11',
      name: '收益走势',
    },
    {
      id: '12',
      name: '排名走势',
    }
  ],
});

const handleClick = (tab) => {
  // console.log(tab);
};
</script>

<template>
  <div class="page_wrapper pr-10 pb-10 pl-10">
    <div class="">
      <el-tabs v-model="info.active_tab" @tab-click="handleClick" class="page-tabs">
        <el-tab-pane v-for="item in info.list_tabs" :key="item.id" :label="item.name" :name="item.id">
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="main_box">
      <div class="" v-if="info.active_tab === '1'">
        <duibi_01></duibi_01>
      </div>

      <div class="" v-if="info.active_tab === '2'">
        <duibi_02></duibi_02>
      </div>

      <div class="" v-if="info.active_tab === '3'">
        <duibi_03></duibi_03>
      </div>

      <div class="" v-if="info.active_tab === '4'">
        <duibi_04></duibi_04>
      </div>

      <div class="" v-if="info.active_tab === '5'">
        <duibi_05></duibi_05>
      </div>

      <div class="" v-if="info.active_tab === '6'">
        <duibi_06></duibi_06>
      </div>

      <div class="" v-if="info.active_tab === '7'">
        <duibi_07></duibi_07>
      </div>

      <div class="" v-if="info.active_tab === '8'">
        <duibi_08></duibi_08>
      </div>

      <!-- 预测涨幅 -->
      <div class="" v-if="info.active_tab === '9'">
        <duibi_09></duibi_09>
      </div>

      <!-- 纯涨幅 -->
      <div class="" v-if="info.active_tab === '10'">
        <duibi_10></duibi_10>
      </div>

      <!-- 收益走势 -->
      <div class="" v-if="info.active_tab === '11'">
        <duibi_11></duibi_11>
      </div>

      <!-- 排名走势 -->
      <div class="" v-if="info.active_tab === '12'">
        <duibi_12></duibi_12>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
