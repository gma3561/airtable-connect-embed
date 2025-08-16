# 부동산 매물 관리 시스템 상세 기획서 V2.0

## 📋 프로젝트 개요

**목표**: 부동산 매물을 체계적으로 관리하고 검색할 수 있는 웹 시스템 구축

**시스템 유형**: 임시 매물장 및 입력 폼
**데이터 소스**: CSV 파일 (2,562개 매물 데이터)
**기술 스택**: React + Supabase + TypeScript
**특징**: 역할 기반 권한 시스템, 백오피스 광고 관리

---

## 👥 직원 명단 및 역할 분류

### **관리자 (Admin) - 최고 권한**
```
하상현 - lucas@the-realty.co.kr (관리자)
정연서 - jenny@the-realty.co.kr (관리자)

권한:
├── 모든 매물 정보 조회/수정/삭제
├── 소유자 정보 접근
├── 사용자 관리
├── 시스템 설정
└── 통계 및 리포트
```

### **마케팅 (Marketing) - 마케팅 전담**
```
김규민 - gyum@the-realty.co.kr (마케팅)
정서연 - yool@the-realty.co.kr (마케팅)

권한:
├── 매물 정보 조회
├── 매물 등록/수정 (담당 매물만)
├── 광고 현황 조회
└── 마케팅 자료 접근
```

### **백오피스 (Back Office) - 광고 관리 전담**
```
송효경 - songhg95@the-realty.co.kr (백오피스)
김예진 - kyj0470@the-realty.co.kr (백오피스)

권한:
├── 매물 정보 조회
├── 광고 등록/관리
├── 광고 번호 입력
└── 광고 현황 관리
```

### **일반 담당자 (Agent) - 매물 관리**
```
정선혜 - grace@the-realty.co.kr
박소현 - sso@the-realty.co.kr
송영주 - joo@the-realty.co.kr
정윤식 - yun@the-realty.co.kr
성은미 - mimi@the-realty.co.kr
서을선 - sun@the-realty.co.kr
서지혜 - kylie@the-realty.co.kr
김효석 - seok@the-realty.co.kr

권한:
├── 담당 매물 조회/수정
├── 매물 등록
└── 기본 정보 관리
```

---

## 🏗️ 시스템 아키텍처

### **전체 구조**
```
Frontend (React/Next.js)
    ↓
Backend API (Supabase Edge Functions)
    ↓
Database (Supabase PostgreSQL)
    ↓
CSV 데이터 직접 import
```

### **권한 기반 접근 제어**
```
사용자 인증 (Supabase Auth)
    ↓
역할 기반 권한 확인
    ↓
데이터 접근 제어 (RLS)
    ↓
UI 렌더링 (권한별 화면)
```

### **주요 컴포넌트**
1. **사용자 인증 시스템** - 로그인/로그아웃, 역할 관리
2. **매물 등록 폼** - 새로운 매물 정보 입력
3. **매물 목록 (리스트 뷰)** - 전체 매물 테이블 형태로 표시
4. **매물 상세 뷰** - 개별 매물 클릭 시 상세 정보 표시
5. **검색 및 필터링** - 동, 매물명 검색 및 카테고리별 필터링
6. **광고 관리 시스템** - 백오피스 전용 광고 등록/관리
7. **관리자 대시보드** - 시스템 통계 및 사용자 관리

---

## 📊 데이터 구조 분석

### **CSV 데이터 현황**
- **총 레코드 수**: 2,562개
- **필드 수**: 40개 컬럼
- **데이터 품질**: 아직 정제되지 않은 상태 (대부분 텍스트 값)

### **핵심 필드 분류**

