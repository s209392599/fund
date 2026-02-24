<template>
  <div>
    <button @click="showModal = true">打开弹窗</button>
    <!-- Teleport将内容渲染到body节点下 -->
    <Teleport to="body">
      <div class="modal-mask" v-if="showModal" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <h3>跨DOM弹窗</h3>
          <p>我被渲染到body下，脱离父组件DOM结构</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const showModal = ref<boolean>(false)
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 400px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
