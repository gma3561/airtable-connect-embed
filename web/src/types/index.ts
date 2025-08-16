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
  address: string | null;
  updatedAt: string;
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