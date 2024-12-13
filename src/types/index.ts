export * from './region'
export * from './temperature'

// 通用类型定义
export interface ApiResponse<T> {
  status: number
  msg: string
  data: T
}

export interface CacheableData {
  timestamp: number
  data: any
}

// 图表相关类型
export interface ChartSeries {
  name: string
  type: 'line'
  data: (number | null)[]
  itemStyle: {
    color: string
  }
  showSymbol: boolean
  smooth: boolean
}

// API 参数类型
export interface WeatherParams {
  areaId: string
  areaType: string
  year: string
  month: string
} 