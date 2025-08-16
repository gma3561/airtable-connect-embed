import { SearchParams } from "../types";

/**
 * Extracts search parameters from URL search params
 */
export const getSearchParamsFromURL = (searchParams: URLSearchParams): SearchParams => {
  const q = searchParams.get("q") || undefined;
  const propertyType = searchParams.get("propertyType") || undefined;
  const transactionType = searchParams.get("transactionType") || undefined;
  const propertyStatus = searchParams.get("propertyStatus") || undefined;
  const agent = searchParams.get("agent") || undefined;
  
  // Handle boolean parameter
  const sharedOnlyParam = searchParams.get("sharedOnly");
  const sharedOnly = sharedOnlyParam ? sharedOnlyParam === "true" : undefined;
  
  // Handle numeric parameters
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  
  const offsetParam = searchParams.get("offset");
  const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;
  
  return {
    q,
    propertyType,
    transactionType,
    propertyStatus,
    agent,
    sharedOnly,
    limit,
    offset
  };
};

/**
 * Updates URL search params based on search parameters
 */
export const updateURLSearchParams = (
  searchParams: URLSearchParams,
  params: SearchParams
): URLSearchParams => {
  const newSearchParams = new URLSearchParams(searchParams);
  
  // Helper to set or remove param
  const setOrRemove = (key: string, value: string | undefined) => {
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
  };
  
  setOrRemove("q", params.q);
  setOrRemove("propertyType", params.propertyType);
  setOrRemove("transactionType", params.transactionType);
  setOrRemove("propertyStatus", params.propertyStatus);
  setOrRemove("agent", params.agent);
  
  if (params.sharedOnly !== undefined) {
    newSearchParams.set("sharedOnly", params.sharedOnly.toString());
  } else {
    newSearchParams.delete("sharedOnly");
  }
  
  if (params.limit !== undefined) {
    newSearchParams.set("limit", params.limit.toString());
  } else {
    newSearchParams.delete("limit");
  }
  
  if (params.offset !== undefined) {
    newSearchParams.set("offset", params.offset.toString());
  } else {
    newSearchParams.delete("offset");
  }
  
  return newSearchParams;
};