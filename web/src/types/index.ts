export interface PropertyListItem {
  id: string;
  registrationDate: string | null;
  sharedStatus: boolean | null;
  agent: string | null;
  propertyStatus: string | null;
  propertyType: string | null;
  transactionType: string | null;
  price: string | null;
  propertyName: string | null;
  buildingDong: string | null;
  buildingHo: string | null;
  // 추가 필드: 면적 및 층수 (원문 보존 위해 문자열로 표기)
  areaSupplySqm?: string | null;      // 예: "180.16"
  areaExclusiveSqm?: string | null;   // 예: "138.52"
  areaSupplyPy?: string | null;       // 예: "54.49"
  areaExclusivePy?: string | null;    // 예: "41.9"
  floor?: string | null;              // 예: "47"
  floorsTotal?: string | null;        // 예: "48"
  address: string | null;
  updatedAt: string;
}

// Detailed view type with additional optional fields
export interface PropertyDetail extends PropertyListItem {
  contractPeriod?: string | null;
  rentalAmount?: string | null;
  rentalType?: string | null;
  resident?: string | null;
  completionDate?: string | null;
  reregistrationReason?: string | null;
  agentMemo?: string | null;
  specialNotes?: string | null;
  photos?: string[] | null;
  videos?: string[] | null;
  documents?: string[] | null;
}

export interface SearchParams {
  q?: string;
  propertyType?: string;
  transactionType?: string;
  propertyStatus?: string;
  agent?: string;
  sharedOnly?: boolean;
  limit?: number; // default 50
  offset?: number; // default 0
}

export interface PropertyListResponse {
  items: PropertyListItem[];
}

export interface PropertyCreateRequest {
  propertyName: string;
  address?: string;
  buildingDong?: string;
  buildingHo?: string;
  propertyType?: string;
  transactionType?: string;
  propertyStatus?: string;
  price?: string;
  contractPeriod?: string;
  rentalAmount?: string;
  rentalType?: string;
  resident?: string;
  completionDate?: string;
  reregistrationReason?: string;
  agentMemo?: string;
  specialNotes?: string;
  registrationDate?: string;
  sharedStatus?: boolean;
  agent?: string;
}