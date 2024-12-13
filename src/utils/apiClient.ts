import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { CONFIG } from '@/config/constants'
import type { ApiResponse } from '@/types'

const baseURL = import.meta.env.VITE_API_BASE_URL

// 判断当前环境
if (import.meta.env.DEV) {
    console.log('开发环境')
  } else if (import.meta.env.PROD) {
  console.log('生产环境')
}
console.log('当前 API 地址:', baseURL)

export class ApiClient {
  private static instance: ApiClient
  private axiosInstance: AxiosInstance

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      config => {
        // 添加基础URL
        config.baseURL = CONFIG.API_BASE_URL
        return config
      },
      error => Promise.reject(error)
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, config)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`请求失败: ${error.message}`)
      }
      throw error
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`请求失败: ${error.message}`)
      }
      throw error
    }
  }
}

export const api = ApiClient.getInstance() 