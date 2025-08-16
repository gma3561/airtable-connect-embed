-- Performance optimization for Supabase
-- Run this in Supabase SQL Editor to improve search performance

-- Add composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_properties_status_type_updated 
ON public.properties (property_status, property_type, updated_at DESC);

-- Add index for agent filter with updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_properties_agent_updated 
ON public.properties (agent, updated_at DESC);

-- Add index for shared_status filter with updated_at
CREATE INDEX IF NOT EXISTS idx_properties_shared_updated 
ON public.properties (shared_status, updated_at DESC);

-- Optimize the search function for better performance
CREATE OR REPLACE FUNCTION public.search_properties(
  q text DEFAULT NULL,
  f_property_type text DEFAULT NULL,
  f_transaction_type text DEFAULT NULL,
  f_property_status text DEFAULT NULL,
  f_agent text DEFAULT NULL,
  f_shared_only boolean DEFAULT NULL,
  limit_count int DEFAULT 100,
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
    -- Optimized text search
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