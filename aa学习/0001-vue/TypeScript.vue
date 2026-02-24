<template>
  <div>
    <p>TS约束ref：{{ count }}（仅能为数字）</p>
    <p>TS约束reactive：{{ user.name }} - {{ user.age }}</p>
    <button @click="testType">测试类型约束</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// 1. ref添加基础类型约束
const count = ref<number>(0)
// 2. 接口约束复杂对象，方便复用
interface User {
  name: string;
  age: number;
  hobbies?: string[];
  getInfo: () => string;
}
// 3. reactive结合接口，做严格类型校验
const user = reactive<User>({
  name: '王小明',
  age: 22,
  hobbies: ['跑步', '阅读'],
  getInfo: () => {
    return `${user.name}，${user.age}岁`
  }
})
// 4. 联合类型约束枚举值
const status = ref<'active' | 'inactive' | 'pending'>('active')
// 5. 类型断言：确定值的类型时使用
const num = ref<number | string>(123)
const numOnly = num.value as number

// 测试类型约束，非指定类型会报红
const testType = () => {
  count.value += 1
  user.age += 1
  console.log(user.getInfo())
  status.value = 'pending'
}
</script>
