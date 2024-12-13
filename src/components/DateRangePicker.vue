<template>
  <div class="date-range-picker">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :shortcuts="shortcuts"
      :disabled-date="disabledDate"
      value-format="YYYY-MM-DD"
      @change="handleDateChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: [string, string]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: [string, string]): void
}>()

const dateRange = ref<[string, string]>(props.modelValue)

// 监听 props 变化
watch(() => props.modelValue, (newValue) => {
  dateRange.value = newValue
})

// 禁用日期的条件
const disabledDate = (time: Date) => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  // 禁用未来日期
  if (time.getTime() > lastDayOfMonth.getTime()) {
    return true
  }

  // 如果已经选择了开始日期，检查是否超过48个月
  if (dateRange.value[0]) {
    const startDate = new Date(dateRange.value[0])
    const maxEndDate = new Date(startDate)
    maxEndDate.setMonth(startDate.getMonth() + 48)
    
    const minStartDate = new Date(time)
    minStartDate.setMonth(time.getMonth() - 48)

    // 如果是选择结束日期
    if (time.getTime() > startDate.getTime()) {
      return time.getTime() > maxEndDate.getTime()
    }
    // 如果是选择开始日期
    else {
      return dateRange.value[1] && new Date(dateRange.value[1]).getTime() > maxEndDate.getTime()
    }
  }

  return false
}

const handleDateChange = (value: [string, string]) => {
  if (!value) return

  const startDate = new Date(value[0])
  const endDate = new Date(value[1])
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth())

  if (monthDiff > 48) {
    ElMessage.warning('日期跨度不能超过48个月')
    // 自动调整结束日期
    const maxEndDate = new Date(startDate)
    maxEndDate.setMonth(startDate.getMonth() + 48)
    value[1] = maxEndDate.toISOString().split('T')[0]
  }

  console.log('Date range changed:', value)
  emit('update:modelValue', value)
}

// 修改快捷选项，确保不超过48个月
const shortcuts = [
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近半年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '最近一年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '最近两年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 2)
      return [start, end]
    },
  }
]
</script>

<style scoped>
.date-range-picker {
  width: 100%;
}
</style> 