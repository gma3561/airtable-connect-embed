# 리스트뷰 + 상세 패널 기능 기획서 (개발 지향, 비주얼 제외)

문서 목적: 본 문서는 부동산 매물 인벤토리 화면의 동작·흐름·데이터·상태·URL 규칙을 정의하여, 프런트/백엔드/QA가 동일한 기준으로 구현·검증할 수 있도록 한다. 시각 디자인(색/폰트/여백)은 범위에서 제외한다.

## 1. 범위 및 역할
- 범위: 리스트(목록) + 상세(사이드 패널) 한 화면 내 동작, 필터/정렬/검색, 선택/상세 연동, 저장/상태 전환, 빈/로딩/오류/오프라인 상태, 접근성/키보드, URL 동기화, API 계약, 테스트 기준
- 사용자 역할(가정):
  - Admin: 전체 읽기/쓰기/상태 전환/민감정보 열람
  - Agent: 읽기/쓰기(자신 담당 레코드 위주), 제한적 PII
  - Viewer: 읽기 전용, PII 마스킹

## 2. 라우팅/URL 규칙
- 경로: `/#/inventory` (리스트/상세 복합 화면)
- URL 쿼리 파라미터(모두 선택 사항):
  - `propertyType`: 쉼표 구분 Enum 목록. 예: `apartment,villa`
  - `dealType`: 쉼표 구분 Enum 목록. 예: `sale,jeonse,wolse,rent`
  - `status`: 쉼표 구분 Enum 목록. 예: `available,on_hold,closed`
  - `q`: 문자열 검색(제목/주소/담당자/메모 등)
  - `sort`: 정렬 키(기본: `created_at`)
  - `dir`: `asc|desc` (기본: `desc`)
  - `page`: 1 이상의 정수(가상 스크롤 사용 시 생략 가능)
  - `pageSize`: 10–200 범위(기본 50)
  - `id`: 선택된 행의 `property.id`(존재 시 우측 상세 자동 오픈)
  - `unknown`: 비정형 값 포함 여부. 예: `unknown=include|exclude` (기본 include)

예시: `/inventory?propertyType=apartment,villa&dealType=rent,jeonse&status=available&sort=created_at&dir=desc&q=자양&page=1&pageSize=50&id=prop_123`

## 3. 페이지 구성(구조/역할)
- 상단 헤더 영역
  - 제목: 페이지 타이틀(예: 매물 인벤토리)
  - 컨트롤 그룹: `매물종류 Select`, `거래유형 Select`, `매물상태 Select`, `Filter 버튼`, `Sort 버튼`, `Search 입력`
  - 동작:
    - Select 변경 시 내부 상태만 갱신, `Filter` 버튼 클릭 시 질의 실행(또는 디바운스 자동 실행 모드 둘 다 지원 가능, 프로젝트 정책에 따름)
    - `Sort` 버튼 또는 테이블 헤더 클릭으로 정렬 변경
    - `Search` 입력은 300ms 디바운스 후 질의

- 본문 레이아웃
  - 좌측: 리스트(테이블) 영역
  - 우측: 상세 패널(행 선택 시 열림, 닫기 시 숨김)
  - 반응형: 폭이 협소하면 상세를 오버레이 드로어로 전환(모달 아님, 뒤로가기로 닫힘)

## 4. 리스트(테이블) 사양
- 데이터 단위: `PropertyRow`
- 컬럼(키/타입/설명)
  1) `created_at` (Date, ISO8601) — 등록일. 기본 정렬 키(내림차순)
  2) `shared` (Boolean) — 공유 여부(표시만). 검색/필터 비대상
  3) `owner_name` (String) — 담당자명. 정렬/검색 대상
  4) `status` (Enum) — `available|closed|withdrawn|on_hold|unknown`
  5) `category` (Enum) — `apartment|villa|officetel|house|etc`
  6) `deal_type` (Enum) — `sale|jeonse|wolse|rent|short`
  7) `price` (Object) — 거래 유형별 금액. 구조는 §8 참조
  8) `title` (String) — 매물명. 정렬/검색 대상
  9) `dong` (String|null) — 동
  10) `ho` (String|null) — 호
  11) `area_m2` (Pair) — `{supply:number, net:number}` ㎡ 단위
  12) `area_p` (Pair) — `{supply:number, net:number}` 평 단위
  13) `floor` (Object) — `{current:number|null, total:number|null}`