#### **선택형 필드 (드롭다운)**
```
매물종류 (22개):
├── 주거용: 아파트, 주상복합, 빌라/연립, 오피스텔, 단독주택, 타운하우스, 상가주택, 원룸, 다가구, 한옥
├── 상업용: 빌딩/건물, 사무실/상가, 지식산업센터
├── 투자/개발: 재개발, 재건축, 아파트분양권, 주상복합분양권, 오피스텔분양권
└── 기타: 숙박/콘도, 전원/농가, 공장/창고, 기타

거래유형 (5개):
├── 분양, 매매, 전세, 월세/렌트, 단기

진행상태 (5개):
├── 거래가능, 거래완료, 거래보류, 거래철회

담당자 (13명):
├── 정선혜, 박소현, 송영주, 정윤식, 성은미, 서을선, 서지혜, 김효석
├── 김규민, 정서연 (마케팅)
├── 송효경, 김예진 (백오피스)
└── 하상현, 정연서 (관리자)
```

#### **텍스트 입력 필드**
```
매물명: 텍스트 입력 (예: 롯데캐슬이스트폴, 광진하우스토리)
동: 텍스트 입력 (예: 102, A, 1동, 101)
호: 텍스트 입력 (예: 4704, 802호, 302)
소재지: 텍스트 입력 (예: 자양동 680-63)
금액: 텍스트 입력 (예: 1,050, 2억/1000, 17억)
면적: 텍스트 입력 (예: 180.16/138.52m², 54.49/41.9평)
```

#### **체크박스 필드**
```
공유여부: ☑️ 체크박스
```

---

## 🗄️ 데이터베이스 설계

### **1. 사용자 테이블: users**
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 기본 정보
  name TEXT NOT NULL,                    -- 이름
  email TEXT NOT NULL UNIQUE,            -- 이메일
  role TEXT NOT NULL CHECK (
    role IN ('admin', 'marketing', 'backoffice', 'agent')
  ),
  
  -- 상태 정보
  is_active BOOLEAN DEFAULT true,        -- 활성 상태
  last_login TIMESTAMP WITH TIME ZONE,   -- 마지막 로그인
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 사용자 데이터 삽입
INSERT INTO users (name, email, role) VALUES
('하상현', 'lucas@the-realty.co.kr', 'admin'),
('정연서', 'jenny@the-realty.co.kr', 'admin'),
('김규민', 'gyum@the-realty.co.kr', 'marketing'),
('정서연', 'yool@the-realty.co.kr', 'marketing'),
('송효경', 'songhg95@the-realty.co.kr', 'backoffice'),
('김예진', 'kyj0470@the-realty.co.kr', 'backoffice'),
('정선혜', 'grace@the-realty.co.kr', 'agent'),
('박소현', 'sso@the-realty.co.kr', 'agent'),
('송영주', 'joo@the-realty.co.kr', 'agent'),
('정윤식', 'yun@the-realty.co.kr', 'agent'),
('성은미', 'mimi@the-realty.co.kr', 'agent'),
('서을선', 'sun@the-realty.co.kr', 'agent'),
('서지혜', 'kylie@the-realty.co.kr', 'agent'),
('김효석', 'seok@the-realty.co.kr', 'agent');
```

### **2. 매물 정보 테이블: properties (공개 정보)**
```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 기본 정보 (선택형)
  property_type TEXT NOT NULL CHECK (
    property_type IN (
      '아파트', '주상복합', '빌라/연립', '오피스텔', '단독주택', '타운하우스',
      '빌딩/건물', '사무실/상가', '상가주택', '원룸', '다가구', '한옥',
      '숙박/콘도', '전원/농가', '공장/창고', '재개발', '재건축',
      '아파트분양권', '주상복합분양권', '오피스텔분양권', '지식산업센터', '기타'
    )
  ),
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN ('분양', '매매', '전세', '월세/렌트', '단기')
  ),
  property_status TEXT NOT NULL CHECK (
    property_status IN ('거래가능', '거래완료', '거래보류', '거래철회')
  ),
  user_id UUID NOT NULL REFERENCES users(id),  -- 담당자 (users 테이블 참조)
  
  -- 나머지 정보 (텍스트형)
  property_name TEXT NOT NULL,      -- 매물명
  building_dong TEXT,               -- 동
  building_ho TEXT,                 -- 호
  address TEXT,                     -- 소재지
  price TEXT,                       -- 금액 (텍스트)
  contract_period TEXT,             -- 계약기간
  rental_amount TEXT,               -- 임차금액
  rental_type TEXT,                 -- 임차유형
  resident TEXT,                    -- 거주자
  completion_date TEXT,             -- 거래완료날짜
  reregistration_reason TEXT,       -- 재등록사유
  agent_memo TEXT,                  -- 담당자MEMO
  special_notes TEXT,               -- 특이사항
  
  -- 메타데이터
  registration_date DATE,           -- 등록일
  shared_status BOOLEAN,            -- 공유여부
  photos TEXT[],                    -- 사진
  videos TEXT[],                    -- 영상
  documents TEXT[],                 -- 기타서류
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. 소유자 정보 테이블: property_owners (관리자 전용)**
```sql
CREATE TABLE property_owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- 민감 정보 (관리자 전용)
  owner_name TEXT NOT NULL,                    -- 소유자명
  owner_contact TEXT NOT NULL,                 -- 소유자 연락처
  registration_number TEXT NOT NULL,           -- 주민등록번호/법인등록번호
  contact_relationship TEXT NOT NULL,          -- 연락처 관계
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(property_id)
);
```

