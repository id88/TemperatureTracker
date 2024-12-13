<template>
  <div class="temp-chart">
    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading"><Loading /></el-icon>
      加载中...
    </div>
    <v-chart 
      class="chart" 
      :option="chartOption" 
      :loading="loading"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTemperatureStore } from '@/stores/temperature'
import type { EChartsOption, SeriesOption } from 'echarts'
import type { TooltipComponentFormatterCallback } from 'echarts/types/dist/shared'
import { Loading } from '@element-plus/icons-vue'

// 注册必要的组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
])

const temperatureStore = useTemperatureStore()
const loading = ref(false)

// 图表配置
const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: '温度趋势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: ((params) => {
      if (!Array.isArray(params)) {
        return ''
      }
      const date = params[0].axisValue
      let result = `${date}<br/>`
      params.forEach((series) => {
        if (series.value != null) {
          result += `${series.seriesName}: ${series.value}°C<br/>`
        }
      })
      return result
    }) as TooltipComponentFormatterCallback
  },
  legend: {
    data: temperatureStore.allSeries.map(series => series.name),
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: temperatureStore.dates
  },
  yAxis: {
    type: 'value',
    name: '温度 (°C)',
    axisLabel: {
      formatter: '{value} °C'
    },
    splitNumber: 10,
    minInterval: 5
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      start: 0,
      end: 100
    }
  ],
  series: temperatureStore.allSeries as SeriesOption[]
}))
</script>

<style scoped>
.temp-chart {
  position: relative;
  width: 100%;
  height: 600px;
}

.chart {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
}
</style> 