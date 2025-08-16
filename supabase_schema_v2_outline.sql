-- V2 Outline: roles/users, owner privacy, advertisements (non-breaking from MVP)
-- This file models future expansion while keeping MVP `properties` intact.

-- 1) Users and roles
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin','marketing','backoffice','agent')),
  is_active boolean NOT NULL DEFAULT true,
  last_login timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Properties minimal foreign key to users (optional, nullable to keep compatibility)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id);

-- 3) Advertisements (backoffice)
CREATE TABLE IF NOT EXISTS public.advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  ad_number text NOT NULL,
  ad_status text NOT NULL DEFAULT '활성' CHECK (ad_status IN ('활성','비활성','만료','삭제')),
  ad_period text,
  ad_platform text,
  backoffice_user_id uuid NOT NULL REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(property_id, ad_number)
);

-- 4) Owner info (admin-only)
CREATE TABLE IF NOT EXISTS public.property_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL UNIQUE REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_name text NOT NULL,
  owner_contact text NOT NULL,
  registration_number text NOT NULL,
  contact_relationship text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5) Indexes
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_property_id ON public.advertisements(property_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_backoffice_user_id ON public.advertisements(backoffice_user_id);
CREATE INDEX IF NOT EXISTS idx_property_owners_property_id ON public.property_owners(property_id);
