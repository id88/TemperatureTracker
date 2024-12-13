<template>
    <div class="region-selector">
      <el-cascader
        v-model="selectedRegion"
        :options="regions"
        :props="cascaderProps"
        placeholder="请选择地区"
        @change="handleRegionChange"
        class="custom-cascader"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRegionStore } from '@/stores/region'
  import type { CascaderOption } from '@/types'
  
  const props = defineProps<{
    modelValue: string[]
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
    (e: 'regionNames', value: string[]): void
  }>()
  
  const store = useRegionStore()
  const selectedRegion = ref(props.modelValue)
  
  // 监听 props 变化
  watch(() => props.modelValue, (newValue) => {
    selectedRegion.value = newValue
  })
  
  const cascaderProps = {
    value: 'code',
    label: 'name',
    children: 'children',
    checkStrictly: true
  }
  
  // 构建级联选择器的选项数据
  const regions = computed(() => {
    return Object.entries(store.provinces).map(([code, fullName]): CascaderOption => {
      const cities = store.getCities(code)
      const isDirectCity = store.isDirectCity(code)

      if (isDirectCity) {
        // 直辖市处理：省市同名
        const { letter, name } = store.parseLetterName(fullName)
        return {
          code,
          letter,
          name,
          children: [{
            code,
            letter,
            name,
            children: cities[0].districts.map(district => ({
              code: district.code,
              letter: district.letter,
              name: district.name
            }))
          }]
        }
      }

      // 普通省份处理
      const { letter, name } = store.parseLetterName(fullName)
      return {
        code,
        letter,
        name,
        children: cities.map(city => ({
          code: city.code,
          letter: city.letter,
          name: city.name,
          children: city.districts.map(district => ({
            code: district.code,
            letter: district.letter,
            name: district.name
          }))
        }))
      }
    })
  })
  
  const handleRegionChange = (value: string[]) => {
    emit('update:modelValue', value)
    
    if (value.length === 3) {
      const names = store.getRegionNames(value)
      if (names) {
        emit('regionNames', names)
      }
    }
  }
  </script>
  
  <style scoped>
  .custom-cascader {
    width: 100%;
  }
  
  :deep(.el-cascader .el-input .el-input__inner) {
    padding-left: 10px;
    min-width: 280px;
  }
  
  
  :deep(.el-cascader-panel) {
    .el-cascader-menu {
      min-width: 280px;
      max-width: none;
    }
  
  }
  </style>