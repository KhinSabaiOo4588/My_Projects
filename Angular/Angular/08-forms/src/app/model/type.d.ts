export interface Programmer {
  id: number
  name: {
    firstName: string
    lastName: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  gender: 'Male' | 'Female' | 'Other'
  language: string[]
}

export interface Student {
  id?: number
  name: string
  phone: string
  email: string
  nrc: string
  gender: 'Male' | 'Female'
  subjects: string[]
}

interface Nrc {
  id: number
  suffixEng: string
  suffixMya: string
  cityName: string
  code: number
  createdAt: Date
  updatedAt: Date
}

interface NrcJsonType {
  id: number
  name_en: string
  name_mm: string
  city_name: string
  nrc_code: number
}

export interface NrcJsonData {
  data: NrcJsonType[]
}