### **4. 광고 정보 테이블: advertisements (백오피스 관리)**
```sql
CREATE TABLE advertisements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- 광고 정보
  ad_number TEXT NOT NULL,              -- 광고 번호
  ad_status TEXT NOT NULL DEFAULT '활성' CHECK (
    ad_status IN ('활성', '비활성', '만료', '삭제')
  ),
  ad_period TEXT,                       -- 광고 기간
  ad_platform TEXT,                     -- 광고 플랫폼
  
  -- 백오피스 담당자
  backoffice_user_id UUID NOT NULL REFERENCES users(id),
  
  -- 광고 메타데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(property_id, ad_number)
);
```

### **5. 검색 최적화 인덱스**
```sql
-- 매물 검색을 위한 인덱스 생성
CREATE INDEX idx_property_type ON properties (property_type);
CREATE INDEX idx_transaction_type ON properties (transaction_type);
CREATE INDEX idx_property_status ON properties (property_status);
CREATE INDEX idx_user_id ON properties (user_id);
CREATE INDEX idx_property_name ON properties USING GIN (to_tsvector('korean', property_name));
CREATE INDEX idx_address ON properties USING GIN (to_tsvector('korean', address));
CREATE INDEX idx_building_dong ON properties USING GIN (to_tsvector('korean', building_dong));
CREATE INDEX idx_shared_status ON properties (shared_status);
CREATE INDEX idx_registration_date ON properties (registration_date);

-- 광고 검색을 위한 인덱스
CREATE INDEX idx_ad_status ON advertisements (ad_status);
CREATE INDEX idx_backoffice_user_id ON advertisements (backoffice_user_id);
CREATE INDEX idx_property_ad ON advertisements (property_id);

-- 소유자 정보 검색을 위한 인덱스
CREATE INDEX idx_property_owner ON property_owners (property_id);
```

---

## 🔒 보안 및 권한 관리

### **Row Level Security (RLS) 설정**

#### **properties 테이블 RLS**
```sql
-- RLS 활성화
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (모든 사용자가 매물 정보 조회 가능)
CREATE POLICY "Public can view properties" ON properties
FOR SELECT USING (true);

-- 담당자만 자신의 매물 수정 가능
CREATE POLICY "Agents can modify their own properties" ON properties
FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 관리자만 모든 작업 가능
CREATE POLICY "Admins can do everything" ON properties
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text::uuid 
    AND users.role = 'admin'
  )
);
```

#### **property_owners 테이블 RLS**
```sql
-- RLS 활성화
ALTER TABLE property_owners ENABLE ROW LEVEL SECURITY;

-- 관리자만 모든 작업 가능
CREATE POLICY "Only admins can access owner info" ON property_owners
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text::uuid 
    AND users.role = 'admin'
  )
);

-- 일반 사용자는 접근 불가
CREATE POLICY "Public cannot access owner info" ON property_owners
FOR ALL USING (false);
```

#### **advertisements 테이블 RLS**
```sql
-- RLS 활성화
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- 백오피스 사용자만 광고 관리 가능
CREATE POLICY "Backoffice users can manage ads" ON advertisements
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text::uuid 
    AND (users.role = 'backoffice' OR users.role = 'admin')
  )
);

-- 일반 사용자는 읽기만 가능
CREATE POLICY "Public can view ads" ON advertisements
FOR SELECT USING (true);
```

### **API 보안 정책**
```typescript
// 역할 기반 API 접근 제어
const checkUserRole = async (req: Request, requiredRole: string): Promise<boolean> => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return false;
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return userData?.role === requiredRole || userData?.role === 'admin';
};

// 소유자 정보 조회 API (관리자 전용)
export async function getPropertyOwner(req: Request) {
  const isAdmin = await checkUserRole(req, 'admin');
  
  if (!isAdmin) {
    return new Response('Unauthorized: Admin access required', { status: 401 });
  }
  
  // 소유자 정보 반환
  const { data, error } = await supabase
    .from('property_owners')
    .select('*')
    .eq('property_id', propertyId);
    
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 🎨 UI/UX 설계

### **1. 로그인 화면**
```
🏢 더부동산 매물 관리 시스템

[이메일] [이메일 입력]
[비밀번호] [비밀번호 입력]
[로그인] [버튼]

비밀번호를 잊으셨나요? [링크]
```

### **2. 메인 대시보드 (역할별)**

#### **관리자 대시보드**
```
📊 관리자 대시보드

통계 요약
├── 총 매물 수: 2,562개
├── 활성 매물: 1,847개
├── 거래완료: 715개
└── 등록 대기: 23개

사용자 관리
├── 활성 사용자: 14명
├── 최근 로그인: 12명
└── 권한별 분포: 관리자(2), 마케팅(2), 백오피스(2), 일반담당자(8)

시스템 관리
├── [사용자 관리] [버튼]
├── [시스템 설정] [버튼]
└── [백업/복원] [버튼]
```

#### **마케팅 대시보드**
```
📈 마케팅 대시보드

담당 매물 현황
├── 등록된 매물: 45개
├── 활성 매물: 38개
├── 거래완료: 7개
└── 광고 등록: 32개

마케팅 도구
├── [매물 등록] [버튼]
├── [광고 현황] [버튼]
└── [마케팅 자료] [버튼]
```

#### **백오피스 대시보드**
```
📢 백오피스 대시보드

광고 관리 현황
├── 총 광고: 1,847개
├── 활성 광고: 1,623개
├── 만료 광고: 156개
└── 대기 광고: 68개

광고 관리 도구
├── [광고 등록] [버튼]
├── [광고 현황] [버튼]
├── [광고 통계] [버튼]
└── [플랫폼 관리] [버튼]
```

#### **일반 담당자 대시보드**
```
🏠 담당자 대시보드

담당 매물 현황
├── 등록된 매물: 23개
├── 활성 매물: 18개
├── 거래완료: 5개
└── 광고 등록: 15개

매물 관리 도구
├── [매물 등록] [버튼]
├── [담당 매물] [버튼]
└── [매물 수정] [버튼]
```

### **3. 매물 등록 폼 (16행 구성)**

#### **상단 정보**
```
📅 등록일: [날짜 선택기 ▼] yyyy-mm-dd
☑️ 공유여부
```

#### **1행: 담당자 및 상태**
```
👤 담당자: [드롭다운 ▼]
├── 정선혜 (grace@the-realty.co.kr)
├── 박소현 (sso@the-realty.co.kr)
├── 송영주 (joo@the-realty.co.kr)
├── 정윤식 (yun@the-realty.co.kr)
├── 성은미 (mimi@the-realty.co.kr)
├── 서을선 (sun@the-realty.co.kr)
├── 서지혜 (kylie@the-realty.co.kr)
└── 김효석 (seok@the-realty.co.kr)

