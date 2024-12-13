export interface TemperatureData {
  date: string
  high: number
  low: number
}

export interface LineConfig {
  id: string
  region: string[]
  regionNames?: string[]
  dateRange: [string, string]
  type: 'high' | 'low'
  color: string
  loading: boolean
} 