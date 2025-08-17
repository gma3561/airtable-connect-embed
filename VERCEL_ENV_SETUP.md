# Vercel 환경 변수 설정 가이드

## 필수 환경 변수

### 1. Supabase 연결 설정

Vercel 대시보드에서 다음 환경 변수를 추가해야 합니다:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**중요**: 
- `NEXT_PUBLIC_` 프리픽스가 아닌 `VITE_` 프리픽스를 사용해야 합니다
- 이 프로젝트는 Next.js가 아닌 Vite를 사용합니다
- 프론트엔드가 Supabase를 직접 사용하므로 별도의 백엔드 서버는 필요하지 않습니다

### 2. Vercel 환경 변수 설정 방법

1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables 이동
3. 다음 변수 추가:
   
   **VITE_SUPABASE_URL**
   - Key: `VITE_SUPABASE_URL`
   - Value: Supabase 프로젝트 URL (예: `https://xxxx.supabase.co`)
   - Environment: Production, Preview, Development 모두 체크
   
   **VITE_SUPABASE_ANON_KEY**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Supabase 익명 키
   - Environment: Production, Preview, Development 모두 체크

4. "Save" 클릭
5. 재배포하기 (Deployments → 최신 배포 → ... 메뉴 → Redeploy)

### 3. 로컬 개발 환경 설정

`web/.env.local` 파일 생성:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Supabase 프로젝트 설정 확인

Supabase 대시보드에서:
1. `properties` 테이블이 존재하는지 확인
2. RLS (Row Level Security) 정책이 설정되어 있는지 확인
3. `search_properties` RPC 함수가 생성되어 있는지 확인

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
- ✅ 대시보드 디자인 적용 완료
- ✅ Supabase 직접 연결 코드 구현 완료
- ❌ 환경 변수 미설정
- ❌ 실제 데이터 연결 안됨 (목업 데이터 표시 중)

## 다음 단계

1. Vercel에서 Supabase 환경 변수 설정
2. 재배포하여 실제 데이터 연결 확인
3. Supabase에서 테이블 및 RPC 함수 확인