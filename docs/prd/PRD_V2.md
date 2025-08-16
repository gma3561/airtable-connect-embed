# PRD v2: 부동산 매물 관리 시스템

## 1. 목적 및 배경
- CSV/수기 혼재 데이터를 신속 적재하고, 리스트·검색 중심의 영업/운영을 실사용 가능 수준으로.
- MVP를 운영 가능한 수준으로 고도화: 관측성, 성능 보장, 데이터 품질, 기본 권한 대비.

## 2. 주요 사용자 및 페르소나
- 에이전트(현장): 빠른 검색/등록/수정
- 마케팅/백오피스: 검색/필터 기반 조회, 공유 상태 확인
- 관리자: 데이터 품질 모니터링, 성능 및 오류 모니터링

## 3. 범위
### In-Scope
- 매물 CRUD(텍스트 우선), 통합 검색(q) 및 필터, 서버 페이지네이션/정렬
- CSV Import(샘플 템플릿/매핑), 데이터 검증(필수/형식), 실패 행 리포트
- 관측성(요청 로그, 기본 지표), 헬스체크, 구성 파일로 기동
- 간단 권한(익명/서비스 키 분리, 서버 측만 서비스 키)

### Out-of-Scope
- 정교한 RBA/SSO, 광고/노출 채널 연동, 개인 민감정보, 고급 대시보드

## 4. 기능 요구사항
- 검색: q는 매물명/주소/동/담당자 부분 일치. 필터 조합, limit<=200, offset 지원
- 목록 정렬: `updated_at DESC, registration_date DESC`
- 등록/수정: 필수 `property_name`; 기타 자유 텍스트 허용
- CSV Import: 샘플 템플릿 제공, 헤더 매핑 UI, 유효성 검사, 실패 CSV 다운로드

## 5. 비기능 요구사항
- 성능: 데이터 1만건 기준 q 검색 p95 <= 300ms (서버)
- 안정성: 7일 이동 평균 5xx < 0.1%
- 보안: 서비스 키는 서버에서만 사용; CORS는 프로덕션 도메인 허용
- 관측성: 요청 경로/상태/소요시간 로그; 검색 p95, 에러율 집계 가능한 구조

## 6. 데이터 모델
- 테이블 `properties(...)` (MVP와 동일, 텍스트 위주)
- 인덱스: `pg_trgm` on property_name/address/building_dong/agent + 보조 인덱스

## 7. API 명세
- GET `/api/health` → `{ ok: true }`
- GET `/api/properties/search`
  - Query: `q, propertyType, transactionType, propertyStatus, agent, sharedOnly, limit(<=200), offset`
  - 200: `{ items: PropertyListItem[] }`
- POST `/api/properties` (추가)
  - Body: `Property` 최소 스키마(텍스트 위주)
  - 201: `{ id }`
- PUT `/api/properties/:id` (추가)
  - 200: `{ ok: true }`
- CSV Import (추가)
  - POST `/api/properties/import` (multipart): csv 파일, 매핑 JSON
  - 200: `{ successCount, failureCount, failureReportUrl }`

## 8. 수용 기준
- 2,562건 CSV 적재 후 `q="자양"` 검색 서버 p95<=300ms로 50건 반환
- 필터 조합(아파트+거래가능+공유만) 정상 동작
- 서버 재기동 시 `.env`만으로 정상 기동
- CSV Import 시 실패 행이 2% 이하, 실패 리포트 다운로드 가능

## 9. 마이그레이션/롤아웃 계획
- Supabase에 `supabase_schema_mvp.sql` 적용 확인 → 트래픽 없는 시간에 인덱스 재검
- `.env` 주입 후 서버 롤아웃, 로그 수집 경로 점검

## 10. 리스크 및 완화
- 한국어 검색 정확도: `pg_trgm` 유지, 필요시 `pgroonga` 평가
- CSV 품질: 템플릿/검증 강화, 실패 리포트로 피드백 루프
- 관측성 부족: 로깅 미들웨어 + 간단 집계 파이프라인
