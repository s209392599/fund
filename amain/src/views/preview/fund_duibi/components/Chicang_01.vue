<script setup>
// 重仓股票
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => [],
  }
})
const info = reactive({ data: [] });

const turn_color = (rate) => {
  if ([null, undefined].includes(rate)) {
    return '';
  }
  return rate.includes('-') ? 'text-green' : 'text-red';
}

</script>

<template>
  <div class="stock_main_wrapper">
    <div class="stock_content">
      <div class="stock_item stock_title_box flex">
        <div class="stock_lie_1">重仓股</div>
        <div class="stock_lie_2">价格</div>
        <div class="stock_lie_3">持仓占比</div>
        <div class="stock_lie_4">较上期变动</div>
        <div class="stock_lie_5">行业</div>
        <div class="stock_lie_6">重仓情况</div>
      </div>

      <div class="stock_item flex" v-for="(item_1, index_1) in props.data" :key="index_1">
        <div class="stock_lie_1">
          <div class="stock_item_name_text truncate">{{ item_1.name }}</div>
          <div class="stock_item_name_code truncate">{{ item_1.code }}</div>
        </div>
        <div class="stock_lie_2">
          <div class="" :class="turn_color(item_1.newestPrize)">{{ item_1.newestPrize }}</div>
          <div class="stock_item_rate" :class="turn_color(item_1.rate)">{{ item_1.rate }}</div>
        </div>
        <div class="stock_lie_3">
          <span class="">{{ item_1.ratio }}</span>
        </div>
        <div class="stock_lie_4">
          <span class="">{{ item_1.holdingSharesChange }}</span>
        </div>
        <div class="stock_lie_5">
          <span class="">{{ item_1.industryName }}</span>
        </div>
        <div class="stock_lie_6">
          <span class="">{{ item_1.positionQuarters }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$stock_width_lie_01: 100px;
$stock_width_lie_02: 60px;
$stock_width_lie_03: 60px;
$stock_width_lie_04: 64px;
$stock_width_lie_05: 60px;
$stock_width_lie_06: 90px;

$stock_total_width: calc(#{$stock_width_lie_01} + #{$stock_width_lie_02} + #{$stock_width_lie_03} + #{$stock_width_lie_04} + #{$stock_width_lie_05} + #{$stock_width_lie_06});

.text-red {
  color: #ef4034;
}

.text-green {
  color: #1db270;
}

.stock_main_wrapper {
  overflow-x: auto;

  .stock_content {
    width: $stock_total_width;
    min-width: $stock_total_width;

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

    .stock_lie_3 {
      text-align: right;
      width: $stock_width_lie_03;
      max-width: $stock_width_lie_03;
    }

    .stock_lie_4 {
      text-align: right;
      width: $stock_width_lie_04;
      max-width: $stock_width_lie_04;
    }

    .stock_lie_5 {
      text-align: right;
      width: $stock_width_lie_05;
      max-width: $stock_width_lie_05;
    }

    .stock_lie_6 {
      text-align: right;
      width: $stock_width_lie_06;
      max-width: $stock_width_lie_06;
    }

  }
}
</style>
