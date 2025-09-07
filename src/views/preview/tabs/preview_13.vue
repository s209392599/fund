<script setup>
console.log('src/views/preview/tabs/preview_13.vue');
const info = reactive({
  tableData: [
    {
      "code": "022365",
      "name": "永赢科技智选混合发起C",
    },
    {
      "code": "018561",
      "name": "中信保诚多策略混合(LOF)C",
    },
    {
      "code": "322365",
      "name": "永赢科技智选混合发起C",
    },
    {
      "code": "418561",
      "name": "中信保诚多策略混合(LOF)C",
    },
    {
      "code": "522365",
      "name": "永赢科技智选混合发起C",
    },
    {
      "code": "618561",
      "name": "中信保诚多策略混合(LOF)C",
    },
    {
      "code": "722365",
      "name": "永赢科技智选混合发起C",
    },
    {
      "code": "818561",
      "name": "中信保诚多策略混合(LOF)C",
    },
    {
      "code": "922365",
      "name": "永赢科技智选混合发起C",
    },
    {
      "code": "108561",
      "name": "中信保诚多策略混合(LOF)C",
    },
  ], // 列表数据
  // 拖拽相关数据
  dragState: {
    draggingIndex: -1,
    targetIndex: -1
  }
});

// 拖拽开始
const handleDragStart = (e, index) => {
  info.dragState.draggingIndex = index;
  // 设置拖拽效果
  e.dataTransfer.effectAllowed = 'move';
  // 对于某些浏览器需要设置数据
  e.dataTransfer.setData('text/plain', index.toString());
  // 添加拖拽样式
  e.target.classList.add('dragging');
};

// 拖拽经过
const handleDragOver = (e, index) => {
  info.dragState.targetIndex = index;
  // 必须阻止默认行为才能触发drop
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

// 拖拽结束（放置）
const handleDrop = (e, index) => {
  e.preventDefault();
  
  const draggingIndex = info.dragState.draggingIndex;
  const targetIndex = index;
  
  // 如果目标位置不同于起始位置，则重新排序
  if (draggingIndex !== targetIndex && draggingIndex !== -1) {
    // 创建新数组以避免直接修改响应式数组
    const newTableData = [...info.tableData];
    // 移除拖拽项
    const [removed] = newTableData.splice(draggingIndex, 1);
    // 插入到新位置
    newTableData.splice(targetIndex, 0, removed);
    // 更新数据
    info.tableData = newTableData;
  }
  
  // 清理拖拽状态
  e.target.classList.remove('dragging');
  info.dragState.draggingIndex = -1;
  info.dragState.targetIndex = -1;
};


const getList = () => {
 
};

const addFn = () => {
  console.log('新增');
};

</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button type="success" @click="addFn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">
  <div 
    v-for="(item, index) in info.tableData" 
    :key="item.code + index"
    class="drag_item"
    draggable="true"
    @dragstart="handleDragStart($event, index)"
    @dragover.prevent="handleDragOver($event, index)"
    @drop="handleDrop($event, index)"
  >
    <div class="drag_title">
      <span class="drag_icon">☰</span>
      <span class="drag_text">{{ index }}-{{ item.code }} - {{ item.name }}</span>
    </div>
    <div class="drag_main">
      <!-- 这里可以放置基金详情内容 -->
      <p>基金代码: {{ item.code }}</p>
      <p>基金名称: {{ item.name }}</p>
    </div>
  </div>
</div>

  </div>
</template>

<style scoped lang="scss">
.main_box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px;
}

.drag_item {
  width: 320px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.drag_item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.drag_item.dragging {
  opacity: 0.6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.drag_title {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
 
  padding: 12px 15px;
  background-color: #f5f7fa;
  cursor: move;
  user-select: none;
  font-weight: 500;
}

.drag_icon {
  margin-right: 10px;
  color: #909399;
  font-size: 18px;
  cursor: move;
}
.drag_text{
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0; /* 关键：允许内容收缩，避免 flex 溢出问题 */
}

.drag_main {
  padding: 15px;
  background-color: #fff;
  color: #606266;
  font-size: 14px;
  height: 280px;
}

/* 拖拽过程中的视觉反馈 */
.drag_item.drag-over {
  border-top: 2px solid #409eff;
}

</style>
