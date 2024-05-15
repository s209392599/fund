<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { provide } from 'vue';
provide('echarts', echarts);
</script>

<style>
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background-color: rgba(6, 6, 6, 0.5);
  color: #fff;
}
</style>
