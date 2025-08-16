import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePropertySearch } from '../hooks/usePropertySearch'
import { getSearchParamsFromURL, updateURLSearchParams } from '../utils/urlSync'
import type { SearchParams, PropertyListResponse } from '../types'
import SearchInput from './SearchInput'
import FiltersPanel from './FiltersPanel'
import PropertyTable from './PropertyTable'
import PropertyDetail from './PropertyDetail'
import Pagination from './Pagination'
import LoadingState from './LoadingState'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

const DEFAULT_LIMIT = 50;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, setSearchParams]);
  
  // Fetch data using React Query
  const { data, isLoading, isError, error, refetch } = usePropertySearch(params) as { data: PropertyListResponse | undefined, isLoading: boolean, isError: boolean, error: unknown, refetch: () => void };
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // Update search query
  const handleSearch = (query: string) => {
    setParams((prev) => ({
      ...prev,
      q: query || undefined,
      offset: 0 // Reset pagination when search changes
    }));
  };
  
  // Update filters
  const handleFilterChange = (name: keyof SearchParams, value: string | boolean) => {
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

      {/* 상단 툴바: 필터/정렬/검색 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiltersPanel filters={params} onFilterChange={handleFilterChange} />
        </div>
        <div className="w-80">
          <SearchInput 
            initialValue={params.q || ""}
            onSearch={handleSearch}
            placeholder="검색 (매물명, 주소, 동, 담당자)"
          />
        </div>
      </div>
      
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
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* 결과 개수 */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
              <div className="text-sm text-gray-600">검색 결과: {data?.items?.length ?? 0}건</div>
              <div className="text-sm text-gray-600">
                {(params.offset || 0) + 1} - {Math.min((params.offset || 0) + (params.limit || DEFAULT_LIMIT), (params.offset || 0) + (data?.items?.length || 0))} 표시
              </div>
            </div>
            <PropertyTable 
              properties={data.items} 
              isLoading={isLoading}
              searchQuery={params.q}
              onRowClick={(id) => setSelectedId(id)}
            />
            {/* 페이지네비게이션 */}
            <div className="px-4 py-3 border-t">
              <Pagination
                limit={params.limit || DEFAULT_LIMIT}
                offset={params.offset || DEFAULT_OFFSET}
                onPageChange={handlePageChange}
                totalEstimate={data.items.length < (params.limit || DEFAULT_LIMIT) ? undefined : 2562}
              />
            </div>
          </div>

          {/* 우측 디테일 슬라이드 패널 */}
          <div className={`bg-white rounded-lg shadow-sm border h-[80vh] overflow-y-auto sticky top-6 ${selectedId ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {selectedId ? (
              <div className="p-4">
                <PropertyDetail id={selectedId} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">행을 클릭하면 상세가 표시됩니다</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


export default PropertyList
