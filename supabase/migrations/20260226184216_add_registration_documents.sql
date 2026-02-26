-- Migration: Add registration document fields
-- Created: 2026-02-26T18:42:16+02:00

-- Add new columns to Registration table
ALTER TABLE "Registration" 
  ADD COLUMN IF NOT EXISTS "companyLicenseUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "signatureUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "civilIdUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "healthLicenseUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;

-- Update companyName to be TEXT type for longer names
ALTER TABLE "Registration" 
  ALTER COLUMN "companyName" TYPE TEXT USING "companyName"::TEXT;
