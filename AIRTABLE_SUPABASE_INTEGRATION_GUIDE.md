# Airtable ↔ Supabase 연동 완벽 가이드

## 📋 프로젝트 개요

**목표**: Airtable의 부동산 매물 데이터를 Supabase와 연동하여 웹 검색 시스템 구축

**프로젝트명**: airtable-sync  
**프로젝트 ID**: lpezbycikzbzijawtyem  
**지역**: ap-northeast-2 (한국 근처)

---

## 🚀 1단계: Supabase 프로젝트 생성

### 1.1 프로젝트 정보
- **조직**: the-realty (ID: lsckdvmseavcuciotiyo)
- **프로젝트명**: airtable-sync
- **지역**: ap-northeast-2
- **상태**: ACTIVE_HEALTHY ✅

### 1.2 프로젝트 생성 과정
```bash
# 1. 조직 선택: the-realty
# 2. 프로젝트명: airtable-sync
# 3. 지역: ap-northeast-2 (자동 선택)
# 4. 비용: 월 $10 (기존 구독 내에서 생성)
# 5. 생성 완료: 2025-08-16T12:03:33.156588Z
```

### 1.3 연결 정보
```
프로젝트 URL: https://lpezbycikzbzijawtyem.supabase.co
Anonymous Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 2단계: 기본 데이터베이스 스키마 설정

### 2.1 동기화 관련 테이블 생성
```sql
-- 1. 동기화 로그 테이블
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'SYNC')),
    airtable_data JSONB,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'ERROR', 'PENDING')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0
);

-- 2. 에어테이블 테이블 메타데이터
CREATE TABLE IF NOT EXISTS airtable_tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT UNIQUE NOT NULL,
    base_id TEXT NOT NULL,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 동기화 설정 테이블
CREATE TABLE IF NOT EXISTS sync_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_url TEXT NOT NULL,
    webhook_secret TEXT,
    sync_interval_minutes INTEGER DEFAULT 5,
    batch_size INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 에어테이블 레코드 캐시 테이블
CREATE TABLE IF NOT EXISTS airtable_records_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    airtable_record_id TEXT NOT NULL,
    record_data JSONB NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sync_status TEXT DEFAULT 'SYNCED' CHECK (sync_status IN ('SYNCED', 'PENDING', 'ERROR')),
    UNIQUE(table_name, airtable_record_id)
);
```

### 2.2 인덱스 및 RLS 설정
```sql
-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sync_logs_table_action ON sync_logs(table_name, action);
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at);
CREATE INDEX IF NOT EXISTS idx_airtable_records_cache_table ON airtable_records_cache(table_name);
CREATE INDEX IF NOT EXISTS idx_airtable_records_cache_status ON airtable_records_cache(sync_status);

-- RLS 정책 설정
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE airtable_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE airtable_records_cache ENABLE ROW LEVEL SECURITY;

-- 서비스 롤에 대한 정책
CREATE POLICY "Service role can do everything" ON sync_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything" ON airtable_tables FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything" ON sync_config FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything" ON airtable_records_cache FOR ALL USING (auth.role() = 'service_role');
```

---

## 🔗 3단계: Airtable 래퍼 설정

### 3.1 Airtable 연결 정보
```
Base ID: appKN0bn1CopVtAAe
Table ID: tbliA2BgdT6YYq7P1
View ID: viwjoBnaFcrQpLwxs
URL: https://airtable.com/appKN0bn1CopVtAAe/tbliA2BgdT6YYq7P1/viwjoBnaFcrQpLwxs
```

### 3.2 Personal Access Token (PAT)
```
PAT: patV8XLN0AyFM4JtF.62ff7efa8df5e6000990295dee1f461a8cb0e53a2b901e16a08e1c7855fc5fa1
```

### 3.3 래퍼 설정 과정
1. **Integrations** → **Airtable Wrapper** → **"Add new wrapper"**
2. **Wrapper Name**: `airtable_sync`
3. **API Key ID**: PAT 입력
4. **Data target**: Tables 체크, Schema 체크 해제
5. **Foreign Table 추가**:
   - Table Name: `에어테이블_임시`
   - Base ID: `appKN0bn1CopVtAAe`
   - Table ID: `tbliA2BgdT6YYq7P1`

### 3.4 컬럼 설정 (중요!)
```
Column name: id
Data type: text
Airtable field: id

