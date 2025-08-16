# CSV Import Guide

## Prerequisites
- Supabase `properties` 테이블 및 인덱스 적용 (`supabase_schema_mvp.sql`)
- `server/.env`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 설정

## Run
```bash
# Dry run
npm --prefix server run import:csv -- --file "../에어테이블_임시 - 시트2.csv" --dry-run

# Execute with batch size
npm --prefix server run import:csv -- --file "../에어테이블_임시 - 시트2.csv" --batch 500
```

## Header Mapping
- CSV 헤더 → DB 컬럼
  - 등록일 → `registration_date` (YYYY-MM-DD로 정규화 시도)
  - 공유여부 → `shared_status` (true/false 인식)
  - 담당자 → `agent`
  - 매물상태 → `property_status`
  - 재등록사유 → `reregistration_reason`
  - 매물종류 → `property_type`
  - 매물명 → `property_name`
  - 동 → `building_dong`
  - 호 → `building_ho`
  - 소재지 → `address`
  - 거래유형 → `transaction_type`
  - 금액 → `price`
  - 임차유형 → `rental_type`
  - 임차금액 → `rental_amount`
  - 계약기간 → `contract_period`
  - 거주자 → `resident`
  - 거래완료날짜 → `completion_date`
  - 담당자MEMO → `agent_memo`
  - 특이사항 → `special_notes`

기타 컬럼(사진/영상/문서 등)은 후속 단계에서 확장 예정.

## Notes
- 실패 시 첫 에러에서 중단하도록 설계(안전성). 대량 배치 시 로그로 진행상황 표시.
- CSV 인코딩이 UTF-8 with BOM일 경우 자동 처리.
