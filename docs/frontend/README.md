# Frontend Responsibilities

## Objectives
- 검색/필터/페이지네이션 UI, CRUD 폼, CSV Import UI(템플릿/매핑)

## Deliverables
- 검색 페이지: q, 필터들, 결과 리스트(50행), 페이지네이션
- 매물 등록/수정 폼(필수 항목 검증)
- CSV Import 화면: 템플릿 다운로드, 파일 업로드, 헤더 매핑, 결과 요약/실패 다운로드 링크 표시

## Tasks
1) 검색 페이지 라우트 및 쿼리 스트링 동기화
2) 결과 테이블(가상 스크롤 또는 페이지네이션)
3) CRUD 폼: `property_name` 필수, 나머지 자유 텍스트
4) Import UI: 파일 업로드, 매핑 JSON 작성, 전송
5) 오류/빈 상태/로딩 상태 UX 정리

## Acceptance
- 기본 브라우저 테스트 통과, API 연동 정상
- 접근성: 폼 레이블/키보드 내비게이션 기본 준수
