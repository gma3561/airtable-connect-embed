# 부동산 매물 관리 시스템 아키텍처 설계서

## 📋 개요

**시스템명**: Airtable Connect Embed - 부동산 매물 관리 시스템  
**버전**: 1.0.0  
**작성일**: 2025-08-16  
**목적**: 부동산 매물의 체계적 관리, 검색, 광고 관리를 위한 웹 기반 시스템

## 🏗️ 시스템 아키텍처

### 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)             │
│  ┌─────────────────┬──────────────────┬─────────────────┐  │
│  │   Components    │   State Management │    Services     │  │
│  │  - PropertyTable│  - React Query     │ - supabaseApi   │  │
│  │  - PropertyForm │  - URL Sync        │ - Auth Service  │  │
│  │  - FiltersPanel │  - Custom Hooks    │                 │  │
│  └─────────────────┴──────────────────┴─────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────┴──────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌─────────────────┬──────────────────┬─────────────────┐  │
│  │   Controllers   │     Services      │  Repositories   │  │
│  │ - PropertyCtrl  │ - PropertyService │ - SupabaseRepo  │  │
│  │ - AuthCtrl      │ - AuthService     │                 │  │
│  └─────────────────┴──────────────────┴─────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ PostgreSQL Protocol
┌──────────────────────────┴──────────────────────────────────┐
│                Database (Supabase PostgreSQL)                │
│  ┌─────────────────┬──────────────────┬─────────────────┐  │
│  │    Tables       │  Row Level Security│    Indexes      │  │
│  │ - properties    │  - User policies   │ - Search idx    │  │
│  │ - users         │  - Role policies   │ - Performance   │  │
│  │ - advertisements│  - Data policies   │                 │  │
│  └─────────────────┴──────────────────┴─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 기술 스택

#### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Form Management**: Native React (controlled components)
- **Build Tool**: Vite
- **Testing**: Playwright

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **ORM**: Supabase Client

#### Infrastructure
- **Hosting**: Vercel (Frontend) + Supabase (Backend)
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions

## 🗄️ 데이터베이스 설계

### 주요 테이블 구조

