<template>
  <div class="app">
    <div class="config-section">
      <LineConfig />
    </div>
    <div class="chart-section">
      <TempChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import LineConfig from '@/components/LineConfig.vue'
import TempChart from '@/components/TempChart.vue'
</script>

<style>
.app {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-section {
  width: 100%;
}

.chart-section {
  width: 100%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}
</style>
