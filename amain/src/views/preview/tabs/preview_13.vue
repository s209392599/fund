<script setup>
console.log('src/views/preview/tabs/preview_13.vue');
// 基金持仓，要支持再次的手动输入


/*
getFundDetailPageInfoWithNoPin

*/
const info = reactive({
  text: '',
  tableData: [
    {
      "code": "018561",
      "name": "中信保诚多策略混合(LOF)C",
      "themeNameList": [
        "专用设备",
        "乡村振兴"
      ],
      "stock": [
        {
          "name": "荣信文化",
          "industryName": "文化传媒",
          "ratio": "0.96%"
        },
        {
          "name": "安利股份",
          "industryName": "塑料制品",
          "ratio": "0.87%"
        },
        {
          "name": "国际实业",
          "industryName": "光伏设备",
          "ratio": "0.87%"
        },
        {
          "name": "春雪食品",
          "industryName": "食品加工制造",
          "ratio": "0.86%"
        },
        {
          "name": "中公高科",
          "industryName": "建筑装饰",
          "ratio": "0.86%"
        },
        {
          "name": "优德精密",
          "industryName": "专用设备",
          "ratio": "0.85%"
        },
        {
          "name": "华绿生物",
          "industryName": "种植业与林业",
          "ratio": "0.85%"
        },
        {
          "name": "宁波联合",
          "industryName": "综合",
          "ratio": "0.84%"
        },
        {
          "name": "天鹅股份",
          "industryName": "专用设备",
          "ratio": "0.84%"
        },
        {
          "name": "美信科技",
          "industryName": "通信设备",
          "ratio": "0.83%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "32.03"
        }
      ]
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

//获取基金持仓
const getList_1 = () => {

};

//获取全部基金持仓
const getList_2 = () => {

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
          <el-button type="primary" @click="getList_1()">获取正常持仓</el-button>
          <el-button type="primary" @click="getList_2()">包含历史基金持仓</el-button>
          <el-button type="success" @click="addFn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">
      <div v-for="(item, index) in info.tableData" :key="item.code + index" class="drag_item" draggable="true"
        @dragstart="handleDragStart($event, index)" @dragover.prevent="handleDragOver($event, index)"
        @drop="handleDrop($event, index)">
        <div class="drag_title">
          <!-- <span class="drag_icon">☰</span> -->
          <span class="drag_text">{{ item.code }}&nbsp;{{ item.name }}</span>
        </div>
        <div class="drag_main">
          <div class="" style="border-bottom: 1px solid #fedddd;">
            <span class="">投资方向：</span>
            <span class="" v-for="(item_1, index_1) in item.themeNameList" :key="index_1">{{ item_1 }}、</span>
          </div>

          <div class="" style="border-bottom: 1px solid #fedddd;">
            <span class="">持仓首位：</span>
            <span class="">{{ item.stockDistribution?.[0]?.name }}&nbsp;{{ item.stockDistribution?.[0]?.value }}%</span>
          </div>

          <div class="gupiao_box">
            <div class="gupiao_item">
              <span class="gupiao_name">股票</span>
              <span class="gupiao_rate">占比</span>
              <span class="gupiao_type">类别</span>
            </div>
            <div class="gupiao_item" v-for="(item_2, index_2) in item.stock" :key="index_2">
              <span class="gupiao_name" :title="item_2.name">{{ item_2.name }}</span>
              <span class="gupiao_rate">{{ item_2.ratio }}</span>
              <span class="gupiao_type">{{ item_2.industryName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss"></style>
<style scoped lang="scss">
.gupiao_item {
  display: flex;
  border-bottom: 1px solid #fedddd;

  .gupiao_name {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .gupiao_rate {
    width: 60px;
    text-align: center;
  }

  .gupiao_type {
    width: 110px;
    text-align: right;
  }

  &:last-child {
    border-bottom: none;
  }
}

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

  padding: 5px 5px;
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

.drag_text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  /* 关键：允许内容收缩，避免 flex 溢出问题 */
}

.drag_main {
  padding: 5px 8px;
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
