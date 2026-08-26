-- Partner categories become admin-managed, edited as free text in
-- Admin -> Homepage alongside the expertise list, so the fixed Postgres enum
-- has to go. Product.category shares the same enum and the same picker in
-- VendorProfileForm, so both columns convert together.

-- 1. Widen to text. USING keeps every existing value verbatim.
ALTER TABLE "VendorProfile" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;
ALTER TABLE "Product"       ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;

-- 2. Rewrite the SCREAMING_CASE enum members to the labels the UI already
--    displayed for them. Stored values now match the admin list exactly, the
--    way expertise strings already do, so no lookup table is needed to render
--    them. ELSE keeps anything unrecognised untouched rather than nulling it.
UPDATE "VendorProfile" SET "category" = CASE "category"
  WHEN 'TECHNOLOGY'      THEN 'Technology'
  WHEN 'ARCHITECTURE'    THEN 'Architecture'
  WHEN 'INTERIOR_DESIGN' THEN 'Interior Design'
  WHEN 'HVAC'            THEN 'HVAC'
  WHEN 'PROCUREMENT'     THEN 'Procurement'
  WHEN 'SECURITY'        THEN 'Security'
  WHEN 'MARKETING'       THEN 'Marketing'
  WHEN 'RECRUITMENT'     THEN 'Recruitment'
  WHEN 'CONSULTING'      THEN 'Consulting'
  WHEN 'LEGAL'           THEN 'Legal'
  WHEN 'FINANCE'         THEN 'Finance'
  ELSE "category"
END;

UPDATE "Product" SET "category" = CASE "category"
  WHEN 'TECHNOLOGY'      THEN 'Technology'
  WHEN 'ARCHITECTURE'    THEN 'Architecture'
  WHEN 'INTERIOR_DESIGN' THEN 'Interior Design'
  WHEN 'HVAC'            THEN 'HVAC'
  WHEN 'PROCUREMENT'     THEN 'Procurement'
  WHEN 'SECURITY'        THEN 'Security'
  WHEN 'MARKETING'       THEN 'Marketing'
  WHEN 'RECRUITMENT'     THEN 'Recruitment'
  WHEN 'CONSULTING'      THEN 'Consulting'
  WHEN 'LEGAL'           THEN 'Legal'
  WHEN 'FINANCE'         THEN 'Finance'
  ELSE "category"
END;

-- 3. Nothing references the type any more.
DROP TYPE IF EXISTS "MarketplaceCategory";
