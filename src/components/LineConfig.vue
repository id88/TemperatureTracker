<template>
  <div class="line-config">
    <el-table :data="configs" style="width: 100%">
      <el-table-column label="地区选择" width="340">
        <template #default="{ row }">
          <RegionSelector 
            v-model="row.region" 
            @region-names="names => handleRegionNames(row, names)"
          />
        </template>
      </el-table-column>

      <el-table-column label="日期范围" width="380">
        <template #default="{ row }">
          <DateRangePicker v-model="row.dateRange" />
        </template>
      </el-table-column>

      <el-table-column label="类别" width="140">
        <template #default="{ row }">
          <el-select v-model="row.type" placeholder="选择类别">
            <el-option label="最高气温" value="high" />
            <el-option label="最低气温" value="low" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="颜色" width="80">
        <template #default="{ row }">
          <el-color-picker 
            v-model="row.color" 
            @change="(val: string) => handleColorChange(row, val)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button-group>
            <el-button :icon="DocumentCopy" @click="copyConfig(row)" />
            <el-button :icon="Delete" @click="deleteConfig(row)" />
            <el-button 
              :icon="Download" 
              :loading="row.loading"
              :disabled="!isConfigComplete(row)"
              @click="fetchData(row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div class="add-button">
      <el-button type="primary" :icon="Plus" @click="addConfig">添加新配置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DocumentCopy, Delete, Plus, Download } from '@element-plus/icons-vue'
import { useTemperatureStore } from '@/stores/temperature'
import RegionSelector from './RegionSelector.vue'
import DateRangePicker from './DateRangePicker.vue'
import { v4 as uuidv4 } from 'uuid'
import type { LineConfig, TemperatureData } from '@/types/temperature'
import { ElMessage } from 'element-plus'

const temperatureStore = useTemperatureStore()

interface ExtendedLineConfig extends LineConfig {
  regionNames?: string[]
}

const configs = ref<ExtendedLineConfig[]>([])

// 检查配置是否完整
const isConfigComplete = (config: ExtendedLineConfig) => {
  return config.region.length === 3 && 
         config.dateRange[0] && 
         config.dateRange[1]
}

// 获取指定日期范围内的所有月份
const getMonthsBetween = (startDate: Date, endDate: Date) => {
  const months: { year: string; month: string }[] = []
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const lastDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  while (currentDate <= lastDate) {
    months.push({
      year: currentDate.getFullYear().toString(),
      month: (currentDate.getMonth() + 1).toString().padStart(2, '0')
    })
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return months
}

// 获取天气数据
const fetchData = async (config: ExtendedLineConfig) => {
  if (!isConfigComplete(config)) {
    ElMessage.warning('请先完成配置')
    return
  }

  const startDate = new Date(config.dateRange[0])
  const endDate = new Date(config.dateRange[1])
  
  // 检查日期跨度
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth())
  
  if (monthDiff > 48) {
    ElMessage.warning('日期跨度不能超过48个月')
    return
  }

  const areaId = config.region[2]
  const regionName = config.regionNames?.[2] || config.region[2]

  console.log('Fetching data for date range:', {
    startDate,
    endDate,
    areaId
  })

  try {
    config.loading = true
    const months = getMonthsBetween(startDate, endDate)
    console.log('Months to fetch:', months)
    
    const results = []
    for (const { year, month } of months) {
      try {
        console.log(`Fetching data for: ${areaId} ${year}-${month}`)
        const data = await temperatureStore.fetchTemperatureData(areaId, year, month)
        
        // 检查是否是未来月份的数据
        const currentDate = new Date(parseInt(year), parseInt(month) - 1)
        const now = new Date()
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        if (currentDate.getTime() > lastDayOfMonth.getTime()) {
          console.log(`Skipping future date: ${year}-${month}`)
          break // 停止获取后续月份数据
        }

        if (data.length === 0) {
          ElMessage.warning(`暂无 ${regionName} ${year}年${month}月历史天气数据`)
          // 如果是因为未来日期导致的无数据，停止获取后续月份
          if (currentDate.getTime() > now.getTime()) {
            break
          }
          continue
        }

        console.log(`Data received for ${year}-${month}:`, data)
        results.push({
          year,
          month,
          data
        })
      } catch (error) {
        console.error(`Failed to fetch data for ${year}-${month}:`, error)
        ElMessage.warning(`${regionName} ${year}年${month}月数据获取失败`)
        continue
      }
    }

    if (results.length > 0) {
      // 合并所有月份的数据
      const allData = results.reduce((acc, { data }) => [...acc, ...data], [] as TemperatureData[])
      
      // 添加到图表系列
      temperatureStore.addSeries(
        config.id,
        `${regionName} ${config.type === 'high' ? '最高' : '最低'}温度`,
        config.type,
        config.color,
        allData
      )
      ElMessage.success('数据获取完成')
    } else {
      ElMessage.warning('未能获取任何数据')
    }
  } catch (error) {
    console.error('获取温度数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    config.loading = false
  }
}

const addConfig = () => {
  const now = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(now.getFullYear() - 1)

  configs.value.push({
    id: uuidv4(),
    region: [],
    regionNames: undefined,
    dateRange: [
      oneYearAgo.toISOString().split('T')[0],
      now.toISOString().split('T')[0]
    ],
    type: 'high',
    color: '#409EFF',
    loading: false
  })
}

const deleteConfig = (row: ExtendedLineConfig) => {
  const index = configs.value.findIndex(config => config.id === row.id)
  if (index !== -1) {
    configs.value.splice(index, 1)
  }
  
  temperatureStore.removeSeries(row.id)
}

const copyConfig = (row: ExtendedLineConfig) => {
  configs.value.push({
    ...row,
    id: uuidv4(),
    regionNames: row.regionNames ? [...row.regionNames] : undefined
  })
}

// 处理区域名称
const handleRegionNames = (config: ExtendedLineConfig, names: string[]) => {
  config.regionNames = names
}

// 处理颜色变化
const handleColorChange = (config: ExtendedLineConfig, color: string): void => {
  if (color) {
    temperatureStore.updateSeriesColor(config.id, color)
  }
}
</script>

<style scoped>
.line-config {
  padding: 20px;
}
.add-button {
  margin-top: 20px;
  text-align: center;
}
</style> 