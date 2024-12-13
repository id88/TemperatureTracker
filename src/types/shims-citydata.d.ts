declare module '@/data/citySelectData' {
  // 省份数据映射
  export const theProvs: Record<string, string>
  
  // 城市数据映射
  export const prov: Record<string, string>
  
  // 区县数据映射
  export const provqx: Record<string, string[]>
  
  // 数据格式说明
  interface CityDataFormat {
    /** 省份格式: "首字母 省份名" */
    province: string  // 例如: "B 北京"
    
    /** 城市格式: "城市编号-首字母 城市名-所属省编号" */
    city: string     // 例如: "12-B 北京-12"
    
    /** 区县格式: "区县编号-首字母 区县名-所属城市编号" */
    district: string // 例如: "70463-A 安义-58606"
  }
} 