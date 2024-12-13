# Temperature Tracker

一个用于展示不同地区历史气温趋势的 Web 应用。

## 功能特性

- 三级联动地区选择
- 日期范围选择
- 多折线图表展示
- 支持多地区数据对比
- 本地数据缓存
- 响应式设计

## 技术栈

- Vue 3
- TypeScript
- Element Plus
- Vite
- Pinia
- ECharts
- Axios

## 项目结构

```
src/
├── assets/ # 静态资源
├── components/ # 组件
│ ├── DateRangePicker.vue # 日期范围选择器
│ ├── LineConfig.vue # 折线配置
│ ├── RegionSelector.vue # 地区选择器
│ └── TempChart.vue # 温度图表
├── config/ # 配置文件
│ └── constants.ts # 常量配置
├── data/ # 数据文件
│ ├── cityData.ts # 城市数据处理
│ └── citySelectData.ts # 城市选择数据
├── stores/ # 状态管理
│ ├── region.ts # 地区状态
│ └── temperature.ts # 温度数据状态
├── types/ # 类型定义
│ ├── index.ts # 类型导出
│ ├── region.ts # 地区相关类型
│ ├── shims-citydata.d.ts # 城市数据类型声明
│ └── temperature.ts # 温度数据类型
├── utils/ # 工具函数
│ ├── apiClient.ts # API 客户端
│ ├── cacheUtils.ts # 缓存工具
│ ├── dateUtils.ts # 日期工具
│ └── weatherApi.ts # 天气 API
├── App.vue # 根组件
├── main.ts # 应用入口
├── style.css # 全局样式
└── vite-env.d.ts # Vite 环境类型声明

```

## 核心功能实现

### 1. 地区数据管理

地区数据使用三级联动结构，支持直辖市和普通城市的不同处理逻辑：

```typescript
// 基础区域信息
interface BaseRegion {
  code: string
  letter: string
  name: string
}

// 区县信息
interface DistrictData extends BaseRegion {
  cityCode: string
}

// 城市信息
interface CityData extends BaseRegion {
  districts: DistrictData[]
}

// 省份信息
interface ProvinceData extends BaseRegion {
  children?: CityData[]
}
```

### 2. 温度数据获取

通过 `weatherApi.ts` 实现数据获取、解析和缓存：

```typescript
// 温度数据结构
interface TemperatureData {
  date: string
  high: number
  low: number
}

// API 参数
interface WeatherParams {
  areaId: string
  areaType: string
  year: string
  month: string
}

// 获取天气数据（包含缓存处理）
async function getWeatherData(params: WeatherParams): Promise<TemperatureData[]>
```

### 3. 组件功能
#### 1. 地区选择 (RegionSelector.vue)
- 实现省/市/区三级联动选择
- 特殊处理直辖市显示逻辑，直辖市会显示为"省-市-区"的形式（如：北京-北京-朝阳）特别行政区同样遵循三级结构
- 支持地区名称和编码的双向绑定
- 使用 Element Plus 的 Cascader 组件实现

#### 2. 日期范围选择 (DateRangePicker.vue)
- 开始日期和结束日期选择（最大48个月）
- 禁用未来日期
- 使用 Element Plus 的 DatePicker 组件
- 内置快捷选项（最近一个月/半年/一年）

#### 3. 折线配置 (LineConfig.vue)
- 颜色选择器集成
- 温度类型选择（最高/最低）
- 操作按钮支持（删除、复制、下载）
- 动态添加新配置行

#### 4. 温度图表 (TempChart.vue)
- 使用 ECharts 绘制折线图
- 支持多折线展示
- 图例显示
- 交互功能（数据提示、缩放等）

## 状态管理设计

使用 Pinia 进行状态管理，主要包含两个 store：

### 1. 地区状态 (region.ts)
```typescript
interface RegionState {
  provinces: Record<string, string>
  cities: Record<string, CityData[]>
  selectedRegion: {
    province: string
    city: string
    district: string
  }
}

// 主要功能
- getCities(provinceCode: string): CityData[]
- getDistricts(provinceCode: string, cityCode: string): DistrictData[]
- getRegionNames(codes: string[]): string[] | null
- isDirectCity(provinceCode: string): boolean
```

### 2. 温度数据状态 (temperature.ts)
```typescript
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

// 主要功能
- fetchTemperatureData(params: WeatherParams): Promise<TemperatureData[]>
- addSeries(id: string, name: string, type: 'high' | 'low', color: string, data: TemperatureData[])
- removeSeries(id: string)
- updateSeriesColor(id: string, color: string)
```



### 3. 数据缓存策略

使用 CacheManager 实现数据缓存管理：

```typescript
class CacheManager {
  // 缓存有效期：24小时
  private static CACHE_EXPIRY = 24 * 60 * 60 * 1000

  // 获取缓存数据
  static get<T>(prefix: string, ...keys: string[]): T | null

  // 设置缓存数据
  static set<T>(data: T, prefix: string, ...keys: string[]): void

  // 清除指定缓存
  static remove(prefix: string, ...keys: string[]): void

  // 清除所有缓存
  static clear(prefix: string): void
}
```



## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 注意事项

1. 本地开发和生产环境的区别：
   - 本地开发使用 Vite 代理处理跨域
   - 生产环境需要确保 API 支持跨域请求

2. 环境变量：
   - 本地开发：使用 .env.development
   - 生产环境：使用 .env.production

3. 路径配置：
   - 本地开发：base = '/'
   - GitHub Pages：base = '/TemperatureTracker/'

4. API 请求：
   - 本地开发：'/weather-api/Pc/GetHistory'
   - 生产环境：'https://tianqi.2345.com/Pc/GetHistory'

5. 跨域处理：
   - 开发环境：使用 Vite 的代理配置
   - 生产环境：使用 CORS 代理服务或直接请求目标 API


## License

[MIT](LICENSE)