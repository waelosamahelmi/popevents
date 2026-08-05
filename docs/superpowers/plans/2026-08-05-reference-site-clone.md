# Pop Events Reference-Site Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Pop Events site with a native Next.js recreation of the reference homepage and vendor-registration page.

**Architecture:** Keep the existing Next.js App Router shell, replace public rendering with focused components, and store cloned public assets under `public/reference`. Client components own only interactive forms and event selection; server route handlers validate and deliver submissions. A redirect preserves the reference site's `/register.html` URL.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Nodemailer, Supabase Storage

## Global Constraints

- Match `https://popeventskw.com/` in visible content, colors, images, typography, spacing, structure, and responsive behavior.
- Serve copies of the reference site's public images and logos locally.
- Expose only the homepage, vendor registration, and the server routes those forms require.
- Preserve inline success, validation, and failure feedback for both forms.
- Finish with a passing production build and desktop/mobile visual comparison.

---

### Task 1: Reference assets and global visual foundation

**Files:**
- Create: `public/reference/*`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: CSS tokens `--pop-black`, `--pop-cream`, `--pop-gold`, and `--pop-yellow`; local hero and logo paths used by both pages.

- [ ] Inspect the reference DOM, computed styles, and observed page assets to identify exact public asset URLs and key visual values.
- [ ] Download the public hero/logo assets into `public/reference` and verify their file types.
- [ ] Replace legacy global effects with reference-aligned base styles, typography, controls, focus states, and responsive primitives.
- [ ] Update metadata and configuration for the simplified Pop Events site.
- [ ] Run `npx tsc --noEmit` and resolve foundation-level errors.

### Task 2: Faithful one-page homepage

**Files:**
- Modify: `app/page.tsx`
- Create: `components/reference/SiteHeader.tsx`
- Create: `components/reference/ContactForm.tsx`
- Create: `components/reference/HomePage.tsx`
- Modify: `app/api/contact/route.ts`

**Interfaces:**
- `SiteHeader({ compact?: boolean })` renders the shared black header.
- `ContactForm()` posts `{ name, email, subject, message }` to `/api/contact` and renders idle, submitting, success, and failure states.
- `HomePage()` composes the reference hero, About, vendor CTA, and Contact sections.

- [ ] Add focused validation tests through build/type assertions and browser checks for all homepage form fields.
- [ ] Implement the header and exact homepage content hierarchy using semantic sections and local assets.
- [ ] Implement the contact form with required fields, accessible labels, disabled submit state, and inline response feedback.
- [ ] Harden `/api/contact` by trimming values, validating email and lengths, and returning consistent JSON errors.
- [ ] Verify the Contact anchor, Vendor Register link, keyboard focus, and responsive stacking.

### Task 3: Vendor-registration page and submission flow

**Files:**
- Create: `app/register/page.tsx`
- Create: `components/reference/VendorApplicationForm.tsx`
- Create: `app/api/vendor-applications/route.ts`
- Modify: `lib/email.ts`
- Modify: `next.config.ts`

**Interfaces:**
- `VendorApplicationForm()` submits multipart form data with `event`, `businessName`, `contactPerson`, `email`, `phone`, `instagram`, `category`, `description`, `companyLicense`, `healthCertificate`, `civilId`, and `businessLogo`.
- `POST /api/vendor-applications` returns `{ success: true }` or `{ error: string }`.
- `sendVendorApplicationNotification(application)` delivers validated metadata and uploaded document URLs.

- [ ] Implement the two-event selector and exact form field/document hierarchy from the reference.
- [ ] Add client validation for required text fields, email, category, file presence, allowed MIME types, and maximum size.
- [ ] Implement server multipart validation, upload the four documents to registration storage, and send the notification.
- [ ] Add visible submitting, success, and error states while preserving the reference layout.
- [ ] Add a permanent redirect from `/register.html` to `/register` and verify it.

### Task 4: Remove legacy site surfaces

**Files:**
- Delete: legacy public/admin pages and components not consumed by the clone
- Modify: `middleware.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: a route tree limited to `/`, `/register`, `/register.html` redirect, and required form APIs.

- [ ] Use `rg` to map imports and identify files that are no longer reachable.
- [ ] Remove obsolete pages, admin middleware behavior, and unused components without deleting shared form infrastructure still in use.
- [ ] Remove dependencies only when `rg` confirms they have no remaining imports.
- [ ] Run `npx tsc --noEmit` and `npm run build`; fix all errors.

### Task 5: Visual and functional verification

**Files:**
- Modify as required by comparison findings.

**Interfaces:**
- Consumes: the complete local application and the live reference screenshots.
- Produces: verified desktop and mobile implementations.

- [ ] Start the production-capable local server and inspect `/` and `/register` in the browser.
- [ ] Capture full-page desktop screenshots and compare section dimensions, colors, typography, assets, and spacing with the reference.
- [ ] Repeat at a mobile viewport and correct overflow, wrapping, navigation, and form layout differences.
- [ ] Exercise links, event switching, validation, redirect, and safe form failure/success behavior.
- [ ] Run the final `npx tsc --noEmit` and `npm run build`, inspect `git diff --check`, and report the exact verification results.
