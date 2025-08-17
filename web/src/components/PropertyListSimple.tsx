import { useState } from 'react'
import { usePropertySearch } from '../hooks/usePropertySearch'
import type { SearchParams, PropertyListItem } from '../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import PropertyDetail from './PropertyDetail'
import LoadingState from './LoadingState'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

const DEFAULT_LIMIT = 50;

const PropertyListSimple = () => {
  const [params, setParams] = useState<SearchParams>({
    limit: DEFAULT_LIMIT,
    offset: 0
  });
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  
  const { data, isLoading, error } = usePropertySearch(params)
  
  const handleSearch = () => {
    setParams({
      ...params,
      q: searchQuery,
      offset: 0
    })
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  const handleNextPage = () => {
    setParams({
      ...params,
      offset: (params.offset || 0) + DEFAULT_LIMIT
    })
  }
  
  const handlePrevPage = () => {
    setParams({
      ...params,
      offset: Math.max(0, (params.offset || 0) - DEFAULT_LIMIT)
    })
  }
  
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState />
  if (!data) return null
  
  const properties = data.items || []
  const currentPage = Math.floor((params.offset || 0) / DEFAULT_LIMIT) + 1
  
  return (
    <div className="p-6 space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>매물 검색</CardTitle>
          <CardDescription>매물명, 주소, 담당자 등으로 검색하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>매물 목록</CardTitle>
              <CardDescription>총 {properties.length}개의 매물</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!params.offset || params.offset === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                페이지 {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={properties.length < DEFAULT_LIMIT}
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {properties.map((property: PropertyListItem) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setSelectedPropertyId(property.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{property.propertyName || '매물명 없음'}</p>
                      <Badge variant={property.sharedStatus ? 'default' : 'secondary'}>
                        {property.sharedStatus ? '공유' : '비공유'}
                      </Badge>
                      <Badge 
                        variant={property.propertyStatus === '거래가능' ? 'default' : 'secondary'}
                      >
                        {property.propertyStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.propertyType}</span>
                      <span>{property.transactionType}</span>
                      <span className="font-medium">{property.price}</span>
                      <span>{property.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>담당자: {property.agent}</span>
                      <span>등록일: {property.registrationDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Detail Modal */}
      {selectedPropertyId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">매물 상세 정보</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPropertyId(null)}
              >
                닫기
              </Button>
            </div>
            <div className="p-4">
              <PropertyDetail id={selectedPropertyId} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyListSimple