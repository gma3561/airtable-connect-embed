-- Supabase MVP schema for properties + search (unstructured-friendly)
-- Goal: allow mixed text/numeric inputs; enable fast partial-match search

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2) Core table: properties (all user-entered fields are text-friendly)
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- loosely-typed categorical fields (kept as text for MVP)
  property_type text,            -- e.g., 아파트, 오피스텔, ... (free text allowed)
  transaction_type text,         -- e.g., 매매, 전세, 월세/렌트, ...
  property_status text,          -- e.g., 거래가능, 거래완료, ...
  agent text,                    -- 담당자명(자유 입력)

  -- main display/search fields
  property_name text,            -- 매물명
  address text,                  -- 소재지 (자양동 680-63 등)
  building_dong text,            -- 동 (텍스트 허용: 102, A, 1동 ...)
  building_ho text,              -- 호 (텍스트 허용: 4704, 802호 ...)

  -- other free-text fields (kept as-is for MVP)
  price text,                    -- 금액 원문 (예: 2억/1000, 1,050, 17억)
  contract_period text,          -- 계약기간 원문 (예: 25.08~26.08)
  rental_amount text,            -- 임차금액 원문 (예: 0/1050)
  rental_type text,              -- 임차유형 원문
  resident text,                 -- 거주자
  completion_date text,          -- 거래완료날짜 원문 (포맷 다양)
  reregistration_reason text,    -- 재등록사유
  agent_memo text,               -- 담당자 메모
  special_notes text,            -- 특이사항

  -- meta
  registration_date date,        -- 등록일 (가능하면 날짜로 입력)
  shared_status boolean DEFAULT false,  -- 공유여부
  photos text[],                 -- 사진 경로/URL 목록 (선택)
  videos text[],                 -- 영상 경로/URL 목록 (선택)
  documents text[],              -- 문서 경로/URL 목록 (선택)

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Simple updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_properties_updated_at ON public.properties;
CREATE TRIGGER trg_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) Search indexes (trigram for partial matches)
-- Note: gin_trgm_ops enables fast ILIKE '%q%' searches
CREATE INDEX IF NOT EXISTS idx_properties_property_name_trgm
  ON public.properties USING gin (property_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_address_trgm
  ON public.properties USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_building_dong_trgm
  ON public.properties USING gin (building_dong gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_agent_trgm
  ON public.properties USING gin (agent gin_trgm_ops);

-- Additional light indexes for common filters/sorts
CREATE INDEX IF NOT EXISTS idx_properties_registration_date
  ON public.properties (registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_properties_shared_status
  ON public.properties (shared_status);
CREATE INDEX IF NOT EXISTS idx_properties_type
  ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type
  ON public.properties (transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_status
  ON public.properties (property_status);

-- 5) Minimal search function (server-side, cursorless)
-- Accepts a free-text query and optional simple filters; returns a compact list
CREATE OR REPLACE FUNCTION public.search_properties(
  q text DEFAULT NULL,
  f_property_type text DEFAULT NULL,
  f_transaction_type text DEFAULT NULL,
  f_property_status text DEFAULT NULL,
  f_agent text DEFAULT NULL,
  f_shared_only boolean DEFAULT NULL,
  limit_count int DEFAULT 50,
  offset_count int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  registration_date date,
  shared_status boolean,
  agent text,
  property_status text,
  property_type text,
  transaction_type text,
  price text,
  property_name text,
  building_dong text,
  building_ho text,
  address text,
  updated_at timestamptz
) LANGUAGE sql STABLE AS $$
  SELECT
    p.id,
    p.registration_date,
    p.shared_status,
    p.agent,
    p.property_status,
    p.property_type,
    p.transaction_type,
    p.price,
    p.property_name,
    p.building_dong,
    p.building_ho,
    p.address,
    p.updated_at
  FROM public.properties AS p
  WHERE
    -- free text query across core fields
    (
      q IS NULL OR q = '' OR (
        p.property_name ILIKE '%' || q || '%'
        OR p.address ILIKE '%' || q || '%'
        OR p.building_dong ILIKE '%' || q || '%'
        OR p.agent ILIKE '%' || q || '%'
      )
    )
    AND (f_property_type IS NULL OR p.property_type = f_property_type)
    AND (f_transaction_type IS NULL OR p.transaction_type = f_transaction_type)
    AND (f_property_status IS NULL OR p.property_status = f_property_status)
    AND (f_agent IS NULL OR p.agent = f_agent)
    AND (
      f_shared_only IS NULL OR (f_shared_only = true AND p.shared_status = true) OR (f_shared_only = false)
    )
  ORDER BY p.updated_at DESC NULLS LAST, p.registration_date DESC NULLS LAST
  LIMIT GREATEST(limit_count, 0)
  OFFSET GREATEST(offset_count, 0);
$$;

-- 6) Example queries (for reference)
-- SELECT * FROM public.search_properties('자양', NULL, NULL, '거래가능', NULL, NULL, 50, 0);
-- SELECT * FROM public.search_properties(NULL, '아파트', NULL, NULL, NULL, true, 100, 0);
