# Vercel 환경 변수 설정 가이드

## 필수 환경 변수

### 1. 프론트엔드 (Web) 환경 변수

Vercel 대시보드에서 다음 환경 변수를 추가해야 합니다:

```
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

**중요**: 
- `NEXT_PUBLIC_` 프리픽스가 아닌 `VITE_` 프리픽스를 사용해야 합니다
- 이 프로젝트는 Next.js가 아닌 Vite를 사용합니다

### 2. 백엔드 서버 배포

현재 프론트엔드만 배포되어 있고, 백엔드 서버가 배포되지 않아 데이터를 가져올 수 없습니다.

백엔드 서버는 다음 중 하나의 방법으로 배포해야 합니다:

#### 옵션 1: Vercel Edge Functions (권장)
1. `api` 폴더를 생성하고 서버 코드를 Edge Function으로 변환
2. Supabase 연결을 위한 환경 변수 설정:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

#### 옵션 2: 별도 서버 배포
1. 백엔드를 별도의 서비스(Railway, Render, Fly.io 등)에 배포
2. 배포된 백엔드 URL을 `VITE_API_BASE_URL`에 설정

### 3. Vercel 환경 변수 설정 방법

1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables 이동
3. 다음 변수 추가:
   - Key: `VITE_API_BASE_URL`
   - Value: 백엔드 서버 URL (예: `https://api.yourdomain.com`)
   - Environment: Production, Preview, Development 모두 체크
4. "Save" 클릭

### 4. 로컬 개발 환경 설정

`web/.env.local` 파일 생성:
```
VITE_API_BASE_URL=http://localhost:8787
```

`server/.env` 파일 생성:
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=8787
```

## 문제 해결

### 데이터가 표시되지 않는 경우:

1. **브라우저 개발자 도구에서 네트워크 탭 확인**
   - API 요청이 실패하는지 확인
   - CORS 에러가 있는지 확인

2. **환경 변수 확인**
   - Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
   - 변경 후 재배포가 필요할 수 있음

3. **백엔드 서버 상태 확인**
   - 백엔드 서버가 실행 중인지 확인
   - Supabase 연결이 정상인지 확인

## 현재 상태

- ✅ 프론트엔드 UI 배포 완료
- ❌ 백엔드 서버 미배포
- ❌ 환경 변수 미설정
- ❌ 데이터 연결 안됨

## 다음 단계

1. 백엔드 서버 배포 방식 결정
2. Vercel 환경 변수 설정
3. 재배포 후 데이터 연결 확인