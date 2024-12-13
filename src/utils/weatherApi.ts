import { api } from './apiClient'
import { CacheManager } from './cacheUtils'
import { CONFIG } from '@/config/constants'
import type { TemperatureData, WeatherParams } from '@/types'

interface WeatherResponse {
  status: number
  msg: string
  data: {
    html: string
  } | {
    [key: string]: string
  }
}

export async function fetchWeatherHistory(params: WeatherParams): Promise<TemperatureData[]> {
  try {
    const response = await api.get<WeatherResponse>('/Pc/GetHistory', {
      params: {
        'areaInfo[areaId]': params.areaId,
        'areaInfo[areaType]': params.areaType,
        'date[year]': params.year,
        'date[month]': params.month
      }
    })

    console.log('API Response:', response)

    // 检查响应数据
    if (!response || !response.data) {
      console.log(`No data in response for ${params.year}-${params.month}`)
      return []
    }

    // 处理 HTML 数据
    const htmlContent = typeof response.data === 'object' && 'html' in response.data 
      ? response.data.html 
      : String(response.data)
    if (typeof htmlContent === 'string') {
      if (htmlContent.includes('暂无')) {
        console.log(`No data available for ${params.year}-${params.month}`)
        return []
      }
      const data = parseWeatherData(htmlContent)
      return data
    }
    
    console.error('Invalid response format:', response)
    return []
  } catch (error) {
    console.error('Failed to fetch weather data:', error)
    throw error
  }
}

function parseWeatherData(htmlString: string): TemperatureData[] {
  try {
    if (htmlString.includes('暂无')) return []

    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    const rows = doc.querySelectorAll('table.history-table tr')
    const data: TemperatureData[] = []

    if (!rows.length) {
      console.warn('No table rows found in HTML response')
      return []
    }

    // 跳过表头行
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td')
      if (cells.length >= 3) {
        const dateText = cells[0].textContent?.trim() || ''
        const date = dateText.split(' ')[0]
        const high = parseFloat(cells[1].textContent?.trim().replace('°', '') || '0')
        const low = parseFloat(cells[2].textContent?.trim().replace('°', '') || '0')
        
        if (date && !isNaN(high) && !isNaN(low)) {
          data.push({ date, high, low })
        }
      }
    }

    return data
  } catch (error) {
    console.error('Error parsing weather data:', error)
    return []
  }
}

export async function getWeatherData(params: WeatherParams): Promise<TemperatureData[]> {
  const cacheKey = [params.areaId, params.year, params.month]
  
  try {
    // 尝试从缓存获取
    const cached = CacheManager.get<TemperatureData[]>(CONFIG.CACHE_PREFIX, ...cacheKey)
    if (cached) {
      console.log(`[Cache Hit] Using cached data for ${params.areaId} ${params.year}-${params.month}`)
      return cached
    }

    console.log(`[Cache Miss] Fetching data from API for ${params.areaId} ${params.year}-${params.month}`)
    const data = await fetchWeatherHistory(params)
    
    // 存入缓存
    if (data.length > 0) {
      CacheManager.set(data, CONFIG.CACHE_PREFIX, ...cacheKey)
      console.log(`[Cache Update] Stored data in cache for ${params.areaId} ${params.year}-${params.month}`)
    }
    
    return data
  } catch (error) {
    console.error('Failed to get weather data:', error)
    throw error
  }
} 