Column name: createdTime
Data type: text
Airtable field: createdTime

Column name: fields
Data type: jsonb
Airtable field: fields
```

**⚠️ 중요**: `fields` 컬럼은 반드시 `jsonb` 타입이어야 함

---

## 📊 4단계: Airtable 데이터 구조 분석

### 4.1 실제 Airtable 테이블 구조
```
등록일 (Registration Date): 2021-12-29, 2022-01-12 등
공유여부 (Shared Status): TRUE/FALSE
담당자 (Person in Charge): 박소현, 정윤식, 대표매물
매물상태 (Property Status): 확인필요, 매물철회, 거래완료, 렌트로 계약
재등록사유 (Reason for Re-registration): 확인필요, 렌트로 계약
매물종류 (Property Type): 아파트, 단독주택, 빌라/연립, 오피스텔, 타운하우스
매물명 (Property Name): 장자울아파트, 한남 트윈빌, 시그니엘 70C, 파크뷰빌라
```

### 4.2 데이터 동기화 결과
- **총 레코드 수**: 2,562개 ✅
- **동기화 상태**: 성공 ✅
- **외부 테이블**: `public.에어테이블_임시` ✅

---

## 🏠 5단계: 매물 검색 시스템 설계

### 5.1 검색 시스템 요구사항
```
필터 (좌측 사이드바):
- 매물유형: 아파트, 단독주택, 빌라/연립, 오피스텔, 타운하우스
- 거래유형: 확인필요, 매물철회, 거래완료, 렌트로 계약

검색 (상단):
- 동 검색: 지역명 (강남구, 서초구 등)
- 매물명 검색: 아파트명, 빌라명 등
```

### 5.2 검색 최적화 인덱스
```sql
-- 매물 검색을 위한 인덱스 생성
CREATE INDEX idx_property_type ON "에어테이블_임시" 
USING GIN ((fields->>'매물종류'));

CREATE INDEX idx_property_status ON "에어테이블_임시" 
USING GIN ((fields->>'매물상태'));

CREATE INDEX idx_property_name ON "에어테이블_임시" 
USING GIN ((fields->>'매물명'));

CREATE INDEX idx_location ON "에어테이블_임시" 
USING GIN ((fields->>'매물명'));
```

### 5.3 검색 쿼리 예시
```sql
-- 매물종류별 검색
SELECT * FROM "에어테이블_임시" 
WHERE fields->>'매물종류' = '아파트';

-- 매물명 검색
SELECT * FROM "에어테이블_임시" 
WHERE fields->>'매물명' ILIKE '%한남%';

-- 복합 검색 (매물종류 + 매물상태)
SELECT * FROM "에어테이블_임시" 
WHERE fields->>'매물종류' = '아파트'
  AND fields->>'매물상태' = '거래완료';
```

---

## 🛠️ 6단계: 문제 해결 과정

### 6.1 발생했던 문제들
1. **잘못된 테이블 구조**: 개별 컬럼으로 생성 시도
2. **NULL 데이터**: fields 컬럼에 데이터가 들어오지 않음
3. **컬럼 타입 불일치**: uuid, timestamp 등 잘못된 타입 사용

### 6.2 해결 방법
1. **올바른 Airtable 래퍼 구조 사용**:
   - `id` (TEXT)
   - `createdTime` (TEXT)  
   - `fields` (JSONB)

2. **테이블 재생성**: 잘못된 구조 삭제 후 올바른 구조로 재생성

3. **컬럼 매핑 확인**: Airtable 필드와 Supabase 컬럼 정확히 매핑

---

## 🚀 7단계: 다음 개발 계획

### 7.1 웹 애플리케이션 구조
```
Frontend (React/Next.js)
    ↓
Backend API (Supabase Edge Functions)
    ↓
Database (Supabase PostgreSQL)
    ↓