#### 1. properties (매물 정보)
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 기본 정보
  property_name TEXT NOT NULL,
  property_type TEXT,
  transaction_type TEXT,
  property_status TEXT,
  
  -- 위치 정보
  address TEXT,
  building_dong TEXT,
  building_ho TEXT,
  
  -- 가격 정보
  price TEXT,
  rental_amount TEXT,
  rental_type TEXT,
  
  -- 면적 정보
  area_supply_sqm TEXT,
  area_exclusive_sqm TEXT,
  area_supply_py TEXT,
  area_exclusive_py TEXT,
  
  -- 기타 정보
  floor TEXT,
  floors_total TEXT,
  agent TEXT,
  shared_status BOOLEAN,
  registration_date DATE,
  
  -- 메타데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. users (사용자 정보)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('admin', 'marketing', 'backoffice', 'agent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. advertisements (광고 정보)
```sql
CREATE TABLE advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  ad_number TEXT NOT NULL,
  ad_status TEXT,
  ad_platform TEXT,
  backoffice_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 인덱스 전략
- 검색 최적화: property_name, address, building_dong
- 필터링 최적화: property_type, transaction_type, property_status
- 조인 최적화: property_id, user_id

## 🔧 주요 컴포넌트 설계

### Frontend 컴포넌트

#### 1. PropertyTable
- **목적**: 매물 목록을 테이블 형태로 표시
- **주요 기능**:
  - 반응형 테이블 레이아웃
  - 정렬 가능한 컬럼
  - 클릭 가능한 행 (상세 보기)
  - 로딩 스켈레톤
  - 빈 상태 처리

#### 2. PropertyForm
- **목적**: 새 매물 등록
- **주요 기능**:
  - 16개 섹션의 입력 폼
  - 실시간 유효성 검사
  - 드롭다운/체크박스/텍스트 입력
  - 폼 초기화 및 제출

#### 3. FiltersPanel
- **목적**: 매물 검색 및 필터링
- **주요 기능**:
  - 실시간 검색 (동, 매물명)
  - 다중 필터 (종류, 유형, 상태, 담당자)
  - URL 동기화
  - 필터 초기화

#### 4. PropertyDetail
- **목적**: 매물 상세 정보 표시
- **주요 기능**:
  - 전체 정보 표시
  - 권한별 정보 표시
  - 수정/삭제 기능
  - 사진/영상 표시

### Backend 아키텍처

#### 계층 구조
```
Server Layer
├── HTTP Controllers (요청/응답 처리)
├── Service Layer (비즈니스 로직)
├── Repository Layer (데이터 접근)
└── Infrastructure Layer (외부 서비스)
```

#### Domain Models
- Property: 매물 도메인 모델
- User: 사용자 도메인 모델
- SearchQuery: 검색 쿼리 모델

## 🔒 보안 설계

### 인증 및 권한

#### 역할 기반 접근 제어 (RBAC)
```
Admin (관리자)
├── 모든 데이터 읽기/쓰기
├── 사용자 관리
└── 시스템 설정

Marketing (마케팅)
├── 매물 등록/수정
├── 광고 현황 조회
└── 마케팅 자료 접근

BackOffice (백오피스)
├── 광고 등록/관리
├── 광고 번호 입력
└── 광고 통계 조회

Agent (일반 담당자)
├── 담당 매물 관리
├── 매물 등록
└── 기본 정보 조회
```

### Row Level Security (RLS)
- properties: 공개 읽기, 담당자별 수정
- property_owners: 관리자 전용
- advertisements: 백오피스/관리자 관리

## 🚀 API 설계

### RESTful 엔드포인트

#### Properties
```
GET    /api/properties          # 매물 목록 조회
GET    /api/properties/:id      # 매물 상세 조회
POST   /api/properties          # 매물 등록
PUT    /api/properties/:id      # 매물 수정
DELETE /api/properties/:id      # 매물 삭제
```

#### Search
```
GET    /api/search              # 통합 검색
GET    /api/search/filters      # 필터 옵션 조회
```

#### Users
```
POST   /api/auth/login          # 로그인
POST   /api/auth/logout         # 로그아웃
GET    /api/users/me            # 현재 사용자 정보
```

### 요청/응답 형식

#### 목록 조회 응답
```typescript
interface PropertyListResponse {
  items: PropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
}
```

#### 에러 응답
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## 📊 성능 최적화

### Frontend 최적화
- 코드 스플리팅 (라우트 기반)
- 이미지 지연 로딩
- React Query 캐싱
- 가상 스크롤 (대량 데이터)

### Backend 최적화
- 데이터베이스 인덱싱
- 쿼리 최적화
- 연결 풀링
- 응답 압축

### 캐싱 전략
- 브라우저 캐싱: 정적 자산
- API 캐싱: React Query (5분)
- 데이터베이스 캐싱: 자주 사용되는 필터 옵션

## 🔄 데이터 흐름

### 매물 조회 플로우
```
User → PropertyList → usePropertySearch → supabaseApi → Backend API → Database
                           ↓
                    URL Sync (query params)
```

### 매물 등록 플로우
```
User → PropertyForm → Form Validation → supabaseApi → Backend API → Database
                            ↓
                    Success: Navigate to list
                    Error: Show error message
```

## 📱 반응형 설계

### 브레이크포인트
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 반응형 전략
- 모바일: 카드 레이아웃
- 태블릿: 압축된 테이블
- 데스크톱: 전체 테이블

## 🚦 모니터링 및 로깅

### 에러 추적
- Frontend: Console errors → Logging service
- Backend: Winston logger → Log aggregation

### 성능 모니터링
- Core Web Vitals
- API 응답 시간
- 데이터베이스 쿼리 성능

## 🔮 향후 확장 계획

### Phase 2 기능
- 실시간 알림 시스템
- 고급 분석 대시보드
- 모바일 앱 개발
- AI 기반 매물 추천

### 기술적 개선
- GraphQL 도입 검토
- 마이크로서비스 전환
- 실시간 동기화 (WebSocket)
- 고급 캐싱 (Redis)

## 📚 참고 문서

- [React 공식 문서](https://react.dev)
- [Supabase 문서](https://supabase.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

*이 문서는 부동산 매물 관리 시스템의 기술적 설계를 담고 있으며, 개발 진행에 따라 업데이트될 수 있습니다.*