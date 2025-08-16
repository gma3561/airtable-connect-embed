import { Link } from 'react-router-dom'
import type { PropertyListItem } from '../types'
import Badge from './Badge'

interface PropertyTableProps {
  properties: PropertyListItem[]
  isLoading?: boolean
  searchQuery?: string
}

const PropertyTable = ({ properties, isLoading, searchQuery }: PropertyTableProps) => {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        {searchQuery ? (
          <div>
            <div className="text-gray-500 text-lg mb-2">
              "{searchQuery}"에 대한 검색 결과가 없습니다.
            </div>
            <div className="text-gray-400 text-sm">
              다른 검색어를 시도해보세요.
            </div>
          </div>
        ) : (
          <div>
            <div className="text-gray-500 text-lg mb-2">
              등록된 매물이 없습니다.
            </div>
            <div className="text-gray-400 text-sm">
              첫 번째 매물을 등록해보세요.
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                공유
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                종류
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                매물명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                동/호
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.registrationDate ? new Date(property.registrationDate).toLocaleDateString('ko-KR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    property.sharedStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.sharedStatus ? '공유' : '비공유'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.agent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    property.propertyStatus === '거래가능' ? 'bg-blue-100 text-blue-800' :
                    property.propertyStatus === '계약중' ? 'bg-yellow-100 text-yellow-800' :
                    property.propertyStatus === '계약완료' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.propertyStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.propertyType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.transactionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Link 
                    to={`/property/${property.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    {property.propertyName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.buildingDong && property.buildingHo 
                    ? `${property.buildingDong} ${property.buildingHo}` 
                    : '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TableSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PropertyTable