📊 매물상태: [드롭다운 ▼] (거래가능, 거래완료, 거래보류, 거래철회)
📝 재등록사유: [텍스트 입력]
```

#### **2행: 매물 정보**
```
🏠 매물종류: [드롭다운 ▼] (22개 카테고리)
🏢 매물명: [텍스트 입력]
```

#### **3행: 위치 정보**
```
📍 소재지: [긴 텍스트 입력]
🏢 동: [텍스트 입력]
🏠 호: [텍스트 입력]
```

#### **4행: 거래 정보**
```
💰 거래유형: [드롭다운 ▼] (5개 카테고리)
💵 금액: [텍스트 입력]
```

#### **5행: 면적 정보**
```
📐 공급/전용 (㎡): [텍스트 입력]
📏 공급/전용 (평): [텍스트 입력]
```

#### **6행: 건물 정보**
```
🏗️ 해당층/총층: [텍스트 입력]
🛏️ 룸/욕실: [텍스트 입력]
🧭 방향(거실기준): [텍스트 입력]
```

#### **7행: 관리 정보**
```
💼 관리비: [텍스트 입력]
🚗 주차: [텍스트 입력]
```

#### **8행: 입주 정보**
```
🏠 입주가능일: [텍스트 입력]
✅ 사용승인: [텍스트 입력]
```

#### **9행: 상세 정보**
```
📝 특이사항: [긴 텍스트 영역]
```

#### **10행: 담당자 메모**
```
📋 담당자MEMO: [텍스트 입력]
```

#### **11행: 거래 완료 정보**
```
📅 거래완료날짜: [텍스트 입력]
👥 거주자: [텍스트 입력]
```

#### **12행: 임차 정보**
```
🏠 임차유형: [텍스트 입력]
💵 임차금액: [텍스트 입력]
📅 계약기간: [텍스트 입력]
```

#### **13행: 미디어 및 중개 정보**
```
📸 사진: [파일 업로드]
🎥 영상: [파일 업로드]
🎭 출연: [텍스트 입력]
🤝 공동중개: [텍스트 입력]
📞 공동연락처: [텍스트 입력]
```

#### **14행: 광고 정보**
```
📢 광고상태: [텍스트 입력]
📅 광고기간: [텍스트 입력]
```

#### **15행: 매물 번호**
```
🔢 임시매물번호: [텍스트 입력]
✅ 등록완료번호: [텍스트 입력]
```

#### **16행: 소유자 정보 (관리자 전용)**
```
👤 소유자: [텍스트 입력] *
📞 소유자 연락처: [텍스트 입력] *
🆔 주민등록번호/법인등록번호: [텍스트 입력] *
🔗 연락처 관계: [텍스트 입력] *
➕ [추가 버튼]
```

#### **하단 액션**
```
[Clear form] [Submit]
```

### **4. 매물 목록 (리스트 뷰)**

#### **상단 검색/필터 영역**
```
[동 검색] [매물명 검색] [검색 버튼]

매물종류: [아파트 ▼]  거래유형: [렌트 ▼]  진행상태: [거래가능 ▼]
담당자: [전체 ▼]  공유여부: [전체 ▼]
```

#### **테이블 형태 리스트**
```
등록일    | 공유여부 | 담당자 | 진행상태 | 매물종류 | 거래유형 | 금액    | 매물명              | 동   | 호
2025-08-15 | ☑️      | 박소현 | 거래완료 | 아파트   | 렌트     | 1,050  | 롯데캐슬이스트폴    | 102  | 4704
2025-08-14 | ☑️      | 서지혜 | 거래가능 | 빌라     | 월세     | 2억/1000| 광진하우스토리      | 101  | 802호
```

### **5. 매물 상세 뷰 (권한별 표시)**

#### **공개 정보 (모든 사용자)**
```
🏠 롯데캐슬이스트폴

📋 기본 정보
├── 공유여부: ☑️
├── 담당자: 박소현 (sso@the-realty.co.kr)
├── 진행상태: 거래완료
├── 재등록사유: 렌트로 계약
├── 매물종류: 아파트
├── 매물명: 롯데캐슬이스트폴
├── 동: 102
├── 호: 4704

📍 위치 정보
├── 소재지: 자양동 680-63

