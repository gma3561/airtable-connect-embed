# 프론트엔드 개발자 상세 업무 지시서 (MVP)

## 1. 목적
- 혼재 입력(텍스트/숫자)을 그대로 수용하는 매물 리스트/검색 중심의 MVP UI 구현
- Supabase RPC `search_properties` 직접 호출 연동, 빠른 응답/가시성/접근성을 갖춘 업무 도구 제공
- 이후 V2(권한/광고/정규화 주소/숫자 가격)로 무중단 확장 가능하도록 구조화

## 2. 범위 (In-Scope)
- 리스트 뷰(테이블) + 통합 검색(q) + 기본 필터(매물종류/거래유형/진행상태/담당자/공유여부)
- 페이지네이션(서버: limit/offset 기반)
- 상세 진입(간단 공개 정보 렌더) – 별도 페이지 또는 드로어 중 택1
- 로딩/빈/에러 상태 처리, 반응형 레이아웃

## 3. 기술 스택(권장)
- React 18 + TypeScript
- 스타일: Tailwind CSS 또는 CSS Modules (선호안: Tailwind)
- 상태/데이터: React Query(Query Key: 검색/필터 파라미터), 200ms 디바운스
- 라우팅: React Router (리스트/상세 분리 시)
- 빌드: Vite

참고: 현 저장소에는 정적 PWA 셸(`index.html`, `app.js`)이 존재. 새 React 앱은 `/web` 하위에 구성 권장.

## 4. 데이터 계약 (Supabase RPC)
- RPC: `search_properties(q, f_property_type, f_transaction_type, f_property_status, f_agent, f_shared_only, limit_count, offset_count)`
- 파라미터 매핑: `q` ↔ 검색어, `f_*` ↔ 필터, `limit_count` 기본 50, `offset_count` 기본 0
- 응답: 행 배열 → 프론트에서 `PropertyListItem`으로 매핑하여 `{ items }` 형태로 사용

## 5. 타입 정의(프론트 공용)
```ts
export interface PropertyListItem {
  id: string;
  registrationDate: string | null;
  sharedStatus: boolean | null;
  agent: string | null;
  propertyStatus: string | null;
  propertyType: string | null;
  transactionType: string | null;
  price: string | null;
  propertyName: string | null;
  buildingDong: string | null;
  buildingHo: string | null;
  address: string | null;
  updatedAt: string;
}

export interface SearchParams {
  q?: string;
  propertyType?: string;
  transactionType?: string;
  propertyStatus?: string;
  agent?: string;
  sharedOnly?: boolean;
  limit?: number; // default 50
  offset?: number; // default 0
}
```

## 6. 화면/컴포넌트 구조(제안)
- AppShell
  - Header: 프로젝트 타이틀, 검색창(q), 정렬 표시(업데이트순 고정)
  - Content: `PropertyListPage`
- PropertyListPage
  - FiltersPanel: 셀렉트(종류/유형/상태/담당자), 체크(공유여부)
  - ResultsTable: 컬럼(등록일/공유/담당자/상태/종류/유형/금액/매물명/동/호)
  - Pagination: Prev/Next, 현재 페이지/전체 추정
- PropertyDetail
  - 기본/위치/거래/상세/첨부(자리표시자), 배지(상태/유형/담당자)

컴포넌트 분해
- SearchInput (디바운스 200ms, onChange→URL 쿼리 동기화)
- Select/Checkbox(Field)
- Table, TableRow(클릭 시 상세)
- Badge(상태/유형/담당자), SkeletonRow, EmptyState, ErrorState
- Pager(limit/offset 관리)

## 7. 상태 관리/라우팅
- URL 쿼리스트링에 파라미터 반영: q, filters, limit, offset
- React Query: `['properties', params]` 키로 데이터 캐싱
- 디바운스: 200ms (입력 중 과도 호출 방지)

## 8. UX 요구사항
- 입력 즉시 미리보기: 디바운스 이후 페치
- Enter 시 즉시 검색
- 필터/페이지네이션 변화 시 스크롤 상단으로
- 로딩 스켈레톤(행 높이 고정), 빈 상태 메시지, 에러 메시지/재시도 버튼

## 9. 접근성
- 폼 컨트롤에 라벨/aria-속성, 포커스 링
- 테이블 헤더/셀 구조 준수, 키보드 탐색 가능
- 명도대비 AA 충족(텍스트/배지)

## 10. 성능 기준
- 첫 로드 TTI ≤ 2s(데스크톱 기준)
- 검색 응답 체감 ≤ 300ms(디바운스 포함)
- 번들 ≤ 150KB gz(초기)

## 11. 에러 처리/로깅
- API 4xx/5xx: 토스트 표시 + 재시도
- 네트워크 다운: 오프라인 배너
- 콘솔 로깅 최소화, 필요 시 Sentry 등 연계 여지 남김

## 12. 환경설정
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 필수. Supabase와 동일 리전 사용 권장.
- 개발 모드에서 CORS 고려(서버는 CORS 허용 이미 설정)

## 13. 테스트
- 유닛: 검색 파라미터 빌더, 디바운스 훅
- 컴포넌트: 필터/테이블/페이지네이션 스냅샷 + 상호작용
- E2E(선택): 리스트 검색 흐름(happy path)

## 14. 구현 순서(권장)
1) 프로젝트 스캐폴딩(`/web`): Vite + React + TS + Tailwind + React Query
2) 타입/유틸: `PropertyListItem`, `SearchParams`, 파라미터→쿼리 변환
3) 데이터 훅: `usePropertySearch(params)` – React Query 래핑
4) 레이아웃 + SearchInput + FiltersPanel + ResultsTable + Pagination
5) 상태 동기화(URL↔UI), 로딩/빈/에러 상태
6) 상세 뷰 진입(페이지 또는 드로어)
7) 반응형/접근성/성능 폴리싱

## 15. 체크리스트
- [ ] 검색 입력 200ms 디바운스
- [ ] URL 쿼리 동기화(q/filters/limit/offset)
- [x] 테이블 50행 페이지네이션
- [ ] 로딩/빈/에러 상태
- [ ] 반응형(모바일/데스크톱)
- [ ] 접근성 라벨/포커스/명도 대비
- [ ] 타입/TS 에러 0

## 16. 향후(V2) 대비
- 카카오 주소 컴포넌트 도입 자리 확보(모달/오버레이)
- 숫자 가격 입력(매매/전세/월세) 컴포넌트 설계(마스크/포맷)
- 권한 배지/광고 상태 필터 UI 확장 여지
