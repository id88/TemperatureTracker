// 基础区域信息接口
export interface BaseRegion {
  code: string
  letter: string
  name: string
}

// 区县信息
export interface DistrictData extends BaseRegion {
  cityCode: string
}

// 城市信息
export interface CityData extends BaseRegion {
  districts: DistrictData[]
}

// 省份信息
export interface ProvinceData extends BaseRegion {
  children?: CityData[]
}

// 级联选择器选项
export interface CascaderOption extends BaseRegion {
  children?: CascaderOption[]
}

// 区域状态
export interface RegionState {
  provinces: Record<string, string>
  cities: Record<string, CityData[]>
  selectedRegion: {
    province: string
    city: string
    district: string
  }
}

// 区域类型
export type RegionType = 'province' | 'city' | 'district'

// 区域编码接口
export interface RegionCode {
  provinceCode: string
  cityCode: string
  districtCode: string
}