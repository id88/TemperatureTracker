import { defineStore } from 'pinia'
import type { RegionState, RegionCode } from '@/types'
import { regionData } from '@/data/cityData'

export const useRegionStore = defineStore('region', {
  state: (): RegionState => ({
    provinces: regionData.provinces,
    cities: regionData.cities,
    selectedRegion: {
      province: '',
      city: '',
      district: '',
    },
  }),

  getters: {
    isDirectCity: (state) => (provinceCode: string) => {
      const cities = state.cities[provinceCode]
      return cities?.length === 1 && cities[0].code === provinceCode
    },
  },

  actions: {
    parseLetterName(fullName: string) {
      const [letter, name] = fullName.split(' ')
      return { letter, name }
    },

    getCities(provinceCode: string) {
      return this.cities[provinceCode] || []
    },

    getDistricts(provinceCode: string, cityCode: string) {
      const cities = this.getCities(provinceCode)
      const isDirectCity = this.isDirectCity(provinceCode)
      
      if (isDirectCity) {
        return cities[0].districts || []
      }
      
      const city = cities.find(c => c.code === cityCode)
      return city?.districts || []
    },

    getRegionNames(codes: string[]): string[] | null {
      if (codes.length !== 3) return null

      const [provinceCode, cityCode, districtCode] = codes
      const provinceName = this.provinces[provinceCode]?.split(' ')[1]
      if (!provinceName) return null

      const cities = this.getCities(provinceCode)
      const isDirectCity = this.isDirectCity(provinceCode)

      if (isDirectCity) {
        const district = cities[0].districts.find(d => d.code === districtCode)
        if (!district) return null
        return [provinceName, provinceName, district.name]
      }

      const city = cities.find(c => c.code === cityCode)
      if (!city) return null

      const district = city.districts.find(d => d.code === districtCode)
      if (!district) return null

      return [provinceName, city.name, district.name]
    },

    setSelectedRegion(codes: RegionCode) {
      this.selectedRegion = {
        province: codes.provinceCode,
        city: codes.cityCode,
        district: codes.districtCode,
      }
    },

    clearSelectedRegion() {
      this.selectedRegion = {
        province: '',
        city: '',
        district: '',
      }
    }
  },
}) 