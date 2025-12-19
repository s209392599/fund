<script setup>
// 重仓基金
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => [],
  }
})

</script>

<template>
  <div class="stock_main_wrapper">
    <div class="stock_content">
      <div class="stock_item stock_title_box flex">
        <div class="stock_lie_1">基金名称</div>
        <div class="stock_lie_2">持仓占比</div>
      </div>

      <div class="stock_item flex" v-for="(item_1, index_1) in props.data" :key="index_1">
        <div class="stock_lie_1">
          <div class="stock_item_name_text truncate">{{ item_1.holdingFundName }}</div>
          <div class="stock_item_name_code truncate">{{ item_1.holdingFundCode }}</div>
        </div>
        <div class="stock_lie_2">
          <span class="">{{ item_1.navRatio }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$stock_width_lie_01: calc(100% - 60px);
$stock_width_lie_02: 60px;

.stock_main_wrapper {
  overflow-x: auto;

  .stock_content {
    .stock_title_box {
      padding: 5px 0px 5px 0px;
      border-bottom: 1px solid #ddd;
      color: #999;
    }
  }

  :deep(.stock_item) {
    padding: 5px 0px 0px 0px;

    .stock_lie_1 {
      width: $stock_width_lie_01;
      max-width: $stock_width_lie_01;

      .stock_item_name_code {
        color: #999;
        font-size: 12px;
      }
    }

    .stock_lie_2 {
      text-align: right;
      width: $stock_width_lie_02;
      max-width: $stock_width_lie_02;

      .stock_item_rate {
        font-size: 12px;
      }
    }
  }
}
</style>
