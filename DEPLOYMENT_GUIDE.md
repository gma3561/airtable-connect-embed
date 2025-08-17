# Vercel 배포 가이드

## GitHub Actions를 통한 자동 배포 설정

### 1. Vercel 토큰 생성
1. https://vercel.com/account/tokens 접속
2. "Create" 버튼 클릭
3. 토큰 이름 입력 (예: "GitHub Actions")
4. 토큰 복사

### 2. Vercel 프로젝트 정보 확인
1. Vercel 대시보드에서 프로젝트 선택
2. Settings → General 이동
3. 다음 정보 확인:
   - Project ID: `prj_wbKSvmqTzo3IK9Qr2pztaFbaxF3h`
   - Team ID (Organization ID): Vercel 대시보드 URL에서 확인 (vercel.com/hasia/...)

### 3. GitHub Secrets 설정
GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 시크릿 추가:

#### Vercel 관련:
- `VERCEL_TOKEN`: Vercel에서 생성한 토큰
- `VERCEL_ORG_ID`: Vercel Team/Organization ID
- `VERCEL_PROJECT_ID`: `prj_wbKSvmqTzo3IK9Qr2pztaFbaxF3h`

#### 환경 변수:
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 익명 키
- `VITE_AIRTABLE_API_KEY`: Airtable API 키
- `VITE_AIRTABLE_BASE_ID`: Airtable Base ID
- `VITE_AIRTABLE_TABLE_ID`: Airtable Table ID

### 4. 배포 프로세스
1. `main` 브랜치에 코드 푸시
2. GitHub Actions가 자동으로 실행
3. 빌드 및 Vercel 배포 진행
4. 배포 완료 후 https://airtable-connect-embed.vercel.app 에서 확인

### 5. 수동 배포 (필요시)
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리로 이동
cd web

# Vercel 로그인
vercel login

# 프로덕션 배포
vercel --prod
```

## 현재 설정된 GitHub Actions 워크플로우

`.github/workflows/deploy-vercel.yml` 파일이 설정되어 있으며, 다음 작업을 수행합니다:

1. Node.js 18 설정
2. 종속성 설치
3. 프로젝트 빌드
4. Vercel CLI 설치
5. Vercel 환경 정보 가져오기
6. Vercel 빌드
7. Vercel 배포

## 문제 해결

### 배포 실패 시:
1. GitHub Actions 로그 확인
2. 모든 시크릿이 올바르게 설정되었는지 확인
3. Vercel 프로젝트 설정 확인
4. 빌드 오류가 있는지 로컬에서 `npm run build` 실행하여 확인