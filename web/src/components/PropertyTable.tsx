import type { PropertyListItem } from '../types'

interface PropertyTableProps {
  properties: PropertyListItem[]
  isLoading?: boolean
  searchQuery?: string
  onRowClick?: (id: string) => void
  selectedId?: string | null
}

const PropertyTable = ({ properties, isLoading, searchQuery, onRowClick, selectedId }: PropertyTableProps) => {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        {searchQuery ? (
          <div>
            <div className="text-muted-foreground text-lg mb-2">
              "{searchQuery}"에 대한 검색 결과가 없습니다.
            </div>
            <div className="text-muted-foreground/70 text-sm">
              다른 검색어를 시도해보세요.
            </div>
          </div>
        ) : (
          <div>
            <div className="text-muted-foreground text-lg mb-2">
              등록된 매물이 없습니다.
            </div>
            <div className="text-muted-foreground/70 text-sm">
              첫 번째 매물을 등록해보세요.
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border" aria-label="매물 목록" data-testid="property-table">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                공유
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                담당자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                종류
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                유형
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                매물명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">동/호</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                공급/전용(㎡)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                공급/전용(평)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                해당층/총층
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {properties.map((property) => {
              const isSelected = selectedId === property.id
              return (
              <tr
                key={property.id}
                className={`hover:bg-accent cursor-pointer transition-colors aria-selected:bg-primary/10 ${isSelected ? 'bg-primary/10' : ''}`}
                aria-selected={isSelected}
                onClick={() => onRowClick ? onRowClick(property.id) : undefined}
                data-testid="property-row"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {property.registrationDate || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {property.sharedStatus === null ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground">-</span>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      property.sharedStatus ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                    }`}>
                      {property.sharedStatus ? '공유' : '비공유'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {property.agent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    property.propertyStatus === '거래가능' ? 'bg-emerald-50 text-emerald-700' :
                    property.propertyStatus === '거래완료' ? 'bg-sky-50 text-sky-700' :
                    property.propertyStatus === '계약완료' ? 'bg-sky-50 text-sky-700' :
                    property.propertyStatus === '매물확인됨' ? 'bg-blue-50 text-blue-700' :
                    property.propertyStatus === '보류' ? 'bg-green-50 text-green-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {property.propertyStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {property.propertyType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {property.transactionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground tabular-nums">
                  {property.price}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  <span className="text-primary hover:text-primary/80 font-medium hover:underline">
                    {property.propertyName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {property.buildingDong && property.buildingHo 
                    ? `${property.buildingDong} ${property.buildingHo}` 
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground">
                  {property.areaSupplySqm || property.areaExclusiveSqm
                    ? `${property.areaSupplySqm ?? '-'}㎡/${property.areaExclusiveSqm ?? '-'}㎡`
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground">
                  {property.areaSupplyPy || property.areaExclusivePy
                    ? `${property.areaSupplyPy ?? '-'}평/${property.areaExclusivePy ?? '-'}평`
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground">
                  {property.floor || property.floorsTotal
                    ? `${property.floor ?? '-'}/${property.floorsTotal ?? '-'}층`
                    : '-'}
                </td>
              </tr>
              )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TableSkeleton = () => {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 12 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
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
