-- Migration: prepare for standardized Kakao address + numeric prices
-- Non-breaking: keeps existing text fields; adds nullable normalized columns

-- 1) Add normalized address columns (aligned with Kakao/road address model)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS address_road text,               -- 도로명주소(전체)
  ADD COLUMN IF NOT EXISTS address_jibun text,              -- 지번주소(전체)
  ADD COLUMN IF NOT EXISTS address_bcode text,              -- 법정동 코드
  ADD COLUMN IF NOT EXISTS address_bname text,              -- 법정동 명
  ADD COLUMN IF NOT EXISTS address_si text,                 -- 시/도
  ADD COLUMN IF NOT EXISTS address_gu text,                 -- 구/군
  ADD COLUMN IF NOT EXISTS address_dong text,               -- 동/읍/면(정규화)
  ADD COLUMN IF NOT EXISTS address_building_name text,      -- 건물명
  ADD COLUMN IF NOT EXISTS latitude numeric(10,7),          -- 위도
  ADD COLUMN IF NOT EXISTS longitude numeric(10,7);         -- 경도

-- 2) Add numeric price columns (optional per transaction type)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS sale_price_krw bigint,           -- 매매/분양가
  ADD COLUMN IF NOT EXISTS jeonse_deposit_krw bigint,       -- 전세 보증금
  ADD COLUMN IF NOT EXISTS wolse_deposit_krw bigint,        -- 월세 보증금
  ADD COLUMN IF NOT EXISTS wolse_monthly_krw bigint;        -- 월세

-- 3) Indexes for new fields
CREATE INDEX IF NOT EXISTS idx_properties_address_road_trgm
  ON public.properties USING gin (address_road gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_address_jibun_trgm
  ON public.properties USING gin (address_jibun gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_address_bcode
  ON public.properties (address_bcode);
CREATE INDEX IF NOT EXISTS idx_properties_address_parts
  ON public.properties (address_si, address_gu, address_dong);
CREATE INDEX IF NOT EXISTS idx_properties_lat_lng
  ON public.properties (latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_properties_sale_price
  ON public.properties (sale_price_krw);
CREATE INDEX IF NOT EXISTS idx_properties_jeonse
  ON public.properties (jeonse_deposit_krw);
CREATE INDEX IF NOT EXISTS idx_properties_wolse
  ON public.properties (wolse_deposit_krw, wolse_monthly_krw);

-- 4) Update search function to include normalized address fields (signature unchanged)
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
    COALESCE(p.building_dong, p.address_dong) AS building_dong,
    p.building_ho,
    COALESCE(p.address_road, p.address_jibun, p.address) AS address,
    p.updated_at
  FROM public.properties AS p
  WHERE
    (
      q IS NULL OR q = '' OR (
        p.property_name ILIKE '%' || q || '%'
        OR p.address ILIKE '%' || q || '%'
        OR p.address_road ILIKE '%' || q || '%'
        OR p.address_jibun ILIKE '%' || q || '%'
        OR p.building_dong ILIKE '%' || q || '%'
        OR p.address_dong ILIKE '%' || q || '%'
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

-- Notes:
-- - Existing frontend/backend keep working (same function signature and output columns)
-- - When Kakao address is integrated later, write to address_* columns and optionally leave `address` for back-compat
-- - When numeric prices are ready, populate *_krw columns; future sorts/filters can use these columns without migration churn
