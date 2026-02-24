<template>
  <div class="child">
    <p>父组件传值：{{ name }}</p>
    <button @click="sendMsgToParent">向父组件传值</button>
  </div>
</template>

<script setup lang="ts">
// 声明props，TS泛型做类型约束
const props = defineProps<{
  name: string; // 必传属性
  age?: number; // 可选属性
}>()
// 声明事件，约束事件参数类型
const emit = defineEmits<{
  (e: 'update:age', value: number): void;
  (e: 'message', msg: string): void;
}>()
// 触发事件，向父组件传值
const sendMsgToParent = () => {
  emit('update:age', 18)
  emit('message', '我是子组件的消息')
}
</script>
