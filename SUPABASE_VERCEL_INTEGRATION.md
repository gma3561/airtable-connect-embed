# Supabase-Vercel 연결 가이드

## 방법 1: Vercel Integration 사용 (권장)

### 1. Vercel 대시보드에서 Supabase Integration 추가

1. [Vercel Integrations Marketplace](https://vercel.com/integrations/supabase-v2) 접속
2. "Add Integration" 클릭
3. 프로젝트 선택: `airtable-connect-embed`
4. Supabase 로그인 및 권한 승인

### 2. Supabase 프로젝트 선택

1. 연결할 Supabase 프로젝트 선택
2. "Connect" 클릭
3. Vercel이 자동으로 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - 기타 DB 연결 변수들

### 3. 환경 변수 이름 수정

Vite 프로젝트이므로 환경 변수 이름을 수정해야 합니다:

1. Vercel 대시보드 → Settings → Environment Variables
2. 다음과 같이 추가/수정:
   - `VITE_SUPABASE_URL` = `NEXT_PUBLIC_SUPABASE_URL`의 값 복사
   - `VITE_SUPABASE_ANON_KEY` = `NEXT_PUBLIC_SUPABASE_ANON_KEY`의 값 복사

## 방법 2: 수동 연결

### 1. Supabase 프로젝트 정보 확인

1. [Supabase 대시보드](https://app.supabase.com) 로그인
2. 프로젝트 선택
3. Settings → API 메뉴 이동
4. 다음 정보 복사:
   - Project URL (예: `https://xxxxx.supabase.co`)
   - anon/public key (긴 문자열)

### 2. Vercel에 환경 변수 추가

1. [Vercel 대시보드](https://vercel.com) 로그인
2. 프로젝트 선택
3. Settings → Environment Variables
4. 다음 변수 추가:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...긴문자열
```

5. Environment 선택: Production, Preview, Development 모두 체크
6. "Save" 클릭

### 3. 재배포

1. Deployments 탭 이동
2. 최신 배포 옆 "..." 메뉴 클릭
3. "Redeploy" 선택
4. "Use existing Build Cache" 체크 해제
5. "Redeploy" 클릭

## Supabase 데이터베이스 설정 확인

### 1. properties 테이블 확인

Supabase SQL Editor에서 실행:

```sql
-- 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  property_name TEXT,
  address TEXT,
  building_dong TEXT,
  building_ho TEXT,
  property_type TEXT,
  transaction_type TEXT,
  property_status TEXT,
  price TEXT,
  contract_period TEXT,
  rental_amount TEXT,
  rental_type TEXT,
  resident TEXT,
  completion_date DATE,
  reregistration_reason TEXT,
  agent_memo TEXT,
  special_notes TEXT,
  registration_date DATE,
  shared_status BOOLEAN,
  agent TEXT,
  area_supply_sqm NUMERIC,
  area_exclusive_sqm NUMERIC,
  area_supply_py NUMERIC,
  area_exclusive_py NUMERIC,
  floor INTEGER,
  floors_total INTEGER,
  photos JSONB,
  videos JSONB,
  documents JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. RLS (Row Level Security) 설정

```sql
-- RLS 활성화
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 (모든 사용자)
CREATE POLICY "Enable read access for all users" ON properties
FOR SELECT USING (true);

-- 쓰기 권한 (인증된 사용자만)
CREATE POLICY "Enable insert for authenticated users only" ON properties
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON properties
FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON properties
FOR DELETE USING (auth.role() = 'authenticated');
```

### 3. search_properties RPC 함수 생성

```sql
CREATE OR REPLACE FUNCTION search_properties(
  q TEXT DEFAULT NULL,
  f_property_type TEXT DEFAULT NULL,
  f_transaction_type TEXT DEFAULT NULL,
  f_property_status TEXT DEFAULT NULL,
  f_agent TEXT DEFAULT NULL,
  f_shared_only BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 100,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
  property_name TEXT,
  address TEXT,
  building_dong TEXT,
  building_ho TEXT,
  property_type TEXT,
  transaction_type TEXT,
  property_status TEXT,
  price TEXT,
  agent TEXT,
  registration_date DATE,
  shared_status BOOLEAN,
  area_supply_sqm NUMERIC,
  area_exclusive_sqm NUMERIC,
  area_supply_py NUMERIC,
  area_exclusive_py NUMERIC,
  floor INTEGER,
  floors_total INTEGER,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.property_name,
    p.address,
    p.building_dong,
    p.building_ho,
    p.property_type,
    p.transaction_type,
    p.property_status,
    p.price,
    p.agent,
    p.registration_date,
    p.shared_status,
    p.area_supply_sqm,
    p.area_exclusive_sqm,
    p.area_supply_py,
    p.area_exclusive_py,
    p.floor,
    p.floors_total,
    p.updated_at
  FROM properties p
  WHERE 
    (q IS NULL OR 
     p.property_name ILIKE '%' || q || '%' OR 
     p.address ILIKE '%' || q || '%')
    AND (f_property_type IS NULL OR p.property_type = f_property_type)
    AND (f_transaction_type IS NULL OR p.transaction_type = f_transaction_type)
    AND (f_property_status IS NULL OR p.property_status = f_property_status)
    AND (f_agent IS NULL OR p.agent = f_agent)
    AND (f_shared_only IS NULL OR p.shared_status = f_shared_only)
  ORDER BY p.registration_date DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;
```

## 연결 확인

1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 에러 확인
3. Network 탭에서 Supabase API 호출 확인

## 문제 해결

### "Missing Supabase environment variables" 경고가 나타나는 경우
- Vercel 환경 변수가 제대로 설정되지 않음
- 재배포가 필요함

### CORS 에러가 발생하는 경우
- Supabase 대시보드 → Settings → API → CORS 설정 확인
- Vercel 도메인이 허용되어 있는지 확인

### 401 Unauthorized 에러
- anon key가 올바른지 확인
- RLS 정책이 올바르게 설정되어 있는지 확인