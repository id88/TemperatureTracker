import type { CacheableData } from '@/types'

export class CacheManager {
  private static CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24小时

  private static createCacheKey(prefix: string, ...parts: string[]): string {
    return `${prefix}_${parts.join('_')}`
  }

  private static isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_EXPIRY
  }

  static get<T>(prefix: string, ...keys: string[]): T | null {
    const cacheKey = this.createCacheKey(prefix, ...keys)
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) return null

    try {
      const { timestamp, data } = JSON.parse(cached) as CacheableData
      if (this.isExpired(timestamp)) {
        localStorage.removeItem(cacheKey)
        return null
      }
      return data as T
    } catch {
      localStorage.removeItem(cacheKey)
      return null
    }
  }

  static set<T>(data: T, prefix: string, ...keys: string[]): void {
    const cacheKey = this.createCacheKey(prefix, ...keys)
    const cacheData: CacheableData = {
      timestamp: Date.now(),
      data
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
  }

  static remove(prefix: string, ...keys: string[]): void {
    const cacheKey = this.createCacheKey(prefix, ...keys)
    localStorage.removeItem(cacheKey)
  }

  static clear(prefix: string): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
} 