# 开发笔记

## 环境配置文件说明

`.env.development` 和 `.env.production` 是 Vite 的环境配置文件，用于管理不同环境下的配置变量。

### 1. 环境自动判断
- 运行 `npm run dev` 时，自动使用 `.env.development` 配置
- 运行 `npm run build` 时，自动使用 `.env.production` 配置

### 2. 配置文件优先级
```
.env.production.local > .env.production > .env.local > .env
.env.development.local > .env.development > .env.local > .env
```

### 3. 在代码中使用
```typescript
// 通过 import.meta.env 访问环境变量
const baseURL = import.meta.env.VITE_API_BASE_URL

console.log('当前 API 地址:', baseURL)
// 开发环境输出: /weather-api
// 生产环境输出: https://tianqi.2345.com
```

### 4. 环境变量命名规则
- 必须以 `VITE_` 开头的变量才会暴露给客户端代码
- 例如：`VITE_API_BASE_URL`、`VITE_APP_TITLE` 等

### 5. 实际应用示例
```typescript
// src/utils/apiClient.ts
const baseURL = import.meta.env.VITE_API_BASE_URL

export class ApiClient {
  private constructor() {
    this.axiosInstance = axios.create({
      baseURL,  // 根据环境自动使用不同的基础URL
      // ...其他配置
    })
  }
}
```

### 6. 环境标识
```typescript
// 判断当前环境
if (import.meta.env.DEV) {
  console.log('开发环境')
} else if (import.meta.env.PROD) {
  console.log('生产环境')
}
```

### 7. 其他内置变量
```typescript
import.meta.env.MODE: string          // 应用运行的模式
import.meta.env.BASE_URL: string      // 部署时的基础 URL
import.meta.env.PROD: boolean         // 是否是生产环境
import.meta.env.DEV: boolean          // 是否是开发环境
import.meta.env.SSR: boolean          // 是否是服务器端渲染
```

### 设计优势
1. 自动化环境切换，无需手动修改配置
2. 开发和生产环境可以使用不同的配置
3. 避免了环境配置的硬编码
4. 提高了代码的可维护性和安全性 



## API 请求流程

1. 本地开发环境
   - 请求流程：
     ```
     浏览器 
     -> http://localhost:5173/weather-api/Pc/GetHistory 
     -> Vite Dev Server 
     -> Vite 代理 
     -> https://tianqi.2345.com/Pc/GetHistory 
     -> 返回数据
     ```
   - 关键配置：
     ```typescript
     // .env.development
     VITE_API_BASE_URL=/weather-api

     // vite.config.ts
     server: {
         proxy: {
             '/weather-api': {
                 target: 'https://tianqi.2345.com',
                 changeOrigin: true,
                 rewrite: (path) => path.replace(/^\/weather-api/, ''),
                 headers: {
                     'Referer': 'https://tianqi.2345.com',
                     'Origin': 'https://tianqi.2345.com'
                 }
             }
         }
     }
     ```
   - 工作原理：
     - 前端发起请求到 `/weather-api/Pc/GetHistory`
     - Vite 开发服务器拦截请求
     - 通过代理转发到 `https://tianqi.2345.com/Pc/GetHistory`
     - 添加必要的请求头
     - 返回数据给前端

2. 生产环境
   - 请求流程：
     ```
     浏览器 
     -> https://id88.github.io/TemperatureTracker/ 
     -> https://tianqi.2345.com/Pc/GetHistory 
     -> 返回数据/跨域错误
     ```
   - 关键配置：
     ```typescript
     // .env.production
     VITE_API_BASE_URL=https://tianqi.2345.com

     // vite.config.ts
     base: process.env.GITHUB_ACTIONS ? '/TemperatureTracker/' : '/',
     ```
   - 工作原理：
     - 前端直接发起请求到目标 API
     - 需要目标服务器支持跨域请求
     - 如果目标服务器不支持跨域，需要：
       1. 使用 CORS 代理服务
       2. 或部署自己的后端服务转发请求
       3. 或使用第三方代理服务

3. 主要区别
   - 请求路径：
     - 开发：通过本地代理 `/weather-api/*`
     - 生产：直接请求目标 API `https://tianqi.2345.com/*`
   - 跨域处理：
     - 开发：由 Vite 代理处理
     - 生产：需要目标服务器支持或使用代理服务
   - 请求头：
     - 开发：由代理配置添加
     - 生产：需要手动设置或由代理服务添加
   - 错误处理：
     - 开发：可以在代理层捕获错误
     - 生产：主要依赖前端的错误处理

4. 路径配置：
   - 本地开发：base = '/'
   - GitHub Pages：base = '/TemperatureTracker/'

5. API 请求：
   - 本地开发：'/weather-api/Pc/GetHistory'
   - 生产环境：'https://tianqi.2345.com/Pc/GetHistory'

6. 跨域处理：
   - 开发环境：使用 Vite 的代理配置
   - 生产环境：使用 CORS 代理服务或直接请求目标 API

