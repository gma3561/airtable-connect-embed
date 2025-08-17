# 컴포넌트 인터페이스 및 데이터 흐름 문서

## 📊 데이터 흐름 개요

```
User Input → React Components → Custom Hooks → API Services → Backend → Database
                     ↓                ↓              ↓
                URL Sync      React Query      Supabase Client
```

## 🧩 주요 컴포넌트 인터페이스

### 1. PropertyTable

**목적**: 매물 목록을 테이블 형태로 표시

**Props Interface**:
```typescript
interface PropertyTableProps {
  properties: PropertyListItem[]    // 매물 목록 데이터
  isLoading?: boolean              // 로딩 상태
  searchQuery?: string             // 현재 검색어
  onRowClick?: (id: string) => void // 행 클릭 핸들러
}
```

**Data Flow**:
```
PropertyList (parent)
    ↓ properties, isLoading, searchQuery
PropertyTable
    ↓ onRowClick
Router → PropertyDetail
```

### 2. PropertyForm

**목적**: 새 매물 등록 폼

**State Management**:
```typescript
interface PropertyFormState {
  formData: PropertyCreateRequest
  errors: Record<string, string>
  isSubmitting: boolean
}
```

**Event Handlers**:
- `handleSubmit`: 폼 제출 및 유효성 검사
- `handleReset`: 폼 초기화
- `handleFieldChange`: 개별 필드 변경

**Data Flow**:
```
User Input → Form State → Validation → API Call → Success/Error Handling
                              ↓
                        Error Display
```

### 3. FiltersPanel

**목적**: 검색 및 필터링 UI

**Props Interface**:
```typescript
interface FiltersPanelProps {
  filters: {
    propertyType?: string
    transactionType?: string
    propertyStatus?: string
    agent?: string
    sharedOnly?: boolean
  }
  onFilterChange: (filters: Filters) => void
  filterOptions: {
    propertyTypes: string[]
    transactionTypes: string[]
    propertyStatuses: string[]
    agents: string[]
  }
}
```

**Data Flow**:
```
User Selection → onFilterChange → Parent Component → URL Update → API Call
                                          ↓
                                    React Query Cache
```

### 4. PropertyDetail

**목적**: 매물 상세 정보 표시

**Props Interface**:
```typescript
interface PropertyDetailProps {
  propertyId: string  // URL parameter
}
```

**Internal State**:
- `property`: 매물 상세 데이터
- `isLoading`: 로딩 상태
- `error`: 에러 상태

**Data Flow**:
```
URL Parameter → usePropertyDetail Hook → API Call → Display/Error
                        ↓
                React Query Cache
```

### 5. SearchBar

**목적**: 실시간 검색 입력

**Props Interface**:
```typescript
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceDelay?: number  // 기본값: 300ms
}
```

**Data Flow**:
```
User Input → Debounce → onChange → Parent Update → API Call
                ↓
          Immediate UI Update
```

## 🔗 Custom Hooks

### 1. usePropertySearch

**목적**: 매물 검색 및 필터링 로직 관리

**Interface**:
```typescript
function usePropertySearch(initialParams?: SearchParams) {
  return {
    properties: PropertyListItem[]
    isLoading: boolean
    error: Error | null
    searchParams: SearchParams
    updateSearchParams: (params: Partial<SearchParams>) => void
    refetch: () => void
  }
}
```

**내부 동작**:
1. URL 쿼리 파라미터 읽기
2. React Query로 API 호출
3. 결과 캐싱 및 반환
4. URL 동기화

### 2. usePropertyDetail

**목적**: 개별 매물 상세 정보 관리

**Interface**:
```typescript
function usePropertyDetail(propertyId: string) {
  return {
    property: PropertyDetail | null
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}
```

### 3. useDebounce

**목적**: 입력값 디바운싱

**Interface**:
```typescript
function useDebounce<T>(value: T, delay: number = 300): T
```

**사용 예시**:
```typescript
const debouncedSearchTerm = useDebounce(searchTerm, 500)
```

