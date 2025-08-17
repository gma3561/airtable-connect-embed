# PRD: 부동산 인벤토리 리스트뷰 + 상세 패널 + 입력폼 (개발 지향)

본 PRD는 웹 애플리케이션의 리스트/상세/입력 기능을 개발 관점에서 구체화한다. 시각 디자인(색/폰트/여백)은 범위에서 제외하며, 동작/데이터/상태/검증/라우팅/수용 기준에 집중한다.

## 0) 배경/문제
- 팀은 고밀도 리스트에서 빠르게 매물을 탐색하고, 상세 정보를 확인/수정/기록해야 한다.
- 현재 요구: 디자인 요소를 배제한 작동 스펙, URL/데이터 규칙, 검증/상태, 테스트 기준을 명확히 문서화.

## 1) 목표/비목표
- 목표
  - 리스트와 상세 패널의 즉시 연동(행 선택 → 상세 오픈 ≤300ms)
  - 필터/정렬/검색의 URL 동기화 및 되돌아가기 복원
  - 신규/수정 입력폼의 필드/검증/저장 계약 명확화
  - 접근성/키보드 내비 보장(테이블/패널/폼)
- 비목표
  - 비주얼 디자인(색/폰트/여백), 애니메이션 디테일
  - 권한/결제/감사 로깅의 세부 운영정책(추후 문서화)

## 2) 범위/페이지/라우팅
- 경로 및 역할
  - `/#/` → 기본 리스트(간이) 또는 `PropertyList`
  - `/#/inventory` → 인벤토리(리스트 + 상세 패널 조합)
  - `/#/property/new` → 신규 입력폼(`PropertyForm.tsx`)
  - `/#/property/:id` → 상세 뷰(`PropertyDetail.tsx`)
  - `/#/property/:id/edit` → 수정 폼(`PropertyEdit.tsx`)
- URL 쿼리(Inventory)
  - `propertyType`, `transactionType`, `propertyStatus` (콤마 구분 다중)
  - `q`(검색), `sort`(기본 created_at), `dir`(asc|desc, 기본 desc)
  - `page`, `pageSize`(기본 50), `id`(선택 행), `unknown`(비정형 포함 정책)

## 3) 상단 헤더(Inventory) 기능 요구
- 요소: 페이지 타이틀, `Select(매물종류)`, `Select(거래유형)`, `Select(상태)`, `Filter` 버튼, `Sort` 버튼, `Search 입력`
- 동작
  - Select 변경 → 내부 상태 갱신 → `Filter` 클릭 또는 300ms 디바운스 정책으로 조회(팀 정책 택1)
  - Sort 버튼 또는 헤더 클릭으로 정렬 변경 → URL `sort,dir` 반영
  - Search 입력 300ms 디바운스 → URL `q` 반영

## 4) 리스트(테이블) 요구
- 데이터 타입: `web/src/types/index.ts`의 `PropertyListItem`
- 기본 컬럼(좌→우 권장):
  1) 등록일 `registrationDate`(정렬 기본키)
  2) 공유여부 `sharedStatus`
  3) 담당자 `agent`
  4) 매물상태 `propertyStatus`
  5) 매물종류 `propertyType`
  6) 거래유형 `transactionType`
  7) 금액 `price`(문자열; 정렬은 서버/키 파생값 사용 권장)
  8) 매물명 `propertyName`
  9) 동/호 `buildingDong` / `buildingHo`
  10) 면적(㎡) `areaSupplySqm/areaExclusiveSqm`
  11) 면적(평) `areaSupplyPy/areaExclusivePy`
  12) 층/총층 `floor/floorsTotal`
- 상호작용
  - 행 클릭 → URL `id` 세팅 → 우측 상세 패널 오픈
  - 키보드: ↑/↓ 행 이동, Enter 상세 오픈, Esc 패널 닫기
  - 스크롤 위치 유지(패널 열고 닫아도 변하지 않음)
- 상태
  - 로딩: 스켈레톤/자리표시 텍스트
  - 빈: 안내 + 필터 초기화
  - 오류: 메시지 + 재시도

## 5) 상세 패널 요구
- 열림 조건: 행 클릭 또는 URL `id` 존재
- 데이터: `web/src/services/supabaseApi.ts`의 `fetchPropertyById`
- 섹션/필드(라벨:키)
  - 기본: 공유여부: `sharedStatus`, 담당자: `agent`, 상태: `propertyStatus`, 재등록사유: `reregistrationReason`
  - 매물: 매물종류: `propertyType`, 매물명: `propertyName`, 동/호: `buildingDong/buildingHo`
  - 위치: `address`
  - 거래: 유형 `transactionType`, 계약기간 `contractPeriod`, 임차금액 `rentalAmount`, 임차유형 `rentalType`
  - 기타: `ad_status`(미정), 공동연락처/중개(미정), 사진/영상 `photos/videos`, 거주자 `resident`, 거래완료일 `completionDate`
  - 메모: 담당자메모 `agentMemo`, 특이사항 `specialNotes`
- 액션: 수정 이동(`/property/:id/edit`), 상태 변경(추가 시 `PATCH /status`), 닫기
- 검증: `propertyStatus='거래완료'` 시 `completionDate` 필수(정책 적용 시)

## 6) 입력폼(신규/수정) 요구
- 컴포넌트
  - 신규: `web/src/components/PropertyForm.tsx`
  - 수정: `web/src/components/PropertyEdit.tsx`
