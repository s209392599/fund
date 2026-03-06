/**
 * ECharts 按需引入配置
 * 只引入项目需要的图表类型和组件
 */
import * as echarts from 'echarts/core';
import {
  LineChart,
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  MarkLineComponent,
} from 'echarts/components';
import {
  CanvasRenderer,
} from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AxisPointerComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

// 导出给全局使用
export default echarts;

/**
 * 获取 ECharts 实例的辅助函数
 * 在组件中可以直接调用 getEcharts() 获取 echarts 对象
 * @returns {*} echarts 对象
 */
export function getEcharts() {
  return echarts;
}
