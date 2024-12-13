<template>
  <div class="app-container">
    <div class="app-content">
      <div class="config-section">
        <LineConfig />
      </div>
      <div class="chart-section">
        <TempChart />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineConfig from '@/components/LineConfig.vue'
import TempChart from '@/components/TempChart.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  /* background-color: #f5f7fa; */
}

.app-content {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.chart-section {
  width: 100%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  box-sizing: border-box;
  padding: 20px;
}
</style>
