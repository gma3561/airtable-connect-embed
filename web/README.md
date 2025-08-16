# 부동산 매물 관리 시스템 (Frontend)

부동산 매물을 효율적으로 관리할 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📋 매물 목록
- 통합 검색 (매물명, 주소, 동, 담당자)
- 필터링 (매물종류, 거래유형, 진행상태, 담당자, 공유여부)
- 정렬 (최신 업데이트 순)
- 페이지네이션 (50건 단위)

### 🔍 매물 상세
- 기본 정보, 위치, 거래, 상세 정보 표시
- 첨부 파일 정보 (사진, 영상, 문서)
- 반응형 디자인

### ✏️ 매물 등록
- 3단계 스텝 폼
  - 1단계: 기본 정보 (매물명, 주소, 담당자 등)
  - 2단계: 거래 정보 (가격, 계약기간 등)
  - 3단계: 추가 정보 (메모, 특이사항 등)

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 미리보기
```bash
npm run preview
```

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일 우선 설계
- **접근성**: 키보드 네비게이션, 포커스 표시
- **로딩 상태**: 스켈레톤 UI, 로딩 애니메이션
- **사용자 경험**: 검색 디바운싱, 단계별 폼 검증

## 📱 반응형 브레이크포인트

- **모바일**: ≤640px (카드형 리스트)
- **태블릿**: 641–1024px (간략 테이블)
- **데스크톱**: ≥1025px (고정 헤더 테이블)

## 🔧 개발 가이드

### 컴포넌트 구조
```
src/
├── components/
│   ├── Header.tsx          # 헤더 네비게이션
│   ├── PropertyList.tsx    # 매물 목록 메인
│   ├── PropertyDetail.tsx  # 매물 상세 정보
│   ├── PropertyForm.tsx    # 매물 등록 폼
│   ├── SearchBar.tsx       # 검색 입력
│   ├── FilterPanel.tsx     # 필터 패널
│   ├── PropertyTable.tsx   # 매물 테이블
│   └── Pagination.tsx      # 페이지네이션
├── types/
│   └── Property.ts         # 타입 정의
└── App.tsx                 # 메인 앱 컴포넌트
```

### 주요 타입
- `Property`: 매물 전체 정보
- `PropertyListItem`: 목록용 매물 정보
- `SearchFilters`: 검색 필터 옵션

## 🚧 현재 상태

- ✅ 기본 UI/UX 구성 완료
- ✅ 컴포넌트 구조 및 라우팅 설정
- ✅ 반응형 디자인 구현
- ✅ 검색, 필터, 페이지네이션 기능
- 🔄 백엔드 API 연동 (준비 중)
- 🔄 실제 데이터 연동 (준비 중)

## 📋 TODO

- [ ] 백엔드 API 연동
- [ ] 실제 데이터 연동
- [ ] 이미지 업로드 기능
- [ ] 사용자 인증/권한 관리
- [ ] 매물 수정/삭제 기능
- [ ] 고급 검색 옵션
- [ ] 데이터 내보내기 기능

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성
3. 코드 작성 및 테스트
4. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
