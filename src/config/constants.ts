export const CONFIG = {
  MAX_MONTH_RANGE: 48,
  DEFAULT_COLOR: '#409EFF',
  CHART_HEIGHT: 600,
  DATE_FORMAT: 'YYYY-MM-DD',
  CACHE_PREFIX: 'weather_',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL
} as const

export const MESSAGE = {
  NO_DATA: (region: string, year: string, month: string) => 
    `暂无 ${region} ${year}年${month}月历史天气数据`,
  FETCH_ERROR: (region: string, year: string, month: string) => 
    `${region} ${year}年${month}月数据获取失败`,
  DATE_RANGE_ERROR: `日期跨度不能超过${CONFIG.MAX_MONTH_RANGE}个月`,
  INCOMPLETE_CONFIG: '请先完成配置',
  FETCH_SUCCESS: '数据获取完成',
  NO_DATA_FETCHED: '未能获取任何数据'
} as const

export const SHORTCUTS = [
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
  }
] as const 