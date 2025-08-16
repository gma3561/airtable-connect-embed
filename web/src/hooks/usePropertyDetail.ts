import { useQuery } from "@tanstack/react-query";
import { fetchPropertyById } from "../services/api";

/**
 * Custom hook to fetch a property detail with React Query
 * @param id Property ID
 */
export function usePropertyDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => {
      if (!id) throw new Error("Property ID is required");
      return fetchPropertyById(id);
    },
    enabled: !!id, // Only run query if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}