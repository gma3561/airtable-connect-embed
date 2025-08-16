# Backend Responsibilities

## Objectives
- PRD v2 기능/비기능 충족: 검색, CRUD, CSV Import 스켈레톤, 관측성

## Deliverables
- API: GET /api/health, GET /api/properties/search, POST /api/properties, PUT /api/properties/:id, POST /api/properties/import
- 로깅 미들웨어: 경로/상태/지연시간
- 부하 테스트 스크립트(k6 또는 autocannon)
- Supabase 스키마 적용/검증 문서화

## Tasks
1) 로깅 미들웨어 추가 (morgan 또는 커스텀)
2) CRUD 엔드포인트 추가(간단 검증)
3) Import 엔드포인트 스켈레톤 + 실패 리포트 업로드 인터페이스
4) 성능/부하 테스트: 시나리오, 임계값(p95 300ms)
5) CORS 설정(프로드 도메인 화이트리스트)

## Acceptance
- e2e 검색 p95<=300ms(서버 관점), 5xx<0.1%
- CSV 실패 리포트 다운로드 가능
