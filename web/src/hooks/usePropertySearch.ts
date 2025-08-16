import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { SearchParams, PropertyListResponse } from "../types";
import { fetchProperties } from "../services/supabaseApi";

/**
 * Custom hook to fetch properties with React Query
 * @param params Search parameters
 */
export function usePropertySearch(params: SearchParams) {
  return useQuery<PropertyListResponse>({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}