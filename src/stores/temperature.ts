import { defineStore } from 'pinia'
import { getWeatherData } from '@/utils/weatherApi'
import type { TemperatureData } from '@/types/temperature'

interface TemperatureState {
  temperatureData: {
    [key: string]: TemperatureData[]
  }
  loading: boolean
  error: string | null
  series: {
    id: string
    name: string
    type: 'high' | 'low'
    color: string
    data: TemperatureData[]
  }[]
}

export const useTemperatureStore = defineStore('temperature', {
  state: (): TemperatureState => ({
    temperatureData: {},
    loading: false,
    error: null,
    series: []
  }),

  getters: {
    dates: (state) => {
      const allDates = new Set<string>()
      state.series.forEach(series => {
        series.data.forEach(item => allDates.add(item.date))
      })
      return Array.from(allDates).sort()
    },

    allSeries: (state) => {
      return state.series.map(series => ({
        name: series.name,
        type: 'line',
        data: state.dates.map(date => {
          const dataPoint = series.data.find(d => d.date === date)
          return dataPoint ? dataPoint[series.type] : null
        }),
        itemStyle: {
          color: series.color
        },
        showSymbol: false,
        smooth: true
      }))
    }
  },

  actions: {
    async fetchTemperatureData(areaId: string, year: string, month: string) {
      const cacheKey = `${areaId}_${year}_${month}`
      
      // 如果 store 中已经有数据，直接返回
      if (this.temperatureData[cacheKey]) {
        console.log(`[Store Cache Hit] Using store data for ${areaId} ${year}-${month}`)
        return this.temperatureData[cacheKey]
      }

      this.loading = true
      this.error = null

      try {
        const data = await getWeatherData({
          areaId,
          areaType: '2',
          year,
          month
        })
        
        // 存入 store 缓存
        if (data.length > 0) {
          this.temperatureData[cacheKey] = data
          console.log(`[Store Cache Update] Stored data in store for ${areaId} ${year}-${month}`)
        }
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取温度数据失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    addSeries(id: string, name: string, type: 'high' | 'low', color: string, data: TemperatureData[]) {
      this.series.push({ id, name, type, color, data })
    },

    removeSeries(id: string) {
      const index = this.series.findIndex(s => s.id === id)
      if (index !== -1) {
        this.series.splice(index, 1)
      }
    },

    clearSeries() {
      this.series = []
    },

    updateSeriesColor(id: string, color: string) {
      const series = this.series.find(s => s.id === id)
      if (series) {
        series.color = color
      }
    }
  }
}) 