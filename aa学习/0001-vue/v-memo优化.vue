<template>
  <div>
    <!-- 长列表：仅id/status变化时重新渲染 -->
    <div v-for="item in longList" :key="item.id" v-memo="[item.id, item.status]">
      <p>编号：{{ item.id }} - 名称：{{ item.name }}</p>
      <p>状态：{{ item.status === 'active' ? '已激活' : '未激活' }}</p>
      <p>无关内容：{{ item.content }}</p>
    </div>
    <button @click="changeContent">修改无关内容（不渲染）</button>
    <button @click="changeStatus">修改状态（触发渲染）</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 定义列表项类型
type ListItem = { id: number; name: string; status: 'active' | 'inactive'; content: string }
// 模拟1000条长列表数据
const longList = ref<ListItem[]>(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `列表项${i + 1}`,
    status: i % 2 === 0 ? 'active' : 'inactive',
    content: `初始内容${i + 1}`
  }))
)
// 修改v-memo依赖外的属性：不触发渲染
const changeContent = () => {
  longList.value.forEach(item => {
    item.content = `修改后的内容${item.id}`
  })
}
// 修改v-memo依赖内的属性：仅对应项重新渲染
const changeStatus = () => {
  longList.value[0].status = longList.value[0].status === 'active' ? 'inactive' : 'active'
}
</script>
