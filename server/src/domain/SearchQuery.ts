export interface PropertySearchQuery {
  text?: string; // q
  propertyType?: string;
  transactionType?: string;
  propertyStatus?: string;
  agent?: string;
  sharedOnly?: boolean;
  limit?: number;
  offset?: number;
}