- 정렬 규칙
  - 헤더 클릭 시: 해당 컬럼 기준 asc ↔ desc 순환
  - 복합 정렬은 미사용(단일 키). 필요 시 향후 확장
  - 금액 정렬: 유형별 내부 숫자 키(`price_sort`)를 사용. `price_unknown=true`는 목록 최하단 배치

- 필터/검색
  - 상단 Select로 다중값 필터(콤마 구분)를 구성하여 API로 전달
  - 검색 `q`는 제목/주소/담당자/메모 등 텍스트 필드 대상(백엔드 계약에 따름)

- 페이징/가상 스크롤
  - 기본: 페이지네이션(page/pageSize)
  - 대량 데이터(> 2,000) 시: 가상 스크롤 허용. 내부 쿼리 키는 동일

- 선택/포커스
  - 단일 선택(행 클릭) → URL `id` 동기화 → 우측 상세 오픈
  - 키보드: ↑/↓로 행 이동, Enter로 상세 오픈, Esc로 상세 닫기
  - 스크롤 유지: 상세 열고 닫아도 리스트 스크롤 위치 유지

- 상태 표시(텍스트 중심)
  - 로딩: 자리표시 텍스트(행 수 고정 가능)
  - 빈 상태: 조건 일치 없음 안내 + 필터 초기화 버튼
  - 오류: 메시지 + 재시도 버튼

## 5. 상세 패널 사양
- 열림 트리거: 리스트 행 클릭 또는 URL로 `id` 진입
- 데이터 취득: `GET /api/properties/{id}`. 캐시가 있으면 즉시 표시 후 백그라운드 갱신
- 닫기: 닫기 버튼, Esc, 오버레이 영역 클릭(모바일 드로어 모드 기준), 뒤로가기
- 섹션/필드(라벨은 화면 텍스트, 키는 데이터 키)
  - 기본: `shared`, `owner_name`, `status`, `re_register_reason`
  - 매물: `category`, `title`, `dong`, `ho`
  - 위치: `address`
  - 거래: `deal_type`, `contract_period`, `price`(보증/월 혹은 매매/전세), `rent_type`
  - 상태: `ad_status`, `co_phone`, `co_broker`, `media(photo/video)`, `resident`, `closed_at`
  - 메모: `memo`, `note`

- 액션
  - 상태 변경: 상태 전환(보류/완료/철회 등). 완료로 전환 시 `closed_at` 필수
  - 편집: 편집 화면 이동 또는 인라인 편집(프로젝트 정책에 따름)
  - 저장 후: 리스트 해당 행 데이터 즉시 반영 + 캐시 무효화

- 검증/가드
  - 변경사항 존재 시 닫기/이동 전 확인(저장/취소)
  - 필수 필드/의존 필드(예: `status=closed` ⇒ `closed_at` required)

## 6. 이벤트 흐름(요약)
```
FilterChange → buildQueryParams → fetchList(query)
RowClick(id) → setURL(id) → fetchDetail(id)
SortChange(col,dir) → fetchList(query)
SearchInput(debounced) → fetchList(query)
SaveDetail(payload) → validate → upsert → invalidate list/detail → refresh
```

## 7. API 계약(초안)
- 목록
  - `GET /api/properties`
  - Query: `propertyType, dealType, status, q, sort, dir, page, pageSize, unknown`
  - Response:
    - `items: PropertyRow[]`, `page`, `pageSize`, `total`

- 상세
  - `GET /api/properties/{id}` → `PropertyDetail`
  - `PUT /api/properties/{id}` → 갱신
  - `PATCH /api/properties/{id}/status` `{status, reason?, closed_at?}`

