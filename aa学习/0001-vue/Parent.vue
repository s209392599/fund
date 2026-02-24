<template>
  <div class="parent">
    <h3>父组件</h3>
    <!-- 向子组件传值 + 监听子组件事件 -->
    <Child name="张三" @update:age="handleAgeUpdate" @message="handleMessage" />
    <p>子组件传回的年龄：{{ childAge }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Child from './Child.vue'
const childAge = ref<number>(0)
// 处理子组件的年龄更新事件
const handleAgeUpdate = (val: number) => {
  childAge.value = val
}
// 处理子组件的消息事件
const handleMessage = (msg: string) => {
  console.log('接收子组件消息：', msg)
}
</script>
