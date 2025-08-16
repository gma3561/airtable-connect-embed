import type { PropertyListResponse, SearchParams, PropertyCreateRequest, PropertyListItem } from "../types";

// Default API URL (can be overridden by environment variable)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Converts SearchParams object to URL query string
 */
export const buildQueryString = (params: SearchParams): string => {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.set("q", params.q);
  if (params.propertyType) queryParams.set("propertyType", params.propertyType);
  if (params.transactionType) queryParams.set("transactionType", params.transactionType);
  if (params.propertyStatus) queryParams.set("propertyStatus", params.propertyStatus);
  if (params.agent) queryParams.set("agent", params.agent);
  if (params.sharedOnly !== undefined) queryParams.set("sharedOnly", params.sharedOnly.toString());
  if (params.limit !== undefined) queryParams.set("limit", params.limit.toString());
  if (params.offset !== undefined) queryParams.set("offset", params.offset.toString());
  
  return queryParams.toString();
};

/**
 * Fetches property list data based on search parameters
 */
export const fetchProperties = async (params: SearchParams): Promise<PropertyListResponse> => {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/properties/search?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch properties");
  }
  
  return response.json();
};

/**
 * Fetches a single property by ID
 */
export const fetchPropertyById = async (id: string): Promise<PropertyListItem> => {
  const url = `${API_BASE_URL}/api/properties/${id}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch property details");
  }
  
  return response.json();
};

export const createProperty = async (body: PropertyCreateRequest): Promise<{ id: string }> => {
  const url = `${API_BASE_URL}/api/properties`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create property');
  }
  return response.json();
};