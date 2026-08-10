import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate URL-friendly slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-KW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Format date and time for display
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-KW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Check if event is upcoming
export function isEventUpcoming(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

// Downscale + re-encode an image File in the browser so large phone photos
// don't blow past the serverless request-body limit (Vercel caps it at
// ~4.5 MB, which four raw iPhone photos exceed on their own → HTTP 413).
// Non-images (e.g. PDFs) and anything that fails to decode are returned as-is.
export async function compressImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.72,
): Promise<File> {
  if (typeof document === "undefined" || !file.type.startsWith("image/")) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // Can't decode (e.g. HEIC on some browsers) — send the original.
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob || blob.size >= file.size) return file; // No win — keep the smaller original.

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

// POST to a form endpoint and read the response defensively. A failing
// serverless function can return a platform HTML error page (500/504) instead
// of JSON; calling response.json() on that throws an opaque parser error
// ("The string did not match the expected pattern" on Safari/iOS). Read the
// body as text and only then attempt to parse it, so callers always get a
// meaningful message.
export async function submitForm(
  url: string,
  init: RequestInit,
  fallbackError = 'Something went wrong. Please try again.',
): Promise<{ ok: boolean; data: { error?: string; success?: boolean } }> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const text = await response.text();
  let data: { error?: string; success?: boolean } = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON body — the server likely crashed or timed out.
      throw new Error(response.ok ? fallbackError : `Server error (${response.status}). Please try again.`);
    }
  }

  if (!response.ok) throw new Error(data.error || fallbackError);
  return { ok: true, data };
}
