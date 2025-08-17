-- Create search_properties RPC function for the new Supabase project
-- This function allows searching properties with pagination and filtering

CREATE OR REPLACE FUNCTION public.search_properties(
  p_search text DEFAULT NULL,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_property_type text DEFAULT NULL,
  p_transaction_type text DEFAULT NULL,
  p_price_min numeric DEFAULT NULL,
  p_price_max numeric DEFAULT NULL,
  p_area_min numeric DEFAULT NULL,
  p_area_max numeric DEFAULT NULL,
  p_shared_status boolean DEFAULT NULL,
  p_property_status text DEFAULT NULL
)
RETURNS TABLE (
  id text,
  property_name text,
  property_type text,
  transaction_type text,
  price text,
  area text,
  address text,
  agent text,
  registration_date text,
  shared_status boolean,
  property_status text,
  total_count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH filtered_properties AS (
    SELECT 
      p.id::text,
      p.property_name,
      p.property_type,
      p.transaction_type,
      p.price,
      p.area,
      p.address,
      p.agent,
      p.registration_date,
      p.shared_status,
      p.property_status
    FROM properties p
    WHERE 
      (p_search IS NULL OR 
       p.property_name ILIKE '%' || p_search || '%' OR
       p.address ILIKE '%' || p_search || '%' OR
       p.agent ILIKE '%' || p_search || '%'
      )
      AND (p_property_type IS NULL OR p.property_type = p_property_type)
      AND (p_transaction_type IS NULL OR p.transaction_type = p_transaction_type)
      AND (p_shared_status IS NULL OR p.shared_status = p_shared_status)
      AND (p_property_status IS NULL OR p.property_status = p_property_status)
      -- Price filtering (assuming price is stored as text, need to handle conversion)
      AND (p_price_min IS NULL OR 
           CASE 
             WHEN p.price ~ '^[0-9]+(\.[0-9]+)?억$' THEN
               CAST(REPLACE(p.price, '억', '') AS numeric) * 100000000 >= p_price_min
             WHEN p.price ~ '^[0-9,]+만원$' THEN
               CAST(REPLACE(REPLACE(p.price, ',', ''), '만원', '') AS numeric) * 10000 >= p_price_min
             ELSE TRUE
           END
      )
      AND (p_price_max IS NULL OR 
           CASE 
             WHEN p.price ~ '^[0-9]+(\.[0-9]+)?억$' THEN
               CAST(REPLACE(p.price, '억', '') AS numeric) * 100000000 <= p_price_max
             WHEN p.price ~ '^[0-9,]+만원$' THEN
               CAST(REPLACE(REPLACE(p.price, ',', ''), '만원', '') AS numeric) * 10000 <= p_price_max
             ELSE TRUE
           END
      )
      -- Area filtering (assuming area is stored as text with '평' suffix)
      AND (p_area_min IS NULL OR 
           CASE 
             WHEN p.area ~ '^[0-9]+평$' THEN
               CAST(REPLACE(p.area, '평', '') AS numeric) >= p_area_min
             ELSE TRUE
           END
      )
      AND (p_area_max IS NULL OR 
           CASE 
             WHEN p.area ~ '^[0-9]+평$' THEN
               CAST(REPLACE(p.area, '평', '') AS numeric) <= p_area_max
             ELSE TRUE
           END
      )
    ORDER BY p.registration_date DESC NULLS LAST
  ),
  counted_properties AS (
    SELECT *, COUNT(*) OVER() AS total_count
    FROM filtered_properties
  )
  SELECT *
  FROM counted_properties
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.search_properties TO anon;
GRANT EXECUTE ON FUNCTION public.search_properties TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_properties TO service_role;

-- Create an index to improve search performance
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties 
  USING gin (
    to_tsvector('simple', coalesce(property_name, '') || ' ' || 
                         coalesce(address, '') || ' ' || 
                         coalesce(agent, ''))
  );

-- Create additional indexes for filtering
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_transaction ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(property_status);
CREATE INDEX IF NOT EXISTS idx_properties_shared ON properties(shared_status);
CREATE INDEX IF NOT EXISTS idx_properties_registration ON properties(registration_date DESC NULLS LAST);