export const VENDOR_EVENTS = ["Kuwait Coffee Festival", "The Big Fest"] as const;
export const VENDOR_CATEGORIES = [
  "Specialty Coffee",
  "Food & Beverages",
  "Merchandise & Apparel",
  "Arts & Crafts",
  "Beauty & Wellness",
  "Other",
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const vendorFileTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(input: Record<string, unknown>) {
  const value = {
    name: text(input.name),
    email: text(input.email),
    subject: text(input.subject),
    message: text(input.message),
  };

  if (Object.values(value).some((field) => !field)) return { error: "Complete all fields." } as const;
  if (!emailPattern.test(value.email)) return { error: "Enter a valid email address." } as const;
  if (value.name.length > 100 || value.subject.length > 160 || value.message.length > 3000) {
    return { error: "One or more fields are too long." } as const;
  }
  return { value } as const;
}

export function validateVendorFields(input: Record<string, unknown>) {
  const value = {
    event: text(input.event),
    businessName: text(input.businessName),
    contactPerson: text(input.contactPerson),
    email: text(input.email),
    phone: text(input.phone),
    category: text(input.category),
    description: text(input.description),
    instagram: text(input.instagram),
  };

  const required = [value.event, value.businessName, value.contactPerson, value.email, value.phone, value.category, value.description];
  if (required.some((field) => !field)) return { error: "Complete all required fields." } as const;
  if (!VENDOR_EVENTS.includes(value.event as (typeof VENDOR_EVENTS)[number])) return { error: "Select a valid event." } as const;
  if (!VENDOR_CATEGORIES.includes(value.category as (typeof VENDOR_CATEGORIES)[number])) return { error: "Select a valid vendor category." } as const;
  if (!emailPattern.test(value.email)) return { error: "Enter a valid email address." } as const;
  return { value } as const;
}

export function validateVendorFile(file: { size: number; type: string }) {
  if (!vendorFileTypes.has(file.type) || file.size > 10 * 1024 * 1024) {
    return "Documents must be PDF, JPG, PNG, or WebP files up to 10 MB.";
  }
  return null;
}