💰 거래 정보
├── 거래유형: 렌트
├── 계약기간: 25.08~26.08
├── 임차금액: 0/1050
├── 임차유형: 1년렌트
├── 거주자: 임차인
├── 거래완료날짜: 25.08.16

📝 상세 정보
├── 담당자MEMO: 양도세, 현금 거래, 전세 수준, 뷰 관련 메모
├── 특이사항: 고급풀옵션, 거실전면, 통창변경예정, 장기거주가능, 커뮤니티 시설 정보

📎 첨부파일
├── 사진: [업로드]
└── 영상: [업로드]
```

#### **광고 정보 (백오피스/관리자만)**
```
📢 광고 정보 (백오피스/관리자만)
├── 광고 번호: AD-2025-001
├── 광고 상태: 활성
├── 광고 기간: 2025.08.15 ~ 2025.09.15
├── 광고 플랫폼: 부동산114, KB부동산
└── 담당자: 송효경 (songhg95@the-realty.co.kr)
```

#### **소유자 정보 (관리자만)**
```
🔒 소유자 정보 (관리자만)
├── 소유자: 김철수
├── 소유자 연락처: 010-1234-5678
├── 주민등록번호: 800101-1234567
└── 연락처 관계: 본인
```

### **6. 광고 관리 시스템 (백오피스 전용)**

#### **광고 등록 폼**
```
📢 광고 등록

[매물 선택] [드롭다운 ▼]
├── 롯데캐슬이스트폴 (102동 4704호)
├── 광진하우스토리 (101동 802호)
└── ...

[광고 번호] [텍스트 입력] (예: AD-2025-001)
[광고 상태] [드롭다운 ▼] (활성, 비활성, 만료, 삭제)
[광고 기간] [텍스트 입력] (예: 2025.08.15 ~ 2025.09.15)
[광고 플랫폼] [텍스트 입력] (예: 부동산114, KB부동산)

[광고 등록] [버튼]
```

#### **광고 현황 대시보드**
```
📊 광고 현황

전체 광고: 1,847개
├── 활성: 1,623개 (87.9%)
├── 비활성: 68개 (3.7%)
├── 만료: 156개 (8.4%)
└── 삭제: 0개 (0%)

플랫폼별 분포
├── 부동산114: 892개 (48.3%)
├── KB부동산: 456개 (24.7%)
├── 네이버부동산: 234개 (12.7%)
├── 다음부동산: 156개 (8.5%)
└── 기타: 109개 (5.9%)

담당자별 분포
├── 송효경: 923개 (50.0%)
└── 김예진: 924개 (50.0%)
```

### **7. 검색 및 필터링 시스템**

#### **즉시 검색 (실시간)**
```
[동 검색] → 타이핑하는 즉시 결과 표시
예: "자양" → 자양동 관련 매물 즉시 표시

[매물명 검색] → 타이핑하는 즉시 결과 표시
예: "롯데" → 롯데캐슬이스트폴 등 즉시 표시

[담당자 검색] → 타이핑하는 즉시 결과 표시
예: "박소현" → 박소현 담당 매물 즉시 표시
```

#### **필터 (좌측 사이드바)**
```
🏠 매물종류 (드롭다운)
[전체 ▼]
├── ☐ 아파트
├── ☐ 주상복합
├── ☐ 빌라/연립
├── ☐ 오피스텔
├── ☐ 단독주택
├── ☐ 타운하우스
├── ☐ 빌딩/건물
├── ☐ 사무실/상가
├── ☐ 상가주택
├── ☐ 원룸
├── ☐ 다가구
├── ☐ 한옥
├── ☐ 숙박/콘도
├── ☐ 전원/농가
├── ☐ 공장/창고
├── ☐ 재개발
├── ☐ 재건축
├── ☐ 아파트분양권
├── ☐ 주상복합분양권
├── ☐ 오피스텔분양권
├── ☐ 지식산업센터
└── ☐ 기타

💰 거래유형 (드롭다운)
[전체 ▼]
├── ☐ 분양
├── ☐ 매매
├── ☐ 전세
├── ☐ 월세/렌트
└── ☐ 단기

