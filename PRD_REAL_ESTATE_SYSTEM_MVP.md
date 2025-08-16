# PRD: 부동산 매물 관리 시스템 (MVP)

## 1. 목적
- CSV/수기 입력의 혼재 데이터를 빠르게 적재하고, 리스트·검색 중심의 업무를 즉시 가능하게 한다.

## 2. 범위 (In-Scope)
- 매물 데이터 저장(텍스트 우선), 리스트 조회, 통합 검색(q), 기본 필터(매물종류/거래유형/진행상태/담당자/공유여부), 정렬(최신 업데이트 순), 서버 페이지네이션.
- 사진/영상/문서는 경로만 저장(업로드 운영정책은 후속 단계).

## 3. 범위 외 (Out-of-Scope)
- 정교한 인증/권한, 광고 관리, 소유자 민감정보 처리, 고급 대시보드(V2에서 다룸).

## 4. 사용자와 시나리오
- 에이전트: 검색으로 기존 매물 확인, 신규 등록 후 즉시 노출 확인.
- 마케팅/백오피스: 리스트/검색만 활용(권한은 후속).

## 5. 핵심 요구사항 (기능)
- 데이터 저장: 자유 텍스트 허용(숫자/텍스트 혼재), 필수: 매물명.
- 검색: q가 매물명/주소/동/담당자에 부분 일치. 필터 조합 지원. 50행 단위 페이지네이션.
- 성능: 데이터 1만 건 기준 q 검색 서버 응답 p95 <= 300ms.
- 안정성: API 5xx 비율 < 0.1% (7일 이동 평균).

## 6. 비기능
- 보안: 서버 키는 서버에서만 사용(.env), 클라이언트는 익명키 사용(후속 권한화 예정).
- 관측성: 서버 로그(요청 경로/응답코드/지연시간) 콘솔 → 호스팅 로그로 집계.

## 7. 데이터 모델(MVP)
- `properties(id, property_name, address, building_dong, building_ho, agent, property_type, transaction_type, property_status, price, contract_period, rental_amount, rental_type, resident, completion_date, reregistration_reason, agent_memo, special_notes, registration_date, shared_status, photos, videos, documents, created_at, updated_at)`
- 인덱스: `pg_trgm` on `property_name, address, building_dong, agent` + 보조 인덱스.

## 8. API (MVP)
- GET `/api/properties/search`
  - Query: `q, propertyType, transactionType, propertyStatus, agent, sharedOnly, limit(<=200), offset`
  - 200: `{ items: PropertyListItem[] }`
- GET `/api/health` → `{ ok: true }`

## 9. 수용 기준 (Acceptance)
- CSV 2,562건 적재 시, `q="자양"` 응답 300ms 이내(서버)로 50건 반환.
- 필터 조합(예: 아파트+거래가능+공유만) 정상 동작.
- 서버 재기동 시 설정 없이 정상 기동(.env만 필요).

## 10. 마이그레이션/적용
- Supabase 콘솔에서 `supabase_schema_mvp.sql` 실행(확장/테이블/인덱스/함수 생성).
- 서버 `.env` 준비 후 `npm i && npm run dev`로 기동.

## 11. V2 고려사항(설계 연계)
- 권한/사용자/광고 테이블 추가 예정(V2 문서 기준).
- Repository/Service/Controller 분리로 권한/RLS/광고 조인 확장 용이.
- 한국어 검색은 `pg_trgm` 유지, 필요 시 `pgroonga`/전용 검색엔진 도입.
