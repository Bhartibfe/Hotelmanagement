/**
 * The shared profile forms (HotelOwnerProfileForm, VendorProfileForm, and the
 * admin edit modal that reuses them) name their inputs after how they read on
 * screen rather than after the columns they land in. Nothing mapped between the
 * two, so those fields arrived as `undefined` and were silently discarded while
 * the request still returned 200.
 *
 * Normalising here — at the API boundary — fixes every submission path at once
 * (profile completion, resubmission, admin edit, shared-link submit and edit
 * draft approval) and keeps accepting the canonical names, so any caller that
 * already sends `title`/`city`/`vendorProfile` continues to work unchanged.
 *
 * `??` rather than `||` so that clearing a field to "" is preserved instead of
 * being treated as "not supplied".
 */

/** User column -> the form field name it arrives under. */
const USER_FIELD_ALIASES: Record<string, string> = {
  title: "designation",
  city: "headquartersCity",
  state: "headquartersState",
  organizationName: "companyName",
  businessOverview: "companyDescription",
};

/**
 * VendorProfileForm submits its company fields flat (plus a nested `compliance`
 * object), but every route reads them from a nested `vendorProfile`. Without
 * this, the entire VendorProfile record was skipped on save.
 * VendorProfile column -> form field name.
 */
const VENDOR_PROFILE_ALIASES: Record<string, string> = {
  companyName: "companyName",
  description: "companyDescription",
  category: "category",
  logo: "logo",
  website: "websiteUrl",
  yearEstablished: "yearEstablished",
  previousClients: "previousClients",
  caseStudies: "caseStudyUrls",
  certifications: "certifications",
};

/** VendorProfile column -> field name inside the form's `compliance` object. */
const VENDOR_COMPLIANCE_ALIASES: Record<string, string> = {
  gstNumber: "gstNumber",
  panNumber: "panNumber",
  msmeRegistration: "msmeNumber",
  tradeLicense: "tradeLicense",
  isoCertification: "isoCertification",
  dunsNumber: "dunsNumber",
  annualTurnover: "annualTurnover",
  hotelClientsServed: "hotelClientsServed",
  serviceRegions: "serviceRegions",
  insuranceDetails: "insuranceDetails",
};

/** VendorProfile.employeeCount is a String column, but the form parses it to a number. */
const toNullableString = (value: unknown): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return String(value);
};

const buildVendorProfile = (body: Record<string, any>): Record<string, any> => {
  const vp: Record<string, any> = {};
  for (const [column, formField] of Object.entries(VENDOR_PROFILE_ALIASES)) {
    if (body[formField] !== undefined) vp[column] = body[formField];
  }

  const compliance = body.compliance;
  if (compliance && typeof compliance === "object") {
    for (const [column, formField] of Object.entries(VENDOR_COMPLIANCE_ALIASES)) {
      if (compliance[formField] !== undefined) vp[column] = compliance[formField];
    }
  }

  const employeeCount = toNullableString(body.employeeCount);
  if (employeeCount !== undefined) vp.employeeCount = employeeCount;

  return vp;
};

export const normalizeProfileFields = <T extends Record<string, any>>(body: T): T => {
  if (!body || typeof body !== "object") return body;

  const normalized: Record<string, any> = { ...body };

  for (const [column, formField] of Object.entries(USER_FIELD_ALIASES)) {
    normalized[column] = body[column] ?? body[formField];
  }

  // Only synthesise when the caller did not already send the nested shape, so
  // callers using the canonical payload are untouched. The routes apply this
  // solely for memberType VENDOR, so it is inert for other member types.
  if (!body.vendorProfile) {
    const vendorProfile = buildVendorProfile(body);
    if (Object.keys(vendorProfile).length > 0) normalized.vendorProfile = vendorProfile;
  }

  return normalized as T;
};