📊 진행상태 (드롭다운)
[전체 ▼]
├── ☐ 거래가능
├── ☐ 거래완료
├── ☐ 거래보류
└── ☐ 거래철회

👤 담당자 (드롭다운)
[전체 ▼]
├── ☐ 정선혜 (grace@the-realty.co.kr)
├── ☐ 박소현 (sso@the-realty.co.kr)
├── ☐ 송영주 (joo@the-realty.co.kr)
├── ☐ 정윤식 (yun@the-realty.co.kr)
├── ☐ 성은미 (mimi@the-realty.co.kr)
├── ☐ 서을선 (sun@the-realty.co.kr)
├── ☐ 서지혜 (kylie@the-realty.co.kr)
└── ☐ 김효석 (seok@the-realty.co.kr)

☑️ 공유여부
☐ 공유된 매물만 보기

📢 광고 상태 (백오피스/관리자만)
☐ 광고 등록됨
☐ 광고 미등록
☐ 광고 활성
☐ 광고 비활성
☐ 광고 만료
```

#### **정렬 옵션**
```
정렬: 최신순 | 가격순 | 면적순 | 등록일순 | 담당자순
```

---

## 🚀 개발 로드맵

### **Phase 1: 기반 시스템 구축 (1-2주차)**
- [ ] Supabase 프로젝트 설정
- [ ] 사용자 인증 시스템 구축
- [ ] 데이터베이스 스키마 설계 및 생성
- [ ] CSV 데이터 import 및 정리
- [ ] 기본 CRUD API 개발 (Supabase Edge Functions)

### **Phase 2: 사용자 인증 및 권한 (3-4주차)**
- [ ] Supabase Auth 설정
- [ ] 사용자 테이블 생성 및 초기 데이터 삽입
- [ ] 역할 기반 권한 시스템 구현
- [ ] 로그인/로그아웃 기능
- [ ] 권한별 접근 제어 (RLS)

### **Phase 3: 매물 관리 시스템 (5-6주차)**
- [ ] React 프로젝트 설정
- [ ] 매물 목록 테이블 컴포넌트 개발
- [ ] 담당자별 매물 등록/수정
- [ ] 권한 기반 UI 구현
- [ ] 매물 상세 뷰 개발

### **Phase 4: 검색 및 필터링 (7-8주차)**
- [ ] 검색 시스템 구현 (동, 매물명, 담당자 실시간 검색)
- [ ] 필터링 시스템 구현 (매물종류, 거래유형, 진행상태, 담당자, 공유여부)
- [ ] 정렬 기능 구현
- [ ] 페이지네이션 구현

### **Phase 5: 매물 등록 폼 (9-10주차)**
- [ ] 매물 등록 폼 컴포넌트 개발
- [ ] 드롭다운, 체크박스, 텍스트 입력 필드 구현
- [ ] 폼 검증 및 에러 처리
- [ ] 파일 업로드 기능 (사진, 영상, 문서)

### **Phase 6: 광고 관리 시스템 (11-12주차)**
- [ ] 백오피스 전용 광고 관리
- [ ] 광고 번호 입력 시스템
- [ ] 광고 현황 대시보드
- [ ] 광고 통계 및 리포트

### **Phase 7: 관리자 기능 (13-14주차)**
- [ ] 소유자 정보 관리
- [ ] 사용자 관리
- [ ] 시스템 통계
- [ ] 관리자 대시보드

### **Phase 8: 완성 및 최적화 (15-16주차)**
- [ ] 반응형 디자인 최적화
- [ ] 사용자 경험 개선
- [ ] 성능 최적화
- [ ] 테스트 및 버그 수정
- [ ] 배포 및 문서화

---

## 🎯 핵심 기능 요약

### **1. 사용자 인증 및 권한**
- ✅ 4단계 권한 체계 (관리자, 마케팅, 백오피스, 일반담당자)
- ✅ 역할 기반 데이터 접근 제어
- ✅ 보안 강화된 API 엔드포인트

### **2. 매물 등록**
- ✅ 16행 구성의 완전한 입력 폼
- ✅ 드롭다운 (매물종류, 거래유형, 진행상태, 담당자)
- ✅ 체크박스 (공유여부)
- ✅ 텍스트 입력 (나머지 모든 필드)
- ✅ 파일 업로드 (사진, 영상, 문서)

### **3. 매물 검색**
- ✅ 실시간 검색 (동, 매물명, 담당자)
- ✅ 필터링 (매물종류, 거래유형, 진행상태, 담당자, 공유여부)
- ✅ 정렬 (최신순, 가격순, 면적순, 등록일순, 담당자순)

### **4. 매물 관리**
- ✅ 리스트 뷰 (테이블 형태)
- ✅ 상세 뷰 (권한별 표시)
- ✅ 담당자별 수정/삭제 기능
- ✅ 권한 기반 UI 표시

### **5. 광고 관리**
- ✅ 백오피스 전용 광고 등록/관리
- ✅ 광고 번호 입력 시스템
- ✅ 광고 현황 대시보드
- ✅ 광고 통계 및 리포트

### **6. 보안 및 관리**
- ✅ 소유자 정보 관리자 전용 접근
- ✅ Row Level Security (RLS) 구현
- ✅ 사용자 관리 및 권한 설정
- ✅ 시스템 통계 및 모니터링

### **7. 사용자 경험**
- ✅ 반응형 디자인 (모바일/데스크톱)
- ✅ 직관적인 UI/UX
- ✅ 빠른 검색 및 필터링
- ✅ 권한별 맞춤형 대시보드

---

## 🛠️ 기술 스택

### **Frontend**
- **React 18** + **TypeScript**
- **Tailwind CSS** (스타일링)
- **React Hook Form** (폼 관리)
- **React Query** (데이터 페칭)
- **React Router** (라우팅)
- **Framer Motion** (애니메이션)

### **Backend**
- **Supabase** (데이터베이스)
- **Supabase Auth** (사용자 인증)
- **Supabase Edge Functions** (API)
- **PostgreSQL** (데이터베이스 엔진)
- **Row Level Security** (데이터 보안)

### **Deployment**
- **Vercel** (프론트엔드 배포)
- **Supabase** (백엔드 호스팅)
- **GitHub Actions** (CI/CD)

---

## 📋 다음 단계

### **즉시 진행할 작업**
1. **Supabase 프로젝트 설정**
2. **사용자 인증 시스템 구축**
3. **데이터베이스 스키마 생성**
4. **CSV 데이터 import**
5. **React 프로젝트 초기 설정**

### **검토 필요 사항**
1. **UI/UX 디자인 상세화**
2. **데이터 검증 규칙 정의**
3. **파일 업로드 정책 설정**
4. **사용자 권한 세부 정책**
5. **광고 관리 워크플로우**
6. **백업 및 복구 정책**

---

## 🎉 결론

**부동산 매물 관리 시스템의 상세 기획이 완료되었습니다!**

현재 상태:
- ✅ 시스템 구조 설계 완료
- ✅ 사용자 역할 및 권한 체계 완성
- ✅ UI/UX 설계 완료
- ✅ 데이터베이스 스키마 설계 완료
- ✅ 보안 및 권한 관리 정책 수립 완료
- ✅ 광고 관리 시스템 설계 완료
- ✅ 개발 로드맵 수립 완료

**핵심 특징:**
1. **역할 기반 권한 시스템** - 4단계 권한 체계로 데이터 보안 강화
2. **백오피스 전용 광고 관리** - 광고 등록 및 관리 시스템
3. **담당자별 매물 관리** - 실제 직원 구조 반영
4. **보안 강화** - 소유자 정보 관리자 전용 접근
5. **사용자 친화적 UI** - 권한별 맞춤형 대시보드

**다음 단계**: Supabase 프로젝트 설정 및 사용자 인증 시스템 구축 시작!

---

*작성일: 2025-08-16*  
*버전: 2.0*  
*작성자: AI Assistant*  
*프로젝트: 부동산 매물 관리 시스템*
*특징: 역할 기반 권한 시스템, 백오피스 광고 관리*
