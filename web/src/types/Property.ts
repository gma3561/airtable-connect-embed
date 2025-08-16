export interface Property {
  id: string
  propertyName: string
  address: string
  buildingDong: string
  buildingHo: string
  agent: string
  propertyType: string
  transactionType: string
  propertyStatus: string
  price: string
  contractPeriod: string
  rentalAmount: string
  rentalType: string
  resident: string
  completionDate: string
  reregistrationReason: string
  agentMemo: string
  specialNotes: string
  registrationDate: string
  sharedStatus: string
  photos: string[]
  videos: string[]
  documents: string[]
  createdAt: string
  updatedAt: string
}

export interface PropertyListItem {
  id: string
  propertyName: string
  address: string
  buildingDong: string
  buildingHo: string
  agent: string
  propertyType: string
  transactionType: string
  propertyStatus: string
  price: string
  registrationDate: string
  sharedStatus: string
  updatedAt: string
}

export interface SearchFilters {
  propertyType: string
  transactionType: string
  propertyStatus: string
  agent: string
  sharedOnly: boolean
}

export interface SearchResponse {
  items: PropertyListItem[]
  total: number
}
