# Pop Events Reference-Site Clone Design

## Goal

Replace the current Pop Events application with a faithful, responsive recreation of `https://popeventskw.com/`. The new public experience will match the reference site's content, colors, images, typography, spacing, page structure, and interactions as closely as practical while remaining a native Next.js application.

## Scope

The replacement includes the complete reference experience:

- A one-page homepage with the black navigation bar, full-width photographic hero, centered Pop Events logo and message, service badges, cream About section, black vendor callout, and cream Contact section.
- A separate vendor-registration page matching the reference layout, event selector, form fields, document uploads, submission button, and footer.
- Responsive layouts for desktop, tablet, and mobile.
- Local copies of the reference site's publicly served visual assets so the deployed site does not depend on hotlinking the reference.
- Working homepage contact and vendor-application submissions using only the server-side support required by those forms.

The current events catalog, portfolio, About page, Contact page, admin panel, settings system, and other unrelated public experiences are removed from the shipped site. Obsolete code and dependencies may be deleted when they are no longer needed by the replacement.

## Visual Design

The design is intentionally inherited from the reference rather than reinterpreted:

- Near-black navigation, hero overlays, CTA card, buttons, and footer.
- Warm cream and muted gold content backgrounds.
- Bright yellow accent for primary calls to action and thin section dividers.
- Heavy rounded display typography for headings and clean sans-serif body copy.
- The same hero/event photograph and Pop Events logo assets exposed by the reference site.
- Wide centered content bounds, generous vertical whitespace, soft rounded corners, and restrained borders.
- No additional sections, decorative effects, or alternate brand treatments.

## Page Structure

### Homepage (`/`)

1. Header with logo, Contact anchor, and Vendor Register button.
2. Full-height hero with the Pop Events logo, family-day-out message, and four service badges.
3. About section containing “Who We Are” and “We Make Events Happen in Kuwait.”
4. Vendor CTA card linking to the registration page.
5. Contact section containing the reference copy, email, Kuwait City location, phone numbers, and a compact contact form.
6. Reference-style footer if present in the source at the inspected viewport.

### Vendor Registration (`/register`)

1. Black header with wordmark and Back to Home link.
2. Hero banner using the shared event photograph, yellow eyebrow, title, and supporting copy.
3. Event selector for Kuwait Coffee Festival and The Big Fest.
4. White application card containing business details, category, description, and four required document inputs.
5. Submit action and the 3–5 business-day review message.
6. Black footer with Pop Events copyright.

The legacy `/register.html` path will redirect to `/register` so links matching the reference continue to work.

## Behavior and Data Flow

- Navigation links use ordinary Next.js routes and a smooth homepage anchor for Contact.
- Switching the selected event updates the application heading and the submitted event value without navigating away.
- Required fields and documents receive client-side validation before submission.
- Forms show submitting, success, and failure states without disrupting the visual design.
- Server handlers accept the contact message and vendor application. Existing project email/upload infrastructure may be reused where it cleanly supports these forms; unrelated database/admin behavior will not be retained.
- Uploaded documents are validated for allowed type and size before storage or delivery.

## Error Handling

- Form validation errors appear beside the relevant field.
- Network or server failures produce a concise inline retry message.
- Missing optional configuration does not break page rendering; it produces a clear server-side form error.
- Image assets include usable fallbacks and descriptive alternative text.

## Verification

- Compare desktop and mobile screenshots with the reference for layout, color, typography, imagery, and spacing.
- Verify header links, Contact scrolling, event switching, required-field validation, uploads, and form status states.
- Verify `/register.html` redirects correctly.
- Run lint/type checks available in the project and a production build.
- Confirm that obsolete public and admin routes are no longer exposed.

## Acceptance Criteria

The work is complete when the application presents the same two-page experience as the reference site, uses the same visible branding and assets, behaves correctly at common responsive widths, successfully builds for production, and contains no remaining user-facing elements from the previous multi-page design.