## 📡 API Service Layer

### supabaseApi.ts

**주요 함수**:

```typescript
// 매물 목록 조회
async function fetchProperties(params: SearchParams): Promise<PropertyListResponse>

// 매물 상세 조회
async function fetchPropertyDetail(id: string): Promise<PropertyDetail>

// 매물 생성
async function createProperty(data: PropertyCreateRequest): Promise<{ id: string }>

// 매물 수정
async function updateProperty(id: string, data: Partial<PropertyCreateRequest>): Promise<void>

// 매물 삭제
async function deleteProperty(id: string): Promise<void>
```

## 🔄 상태 관리 패턴

### 1. URL 상태 동기화

```typescript
// URL → State
const searchParams = new URLSearchParams(location.search)
const filters = {
  q: searchParams.get('q') || '',
  propertyType: searchParams.get('propertyType') || '',
  // ...
}

// State → URL
const updateURL = (params: SearchParams) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })
  navigate(`?${searchParams.toString()}`)
}
```

### 2. React Query 캐싱 전략

```typescript
// 캐시 키 구조
const queryKey = ['properties', searchParams]

// 캐시 설정
{
  staleTime: 5 * 60 * 1000,      // 5분
  cacheTime: 10 * 60 * 1000,     // 10분
  refetchOnWindowFocus: false,
  retry: 3,
}
```

### 3. 에러 처리 패턴

```typescript
try {
  const result = await apiCall()
  // 성공 처리
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    // 로그인 페이지로 리다이렉트
  } else if (error.code === 'VALIDATION_ERROR') {
    // 폼 에러 표시
  } else {
    // 일반 에러 처리
  }
}
```

## 🎨 UI 상태 패턴

### 로딩 상태
```typescript
if (isLoading) {
  return <LoadingState />
}
```

### 에러 상태
```typescript
if (error) {
  return <ErrorState error={error} onRetry={refetch} />
}
```

### 빈 상태
```typescript
if (data.length === 0) {
  return <EmptyState message="검색 결과가 없습니다" />
}
```

## 📱 반응형 데이터 처리

### 모바일 최적화
- 테이블 → 카드 레이아웃 전환
- 필수 정보만 표시
- 스와이프 제스처 지원

### 데이터 페이징
```typescript
const PAGE_SIZE = 50
const offset = (page - 1) * PAGE_SIZE

// 무한 스크롤 지원
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(...)
```

## 🔒 권한 기반 UI 렌더링

```typescript
// 권한 체크
const canEdit = user.role === 'admin' || property.agent === user.name
const canDelete = user.role === 'admin'

// 조건부 렌더링
{canEdit && <EditButton />}
{canDelete && <DeleteButton />}
```

## 🚀 성능 최적화

### 1. 메모이제이션
```typescript
const memoizedProperties = useMemo(
  () => properties.filter(p => p.propertyType === filter),
  [properties, filter]
)
```

### 2. 가상 스크롤
```typescript
// 대량 데이터 처리
import { VirtualList } from '@tanstack/react-virtual'
```

### 3. 이미지 최적화
```typescript
// 지연 로딩
<img loading="lazy" src={imageUrl} />

// 반응형 이미지
<picture>
  <source media="(max-width: 768px)" srcSet={mobileImage} />
  <img src={desktopImage} />
</picture>
```

## 📊 데이터 변환 레이어

### API Response → UI Model
```typescript
function transformPropertyResponse(data: APIResponse): PropertyListItem {
  return {
    id: data.id,
    propertyName: data.property_name,
    registrationDate: formatDate(data.registration_date),
    // ... 필드 매핑
  }
}
```

### Form Data → API Request
```typescript
function preparePropertyRequest(formData: FormData): APIRequest {
  return {
    property_name: formData.propertyName,
    registration_date: formData.registrationDate,
    // ... 필드 변환
  }
}
```

---

*이 문서는 컴포넌트 간의 데이터 흐름과 인터페이스를 정의합니다. 개발 진행에 따라 업데이트될 수 있습니다.*