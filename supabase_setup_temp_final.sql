-- Setup for Supabase project: temp-final
-- Includes: MVP schema + trigram search + normalized Kakao address + numeric prices

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2) Core table: properties (text-first for MVP)
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_type text,
  transaction_type text,
  property_status text,
  agent text,

  property_name text,
  address text,
  building_dong text,
  building_ho text,

  price text,
  contract_period text,
  rental_amount text,
  rental_type text,
  resident text,
  completion_date text,
  reregistration_reason text,
  agent_memo text,
  special_notes text,

  registration_date date,
  shared_status boolean DEFAULT false,
  photos text[],
  videos text[],
  documents text[],

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Updated-at trigger
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

-- 4) Search indexes (trigram + helpers)
CREATE INDEX IF NOT EXISTS idx_properties_property_name_trgm
  ON public.properties USING gin (property_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_address_trgm
  ON public.properties USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_building_dong_trgm
  ON public.properties USING gin (building_dong gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_agent_trgm
  ON public.properties USING gin (agent gin_trgm_ops);
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

-- 5) Normalized Kakao address + numeric price columns (nullable for gradual adoption)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS address_road text,
  ADD COLUMN IF NOT EXISTS address_jibun text,
  ADD COLUMN IF NOT EXISTS address_bcode text,
  ADD COLUMN IF NOT EXISTS address_bname text,
  ADD COLUMN IF NOT EXISTS address_si text,
  ADD COLUMN IF NOT EXISTS address_gu text,
  ADD COLUMN IF NOT EXISTS address_dong text,
  ADD COLUMN IF NOT EXISTS address_building_name text,
  ADD COLUMN IF NOT EXISTS latitude numeric(10,7),
  ADD COLUMN IF NOT EXISTS longitude numeric(10,7),
  ADD COLUMN IF NOT EXISTS sale_price_krw bigint,
  ADD COLUMN IF NOT EXISTS jeonse_deposit_krw bigint,
  ADD COLUMN IF NOT EXISTS wolse_deposit_krw bigint,
  ADD COLUMN IF NOT EXISTS wolse_monthly_krw bigint;

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

-- 6) Search function (includes normalized address in search; signature stable)
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

-- 7) Smoke test (optional)
-- INSERT INTO public.properties (property_name, address, agent, property_status, property_type, transaction_type, registration_date, shared_status)
-- VALUES ('테스트매물', '자양동 680-63', '박소현', '거래가능', '아파트', '월세/렌트', CURRENT_DATE, true);
-- SELECT * FROM public.search_properties('자양');
