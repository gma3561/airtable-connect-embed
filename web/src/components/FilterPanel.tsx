import { SearchFilters } from '../types/Property'

interface FilterPanelProps {
  filters: SearchFilters
  onFilterChange: (filters: SearchFilters) => void
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFilterChange({
      propertyType: '',
      transactionType: '',
      propertyStatus: '',
      agent: '',
      sharedOnly: false
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  )

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">필터</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            초기화
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 매물 종류 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            매물 종류
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체</option>
            <option value="아파트">아파트</option>
            <option value="빌라">빌라</option>
            <option value="원룸">원룸</option>
            <option value="상가">상가</option>
            <option value="사무실">사무실</option>
            <option value="토지">토지</option>
          </select>
        </div>

        {/* 거래 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            거래 유형
          </label>
          <select
            value={filters.transactionType}
            onChange={(e) => handleFilterChange('transactionType', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체</option>
            <option value="매매">매매</option>
            <option value="전세">전세</option>
            <option value="월세">월세</option>
            <option value="반전세">반전세</option>
          </select>
        </div>

        {/* 진행 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            진행 상태
          </label>
          <select
            value={filters.propertyStatus}
            onChange={(e) => handleFilterChange('propertyStatus', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체</option>
            <option value="거래가능">거래가능</option>
            <option value="계약중">계약중</option>
            <option value="계약완료">계약완료</option>
            <option value="예약중">예약중</option>
          </select>
        </div>

        {/* 담당자 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            담당자
          </label>
          <select
            value={filters.agent}
            onChange={(e) => handleFilterChange('agent', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체</option>
            <option value="김부동">김부동</option>
            <option value="박부동">박부동</option>
            <option value="이부동">이부동</option>
          </select>
        </div>

        {/* 공유 여부 */}
        <div className="flex items-center">
          <input
            id="sharedOnly"
            type="checkbox"
            checked={filters.sharedOnly}
            onChange={(e) => handleFilterChange('sharedOnly', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sharedOnly" className="ml-2 block text-sm text-gray-900">
            공유 매물만
          </label>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
