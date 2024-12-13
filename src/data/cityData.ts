import { theProvs, prov, provqx } from './citySelectData'
import type { CityData, DistrictData } from '@/types'

interface ParsedRegionData {
  provinces: Record<string, string>
  cities: Record<string, CityData[]>
}

class RegionDataParser {
  private static parseLetterName(letterName: string): { letter: string; name: string } {
    const [letter, name] = letterName.split(' ')
    return { letter, name }
  }

  private static isDirectCity(provinceCode: string, cityString: string): boolean {
    return !cityString.includes('|') && 
           cityString.split('-').length === 3 &&
           cityString.split('-')[2] === provinceCode
  }

  private static parseCityString(cityString: string): { code: string; letter: string; name: string } {
    const [code, letterName] = cityString.split('-')
    const { letter, name } = this.parseLetterName(letterName)
    return { code, letter, name }
  }

  private static parseDistrictString(districtString: string): DistrictData {
    const [code, letterName, cityCode] = districtString.split('-')
    const { letter, name } = this.parseLetterName(letterName)
    return { code, letter, name, cityCode }
  }

  static parseRegionData(): ParsedRegionData {
    const provinces = { ...theProvs }
    const cities: Record<string, CityData[]> = {}

    // 处理城市数据
    Object.entries(prov).forEach(([provinceCode, cityString]) => {
      const isDirectCity = this.isDirectCity(provinceCode, cityString)
      
      if (isDirectCity) {
        const { code, letter, name } = this.parseCityString(cityString)
        cities[provinceCode] = [{
          code: provinceCode,
          letter,
          name,
          districts: []
        }]
      } else {
        cities[provinceCode] = cityString.split('|').map(city => {
          const { code, letter, name } = this.parseCityString(city)
          return {
            code,
            letter,
            name,
            districts: []
          }
        })
      }
    })

    // 处理区县数据
    Object.entries(provqx).forEach(([provinceCode, cityDistrictsArray]) => {
      const provinceCities = cities[provinceCode]
      if (!provinceCities) return

      const isDirectCity = provinceCities.length === 1 && 
                         provinceCities[0].code === provinceCode

      cityDistrictsArray.forEach(cityDistricts => {
        const districts = cityDistricts.split('|').map(district => 
          this.parseDistrictString(district)
        )

        if (isDirectCity) {
          provinceCities[0].districts.push(...districts.map(d => ({
            ...d,
            cityCode: provinceCode
          })))
        } else {
          const cityCode = districts[0].cityCode
          const city = provinceCities.find(c => c.code === cityCode)
          if (city) {
            city.districts.push(...districts)
          }
        }
      })
    })

    return { provinces, cities }
  }
}

export const regionData = RegionDataParser.parseRegionData()