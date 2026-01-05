<script setup>
console.log('src/views/preview/tabs/preview_19.vue');

const info = reactive({
  active_node: null,
  tree_data: [
    {
      id: 'other_001_000',
      name: '其它菜单说明',
      component: () => import('@/views/preview/other/other_001_000.vue'),
      hasComponent: true, // 标识该节点有组件
    },
    {
      id: 'other_002_000',
      name: '交叉排行(天天基金)',
      hasComponent: true, // 标识该节点没有组件，仅为父节点
      component: () => import('@/views/preview/other/other_002_000.vue')
    },
    {
      id: 'other_003_000',
      name: '榜单(京东金融)',
      hasComponent: true, // 标识该节点没有组件，仅为父节点
      component: () => import('@/views/preview/other/other_003_000.vue')
    },
    // {
    //   id: 'other_004_001',
    //   name: '新成立基金',
    //   hasComponent: true,
    //   component: () => import('@/views/preview/other/other_004_000.vue')
    // },
    // {
    //   id: 'other_002_000',
    //   name: '交叉排行',
    //   hasComponent: false, // 标识该节点没有组件，仅为父节点
    //   children: [
    //     {
    //       id: 'other_002_001',
    //       name: '全部',
    //       component: () => import('@/views/preview/other/other_002_001.vue'),
    //       hasComponent: true,
    //     },
    //     {
    //       id: 'other_002_002',
    //       name: '子菜单2-2sdfsdfsdf方式第三方斯蒂芬斯蒂芬',
    //       component: () => import('@/views/preview/other/other_002_002.vue'),
    //       hasComponent: true,
    //     },
    //     {
    //       id: 'other_002_003',
    //       name: '子菜单2-3',
    //       component: () => import('@/views/preview/other/other_002_003.vue'),
    //       hasComponent: true,
    //     },
    //   ],
    // },

  ],
});

// 使用 shallowReactive 替代 ref，避免深层响应式处理
const loadedComponents = shallowReactive({});

const handleNodeClick = (data) => {
  // 只有有组件的节点才能被选中
  if (data.hasComponent) {
    info.active_node = data.id; // 设置当前激活的节点
    loadComponent(data.id);
  }
};

// 获取当前活动节点对应的组件
const loadComponent = async (nodeId) => {
  // 在树形数据中查找对应的节点
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const node = findNode(info.tree_data);
  if (node && node.hasComponent && !loadedComponents[nodeId]) {
    try {
      // 添加超时机制，遵循项目规范
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('组件加载超时')), 5000);
      });

      const modulePromise = node.component();

      const module = await Promise.race([
        modulePromise,
        timeoutPromise
      ]);

      // 使用 markRaw 避免组件被转换为响应式对象
      loadedComponents[nodeId] = markRaw(module.default);
    } catch (error) {
      console.error(`加载组件失败: ${error.message}`);
    }
  }
};

// 预加载第一个有组件的节点
onMounted(() => {
  // 查找第一个有组件的节点
  const findFirstComponentNode = (nodes) => {
    for (const node of nodes) {
      if (node.hasComponent) {
        return node.id;
      }
      if (node.children) {
        const childNodeId = findFirstComponentNode(node.children);
        if (childNodeId) return childNodeId;
      }
    }
    return null;
  };

  const firstNodeId = findFirstComponentNode(info.tree_data);
  if (firstNodeId) {
    info.active_node = firstNodeId;
    loadComponent(firstNodeId);
  }
});

// 监听节点切换
watch(() => info.active_node, async (newNodeId) => {
  if (newNodeId) {
    await loadComponent(newNodeId);
  }
}, { immediate: true });

// 查找当前激活节点的数据
const getCurrentNodeData = () => {
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === info.active_node) {
        return node;
      }
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findNode(info.tree_data);
};
</script>

<template>
  <div class="page_wrapper">
    <div class="flex">
      <div class="tree_sidebar" style="width: 250px; border-right: 1px solid #eee; padding-right: 15px;">
        <el-tree :data="info.tree_data" :props="{ children: 'children', label: 'name' }" @node-click="handleNodeClick"
          :default-expand-all="true" :highlight-current="true" node-key="id">
          <template #default="{ node, data }">
            <span :class="{ 'no-component': !data.hasComponent }">
              {{ node.label }}
            </span>
          </template>
        </el-tree>
      </div>

      <div class="main_box" style="flex: 1;">
        <div class="main_item" v-if="loadedComponents[info.active_node]">
          <!-- 使用一个唯一key确保切换时重新渲染，但组件已预加载 -->
          <component :is="loadedComponents[info.active_node]" :key="info.active_node" />
        </div>
        <div v-else class="no-content" v-if="info.active_node">
          正在加载组件...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_wrapper {
  height: 100%;

  .flex {
    display: flex;
    height: 100%;
  }

  .tree_sidebar {
    height: 100%;
    overflow-y: auto;
  }

  .main_box {
    height: 100%;
    overflow-y: auto;

    .main_item {
      height: 100%;
    }

    .no-content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
    }
  }
}

.no-component {
  color: #aaa;
  font-style: italic;
}
</style>