- 필드/타입: `web/src/types/index.ts`의 `PropertyCreateRequest`
  - 필수: `propertyName`
  - 선택: `address`, `buildingDong`, `buildingHo`, `agent`, `propertyType`, `transactionType`, `propertyStatus`, `price`, `contractPeriod`, `rentalAmount`, `rentalType`, `resident`, `completionDate`, `reregistrationReason`, `agentMemo`, `specialNotes`, `registrationDate`, `sharedStatus`
- 검증(초안)
  - `propertyName` required, 2–40자
  - `buildingDong/Ho` 숫자/문자 허용, 1–5자
  - `completionDate`는 상태가 완료일 때 required
  - 금액/면적은 현재 문자열 유지(차후 구조화 시 파싱 검증 추가)
- 동작
  - 저장: 신규 → `createProperty`, 수정 → `updateProperty`
  - 성공 시: 목록 또는 상세로 이동. 실패 시 메시지 표시
  - 삭제(수정 폼): `deleteProperty` + 목록 이동

## 7) 데이터/서비스 계약
- 서비스 모듈: `web/src/services/supabaseApi.ts`
  - `fetchProperties(params: SearchParams): Promise<PropertyListResponse>`
    - 로컬 미설정 시 목데이터 제공(프리뷰)
  - `fetchPropertyById(id: string): Promise<PropertyDetail>`
    - 로컬 미설정 시 단건 목데이터 제공
  - `createProperty(body: PropertyCreateRequest): Promise<{id:string}>`
  - `updateProperty(id: string, body: PropertyCreateRequest): Promise<void>`
  - `deleteProperty(id: string): Promise<void>`
- 타입: `web/src/types/index.ts`
- 주의: 서버는 `snake_case`, 프런트는 `camelCase` 매핑 유지

## 8) 상태/캐시/성능
- React Query 캐시 키(목록): `["properties", params]`
- 상세 캐시: `["property", id]` 5분 소프트 캐시, 인접 행 프리페치(옵션)
- 검색 디바운스: 300ms, 중복요청 취소
- 가상 스크롤: 2,000행 이상 도입 검토, 기본은 페이지 50

## 9) 접근성/키보드
- 테이블/행/셀 ARIA 롤 명시, 포커스 인디케이터 표시
- 키보드: ↑/↓, Enter, Esc, Tab 순서 준수
- 폼 라벨-입력 연결(`for/id`), 에러 `aria-describedby`

## 10) 오류/오프라인/경계 케이스
- 네트워크 오류: 사용자 메시지 + 재시도, 오프라인 시 읽기 전용 안내
- 금액미정/면적미정/층 미정: `null`/`'-'` 일관 처리, 정렬 시 최하단(금액)
- 삭제 시 확인 모달, 진행 중 중복 요청 방지

## 11) 수용 기준(샘플)
- 리스트 필터/정렬/검색 변경 후 1초 내 데이터 새로고침(검색은 300ms 디바운스)
- 행 클릭 후 300ms 내 상세 패널 첫 페인트, 1초 내 서버 응답 반영
- 뒤로가기 시 직전 필터/선택 상태 복원(URL 기준)
- `propertyName` 미입력 시 저장 불가, 메시지 표기
- 완료 상태 전환 시 완료일 미입력은 저장 실패(정책 적용 시)

## 12) 테스트 시나리오(요약)
1) 필터/정렬/검색 조합 상태에서 행 선택 → 상세 내용이 리스트와 일치
2) 뒤로가기 → 이전 필터/선택/페이지 복원
3) 신규 저장 → 목록에 신규 항목 노출, 수정 저장 → 상세/목록 모두 갱신
4) 삭제 → 목록에서 제거, 뒤로가기 시 재등장하지 않음
5) 네트워크 오류 → 재시도 동작 및 메시지 표기

## 13) 일정/작업 분해(개발)
- FE
  - [ ] `InventoryPage` 라우트 생성(또는 기존 `PropertyList` 확장), URL 동기화
  - [ ] 테이블 컬럼 정의/정렬/선택/키보드 내비
  - [ ] 상세 패널(데이터 바인딩, 닫기/이동/편집 버튼)
  - [ ] 폼(신규/수정) 검증 강화 및 타입 매핑 점검
  - [ ] React Query 캐시/프리페치, 에러/로딩/빈 상태
  - [ ] E2E: 필터/정렬/검색/선택/저장/삭제/뒤로가기
- BE(또는 Supabase 정책)
  - [ ] 목록 RPC/뷰 정렬 키 확정, `price_sort`/비정형 정책
  - [ ] 상세 DTO 매핑 통일(camel↔snake)

## 14) 리스크/의존성/오픈 이슈
- 금액/면적 등 문자열 포맷의 정렬/검색 불안정 → 파싱/정규화 필요(후속)
- 상태 전환 정책(완료일 필수 등) 합의 필요
- 권한/RBAC/감사 로그 범위 별도 문서화 필요

부록 A) 현재 코드 기준 맵핑
- 리스트: `web/src/components/PropertyList.tsx`
- 상세: `web/src/components/PropertyDetail.tsx`
- 폼(신규/수정): `PropertyForm.tsx`, `PropertyEdit.tsx`
- 서비스: `web/src/services/supabaseApi.ts`
- 타입: `web/src/types/index.ts`
