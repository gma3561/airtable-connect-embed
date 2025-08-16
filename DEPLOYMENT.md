# 배포 가이드 (GitHub Pages + Vercel)

## 사전 준비사항
1. Vercel 계정
2. Supabase 프로젝트
3. GitHub 저장소

## GitHub Pages 배포 (권장: main push 자동 배포)

메인 브랜치 푸시 시 GitHub Actions가 다음을 수행합니다.

1) Playwright(MCP 게이트) 실행 – 기본 로드 스모크 테스트
2) 웹 빌드
3) GitHub Pages 배포(`web/dist`)

필요 환경변수(로컬/CI):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

로컬에서 미리보기 테스트:
```bash
cd web
npm install
echo VITE_SUPABASE_URL=https://dummy.supabase.co > .env
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy >> .env
npm run build && npm run preview
```

## Vercel 배포 가이드

### 1. GitHub에 코드 푸시
```bash
git add .
git commit -m "feat: Add Vercel deployment configuration"
git push origin main
```

### 2. Vercel에서 프로젝트 Import
1. [Vercel Dashboard](https://vercel.com/dashboard)에서 "New Project" 클릭
2. GitHub 저장소 선택
3. Framework Preset: "Vite" 자동 감지됨
4. Root Directory: 그대로 유지 (.)

### 3. 환경변수 설정
Vercel 프로젝트 Settings → Environment Variables에서 추가:

#### 필수 환경변수
```
# Supabase (자동으로 연동되어 있다면 일부는 이미 설정되어 있을 수 있음)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 프론트엔드용 (Production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 배포
1. "Deploy" 버튼 클릭
2. 빌드 프로세스 모니터링
3. 배포 완료 후 제공된 URL로 접속 테스트

## 로컬 개발 환경

### 서버 환경변수 (.env)
```bash
# server/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=8787
```

### 클라이언트 환경변수 (.env)
```bash
# web/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 개발 서버 실행
```bash
# 루트 디렉토리에서 (프론트 미리보기)
cd web
npm install
npm run build && npm run preview
```

## 주의사항
1. `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출되면 안 됩니다
2. Vercel Functions는 `/api` 경로로 자동 라우팅됩니다
3. 프론트엔드 빌드 결과물은 `web/dist`에 생성됩니다

## 문제 해결
- **CORS 에러**: Vercel 환경변수에서 `VITE_API_BASE_URL` 확인
- **API 404**: vercel.json의 rewrites 설정 확인
- **빌드 실패**: Node.js 버전 및 패키지 호환성 확인