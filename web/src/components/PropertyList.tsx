import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePropertySearch } from '../hooks/usePropertySearch'
import { getSearchParamsFromURL, updateURLSearchParams } from '../utils/urlSync'
import type { SearchParams, PropertyListResponse } from '../types'
import SearchInput from './SearchInput'
import FiltersPanel from './FiltersPanel'
import PropertyTable from './PropertyTable'
import Pagination from './Pagination'
import LoadingState from './LoadingState'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

const PropertyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams = getSearchParamsFromURL(searchParams);
  
  // Set default values for pagination
  const [params, setParams] = useState<SearchParams>({
    ...initialParams,
    limit: initialParams.limit || DEFAULT_LIMIT,
    offset: initialParams.offset || DEFAULT_OFFSET
  });
  
  // Update URL when params change
  useEffect(() => {
    const newSearchParams = updateURLSearchParams(searchParams, params);
    setSearchParams(newSearchParams);
  }, [params, searchParams, setSearchParams]);
  
  // Fetch data using React Query
  const { data, isLoading, isError, error, refetch } = usePropertySearch(params) as { data: PropertyListResponse | undefined, isLoading: boolean, isError: boolean, error: unknown, refetch: () => void };
  
  // Update search query
  const handleSearch = (query: string) => {
    setParams((prev) => ({
      ...prev,
      q: query || undefined,
      offset: 0 // Reset pagination when search changes
    }));
  };
  
  // Update filters
  const handleFilterChange = (name: keyof SearchParams, value: any) => {
    setParams((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
      offset: 0 // Reset pagination when filters change
    }));
  };
  
  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setParams((prev) => ({
      ...prev,
      offset: newOffset
    }));
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">매물 목록</h2>
        <Link 
          to="/property/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 새 매물 등록
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6">
        <SearchInput 
          initialValue={params.q || ""}
          onSearch={handleSearch}
          placeholder="매물명, 주소, 동 검색..."
        />
      </div>
      
      <FiltersPanel filters={params} onFilterChange={handleFilterChange} />
      
      {/* 테이블 및 상태 */}
      {isLoading ? (
        <LoadingState rows={10} />
      ) : isError ? (
        <ErrorState 
          message={error instanceof Error ? error.message : "데이터를 불러오는 중 오류가 발생했습니다."}
          onRetry={() => refetch()}
        />
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState message={params.q ? `"${params.q}" 검색 결과가 없습니다.` : "매물 정보가 없습니다."} />
      ) : (
        <>
          {/* 결과 개수 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              검색 결과: {data?.items?.length ?? 0}건
            </div>
            <div className="text-sm text-gray-600">
              {(params.offset || 0) + 1} - {Math.min((params.offset || 0) + (params.limit || DEFAULT_LIMIT), (params.offset || 0) + (data?.items?.length || 0))} 표시
            </div>
          </div>

          {/* 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <PropertyTable 
              properties={data.items} 
              isLoading={isLoading}
              searchQuery={params.q}
            />
          </div>
          
          {/* 페이지네이션 */}
          <Pagination
            limit={params.limit || DEFAULT_LIMIT}
            offset={params.offset || DEFAULT_OFFSET}
            onPageChange={handlePageChange}
            totalEstimate={data.items.length < (params.limit || DEFAULT_LIMIT) ? undefined : 2562} // Use approximate total count
          />
        </>
      )}
    </div>
  )
}


export default PropertyList