## 8. 데이터 모델(프런트 기준)
```ts
type DealType = 'SALE' | 'JEONSE' | 'WOLSE' | 'RENT' | 'SHORT';
type ListingStatus = 'AVAILABLE' | 'CLOSED' | 'WITHDRAWN' | 'ON_HOLD' | 'UNKNOWN';
type PropertyType = 'APARTMENT' | 'VILLA' | 'OFFICETEL' | 'HOUSE' | 'ETC';

interface AreaPair { supply: number|null; net: number|null; }
interface PriceModel {
  dealType: DealType;
  total?: number|null;    // 매매/전세 금액(원 단위)
  deposit?: number|null;  // 보증금(원)
  monthly?: number|null;  // 월세(원)
  unknown?: boolean;      // 금액미정
  sort?: number|null;     // 정렬용 파생 수치
}

interface PropertyRow {
  id: string;
  created_at: string;
  shared: boolean|null;
  owner_name: string;
  status: ListingStatus;
  category: PropertyType;
  deal_type: DealType;
  price: PriceModel;
  title: string;
  dong: string|null;
  ho: string|null;
  area_m2: AreaPair|null;
  area_p: AreaPair|null;
  floor: { current: number|null; total: number|null }|null;
}

interface PropertyDetail extends PropertyRow {
  address: string|null;
  re_register_reason?: string|null;
  contract_period?: { from: string|null; to: string|null }|null;
  rent_type?: string|null;
  ad_status?: string|null;
  resident?: string|null;
  closed_at?: string|null;
  memo?: string|null;
  note?: string|null;
  media?: { photo?: 'planned'|'uploaded'|'none'|null; video?: 'planned'|'uploaded'|'none'|null };
}
```

파생 규칙(프런트 계산):
- `area_p`는 `area_m2`에서 계산 가능(서버 제공 시 우선)
- `price.sort`는 유형별 비교 수치(매매: total, 월세: deposit*10^6 + monthly 등 정책화)
- `floor.current/total`은 텍스트(`n층/m층`)에서 파싱 가능

## 9. 접근성/키보드
- 테이블에 `role=table`, 행 `role=row`, 셀 `role=cell`
- 단축키: ↑/↓ 행 이동, Enter 상세 열기, Esc 상세 닫기, `/` 포커스 검색(선택)
- 포커스 이동은 DOM 순서 준수. 패널 열릴 때 첫 인터랙션 요소에 포커스

## 10. 상태/오류/오프라인
- 로딩: 리스트/상세 각각 독립 로딩 상태 유지(상호 블로킹 없음)
- 오류: 사용자 메시지 + 재시도. 401/403은 접근 제한 안내
- 오프라인: 읽기 전용 안내, 저장은 큐잉 후 재전송(가능 시)

## 11. 성능/캐시
- 목록: 쿼리키 기반 캐싱(`propertyType,dealType,status,q,sort,dir,page,pageSize`)
- 상세: `id` 키로 5분 소프트 캐시, 행 이동 시 ±2개 프리페치
- 네트워크: 디바운스(검색), 중복요청 취소(AbortController)

## 12. 감사/권한(옵션)
- 상태 전환 및 PII 조회는 감사 로그 남김(사용자/시간/사유)
- 역할에 따라 편집/상태 전환 제한

## 13. 수용 기준(샘플)
- 헤더 필터/정렬/검색 조합 후 `Enter` 없이도 1초 내 목록 업데이트(검색은 300ms 디바운스 적용)
- 행 클릭 시 300ms 이내 상세 첫 페인트, 1초 내 API 데이터 반영
- 뒤로가기 시 직전 필터/선택 상태 복원(URL 동기화 기준)
- `price.unknown=true` 레코드는 금액 정렬 시 항상 최하단
- 키보드만으로 필터→테이블→상세 이동/닫기 가능

## 14. 테스트 시나리오(E2E 발췌)
1) 필터/정렬/검색 조합 상태에서 행 선택 → 상세 내용이 리스트 행과 일치
2) 뒤로가기 → 이전 선택/필터/정렬/페이지 상태 복원
3) `status=closed`로 전환 시 `closed_at` 미입력은 저장 실패(검증 메시지 노출)
4) 금액미정 행이 금액 오름차순 정렬에서 최하단 정렬됨
5) 네트워크 오류 시 재시도 버튼으로 복구, 오프라인에서 읽기 전용 안내 노출

## 15. 확장 항목(향후)
- 사용자별 컬럼 보이기/순서/고정 커스터마이즈
- 저장된 뷰/필터 프리셋
- 상세 인라인 편집 범위 확대 및 변경 이력 뷰



