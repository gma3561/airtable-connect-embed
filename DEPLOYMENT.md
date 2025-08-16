# Vercel 배포 가이드

## 사전 준비사항
1. Vercel 계정
2. Supabase 프로젝트
3. GitHub 저장소

## 배포 단계

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
VITE_API_BASE_URL=https://your-project.vercel.app
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
VITE_API_BASE_URL=http://localhost:8787
```

### 개발 서버 실행
```bash
# 루트 디렉토리에서
npm run install:all  # 최초 1회
npm run dev         # 서버와 클라이언트 동시 실행
```

## 주의사항
1. `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출되면 안 됩니다
2. Vercel Functions는 `/api` 경로로 자동 라우팅됩니다
3. 프론트엔드 빌드 결과물은 `web/dist`에 생성됩니다

## 문제 해결
- **CORS 에러**: Vercel 환경변수에서 `VITE_API_BASE_URL` 확인
- **API 404**: vercel.json의 rewrites 설정 확인
- **빌드 실패**: Node.js 버전 및 패키지 호환성 확인