Airtable (실시간 동기화)
```

### 7.2 구현할 기능들
1. **매물 검색 API**: Supabase Edge Functions
2. **필터링 시스템**: 매물유형, 거래유형
3. **검색 시스템**: 동, 매물명 검색
4. **매물 상세 페이지**: 사진, 설명, 위치 정보
5. **반응형 UI**: 모바일/데스크톱 최적화

### 7.3 기술 스택
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel 또는 Netlify

---

## 📝 8단계: 유용한 SQL 쿼리 모음

### 8.1 테이블 구조 확인
```sql
-- 테이블 컬럼 정보
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = '에어테이블_임시'
ORDER BY ordinal_position;

-- 외부 테이블 정보
SELECT * FROM information_schema.foreign_tables 
WHERE foreign_table_name = '에어테이블_임시';
```

### 8.2 데이터 확인
```sql
-- 전체 레코드 수
SELECT COUNT(*) FROM "에어테이블_임시";

-- 샘플 데이터 확인
SELECT * FROM "에어테이블_임시" LIMIT 5;

-- JSONB 필드 구조 분석
SELECT DISTINCT 
    jsonb_object_keys(fields) as field_name
FROM "에어테이블_임시" 
LIMIT 20;
```

### 8.3 검색 및 필터링
```sql
-- 특정 매물종류 검색
SELECT 
    id,
    fields->>'매물명' as property_name,
    fields->>'매물종류' as property_type,
    fields->>'담당자' as agent
FROM "에어테이블_임시" 
WHERE fields->>'매물종류' = '아파트'
LIMIT 10;

-- 매물명으로 검색
SELECT 
    id,
    fields->>'매물명' as property_name,
    fields->>'등록일' as registration_date
FROM "에어테이블_임시" 
WHERE fields->>'매물명' ILIKE '%아파트%'
ORDER BY fields->>'등록일' DESC;
```

---

## 🎯 9단계: 성공 요인 및 핵심 포인트

### 9.1 성공 요인
1. **올바른 Airtable 래퍼 구조 사용**
2. **JSONB 컬럼을 통한 유연한 데이터 저장**
3. **Personal Access Token (PAT) 사용**
4. **정확한 Base ID와 Table ID 설정**

### 9.2 핵심 포인트
1. **Airtable 래퍼는 3개 컬럼만 지원**: id, createdTime, fields
2. **fields 컬럼은 반드시 jsonb 타입**이어야 함
3. **개별 컬럼 매핑은 지원하지 않음**
4. **데이터는 JSONB 형태로 저장되어 SQL로 추출 가능**

### 9.3 주의사항
1. **테이블 구조 변경 시 래퍼 재생성 필요**
2. **JSONB 필드에서 데이터 추출 시 -> 연산자 사용**
3. **인덱스 생성으로 검색 성능 최적화**
4. **RLS 정책으로 보안 설정**

---

## 📚 10단계: 참고 자료 및 링크

### 10.1 Supabase 공식 문서
- [Foreign Data Wrappers](https://supabase.com/docs/guides/database/extensions/wrappers/overview)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### 10.2 Airtable 관련
- [Personal Access Tokens](https://airtable.com/developers/web/personal-access-tokens)
- [API Documentation](https://airtable.com/developers/web/api/introduction)

### 10.3 프로젝트 정보
- **프로젝트 URL**: https://lpezbycikzbzijawtyem.supabase.co
- **조직**: the-realty
- **프로젝트명**: airtable-sync
- **생성일**: 2025-08-16

---

## 🎉 결론

**Airtable ↔ Supabase 연동이 성공적으로 완료되었습니다!**

현재 상태:
- ✅ Supabase 프로젝트 생성 완료
- ✅ Airtable 래퍼 설정 완료  
- ✅ 2,562개 매물 데이터 동기화 완료
- ✅ 외부 테이블 `public.에어테이블_임시` 생성 완료
- ✅ JSONB 구조로 모든 Airtable 데이터 저장 완료

**다음 단계**: 매물 검색 웹 애플리케이션 개발 시작!

---

*마지막 업데이트: 2025-08-16*  
*작성자: AI Assistant*  
*프로젝트: airtable-sync*
