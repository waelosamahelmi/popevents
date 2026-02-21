# Pop Events Kuwait — Full-Stack Next.js Application

## Project Overview

Pop Events is a Kuwait-based event management company that organizes festivals, exhibitions, and community events (including Coffee Festival and more). This is a complete Next.js application with a public-facing website and a full admin panel, deployed to Vercel.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Supabase (hosted)
- **ORM:** Prisma
- **Auth:** NextAuth.js (credentials provider for admin login)
- **File Storage:** Supabase Storage (for images, uploaded documents/licenses)
- **Email:** Resend (for receiving registration notifications)
- **Deployment:** Vercel
- **UI Components:** shadcn/ui

## Environment Variables

```env
DATABASE_URL=             # Supabase PostgreSQL connection string
DIRECT_URL=               # Supabase direct connection (for Prisma migrations)
NEXTAUTH_SECRET=          # Random secret for NextAuth
NEXTAUTH_URL=             # App URL (http://localhost:3000 in dev)
ADMIN_EMAIL=              # Admin login email
ADMIN_PASSWORD_HASH=      # bcrypt-hashed admin password
SUPABASE_URL=             # Supabase project URL
SUPABASE_ANON_KEY=        # Supabase anon/public key
SUPABASE_SERVICE_KEY=     # Supabase service role key (server-side only)
RESEND_API_KEY=           # Resend API key
NOTIFICATION_EMAIL=       # Email that receives registration notifications
```

---

## Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Event {
  id            String         @id @default(cuid())
  title         String
  slug          String         @unique
  description   String         @db.Text
  date          DateTime
  endDate       DateTime?
  location      String
  mapUrl        String?        // Google Maps embed URL
  coverImage    String         // URL from Supabase Storage
  isUpcoming    Boolean        @default(true)
  isPublished   Boolean        @default(true)
  maxCapacity   Int?
  registrations Registration[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Registration {
  id              String   @id @default(cuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  fullName        String
  email           String
  phone           String
  companyName     String?
  licenseFileUrl  String?  // uploaded license/permit file URL
  additionalNotes String?  @db.Text
  status          String   @default("pending") // pending, approved, rejected
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PortfolioItem {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  eventName   String?  // which event this is from
  images      String[] // array of Supabase Storage URLs
  sortOrder   Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteSettings {
  id            String  @id @default("main")
  companyName   String  @default("Pop Events")
  tagline       String? @default("Your Premier Event Partner in Kuwait")
  aboutText     String? @db.Text
  email         String?
  phone         String?
  whatsapp      String?
  instagram     String?
  tiktok        String?
  twitter       String?
  address       String?
  mapEmbedUrl   String?
  logoUrl       String?
  heroImageUrl  String?
  updatedAt     DateTime @updatedAt
}
```

---

## Application Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout with metadata, fonts
│   ├── page.tsx                    # Homepage
│   ├── events/
│   │   ├── page.tsx                # All upcoming events listing
│   │   └── [slug]/
│   │       ├── page.tsx            # Single event detail page
│   │       └── register/
│   │           └── page.tsx        # Registration form for this event
│   ├── portfolio/
│   │   └── page.tsx                # Portfolio/gallery grid
│   ├── about/
│   │   └── page.tsx                # About page
│   ├── contact/
│   │   └── page.tsx                # Contact page with form
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout with sidebar nav
│   │   ├── page.tsx                # Admin dashboard (stats overview)
│   │   ├── events/
│   │   │   ├── page.tsx            # List/manage events
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Create event form
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit event form
│   │   ├── registrations/
│   │   │   ├── page.tsx            # All registrations table
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Single registration detail
│   │   ├── portfolio/
│   │   │   ├── page.tsx            # Manage portfolio items
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Add portfolio item
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit portfolio item
│   │   └── settings/
│   │       └── page.tsx            # Edit site settings & contact info
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts        # NextAuth API route
│   │   ├── events/
│   │   │   ├── route.ts            # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET, PUT, DELETE single event
│   │   ├── registrations/
│   │   │   ├── route.ts            # GET (list), POST (create — public)
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET, PUT (update status), DELETE
│   │   ├── portfolio/
│   │   │   ├── route.ts            # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET, PUT, DELETE
│   │   ├── settings/
│   │   │   └── route.ts            # GET, PUT
│   │   ├── upload/
│   │   │   └── route.ts            # POST — handle file uploads to Supabase Storage
│   │   └── contact/
│   │       └── route.ts            # POST — public contact form → sends email via Resend
│   └── login/
│       └── page.tsx                # Admin login page
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.tsx              # Public site navbar
│   │   ├── Footer.tsx              # Public site footer
│   │   ├── AdminSidebar.tsx        # Admin sidebar navigation
│   │   └── AdminHeader.tsx         # Admin top bar with logout
│   ├── events/
│   │   ├── EventCard.tsx           # Event card for listings
│   │   ├── EventForm.tsx           # Reusable event create/edit form
│   │   └── RegistrationForm.tsx    # Public registration form
│   ├── portfolio/
│   │   ├── PortfolioGrid.tsx       # Masonry/grid gallery
│   │   ├── PortfolioItem.tsx       # Single portfolio card
│   │   └── PortfolioForm.tsx       # Admin create/edit portfolio form
│   ├── home/
│   │   ├── HeroSection.tsx         # Homepage hero
│   │   ├── UpcomingEvents.tsx      # Featured upcoming events
│   │   ├── PortfolioPreview.tsx    # Portfolio highlights
│   │   └── CTASection.tsx          # Call to action
│   └── shared/
│       ├── ImageUploader.tsx       # Drag & drop image upload component
│       ├── FileUploader.tsx        # File upload (for licenses/docs)
│       ├── LoadingSpinner.tsx
│       ├── ConfirmDialog.tsx       # Delete confirmation modal
│       └── DataTable.tsx           # Reusable admin data table
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── supabase.ts                 # Supabase client init
│   ├── auth.ts                     # NextAuth config
│   ├── email.ts                    # Resend email helpers
│   ├── upload.ts                   # File upload utility functions
│   └── utils.ts                    # General utilities (slug generation, formatting)
├── hooks/
│   ├── useEvents.ts                # SWR/React Query hook for events
│   └── useSettings.ts             # Hook for site settings
└── types/
    └── index.ts                    # Shared TypeScript types/interfaces
```

---

## Public Website Pages

### Homepage (`/`)
- Hero section with full-width background image, company name, tagline, and CTA button ("View Upcoming Events")
- Section showing upcoming events (max 3 cards) with "View All" link
- Portfolio preview section (latest 6 images in a grid) with "View Gallery" link
- CTA section ("Want to participate in our next event? Register now")
- Footer with contact info, social links, and quick nav

### Events Page (`/events`)
- Grid of all upcoming published events as cards
- Each card: cover image, title, date, location, short description, "Register" button
- Past events section below (collapsed/expandable) showing completed events

### Event Detail Page (`/events/[slug]`)
- Full cover image at top
- Event title, date/time, location with map embed
- Full description (rich text rendered from markdown or HTML)
- "Register for this Event" prominent button
- If event is past or full: show appropriate message instead of register button

### Registration Page (`/events/[slug]/register`)
- Clean form with fields: Full Name, Email, Phone, Company Name (optional), Upload License/Permit (file upload, optional), Additional Notes
- On submit: save to database, upload files to Supabase Storage, send notification email via Resend to the admin
- Show success confirmation message after submission

### Portfolio Page (`/portfolio`)
- Masonry grid or responsive grid layout showing all portfolio items
- Each item: image(s), title, event name overlay
- Click to open a lightbox or expanded view showing all images + description

### About Page (`/about`)
- Company story and description (pulled from SiteSettings.aboutText)
- Team/brand values section

### Contact Page (`/contact`)
- Contact form (name, email, subject, message) — sends email via Resend
- Display: email, phone, WhatsApp link, address, map embed
- Social media links (Instagram, TikTok, Twitter)

---

## Admin Panel Pages

### Admin Login (`/login`)
- Simple email/password form
- Authenticates via NextAuth credentials provider
- Redirects to `/admin` on success
- All `/admin/*` routes are protected by middleware — redirect to `/login` if unauthenticated

### Dashboard (`/admin`)
- Stats cards: Total Events, Upcoming Events, Total Registrations, Pending Registrations
- Recent registrations table (last 10)
- Quick action buttons: Create Event, View Portfolio

### Events Management (`/admin/events`)
- Data table listing all events with columns: Title, Date, Status (upcoming/past), Published, Registration Count, Actions (edit/delete)
- "Create New Event" button → `/admin/events/new`
- Edit/delete actions on each row
- Create/Edit form includes: title, slug (auto-generated from title, editable), description (textarea with markdown support), date, end date, location, map URL, cover image upload, capacity, isPublished toggle

### Registrations Management (`/admin/registrations`)
- Data table with all registrations: Name, Email, Phone, Event, Status, Date, Actions
- Filter by event (dropdown), filter by status (pending/approved/rejected)
- Click on a registration → detail view showing all info + uploaded license file (with download link)
- Ability to change status (approve/reject) and delete
- Export to CSV button

### Portfolio Management (`/admin/portfolio`)
- Grid/list of portfolio items with drag-to-reorder (sortOrder)
- Create/edit form: title, description, event name, multi-image upload (up to 10 images per item), published toggle
- Delete with confirmation

### Site Settings (`/admin/settings`)
- Single form to edit all SiteSettings fields
- Sections: General (company name, tagline, about text), Contact (email, phone, WhatsApp, address), Social Media (Instagram, TikTok, Twitter), Branding (logo upload, hero image upload), Map (embed URL)
- Save button at bottom

---

## API Design

All admin API routes must verify the NextAuth session. Public routes (GET events, GET portfolio, POST registration, POST contact) do not require auth.

### File Upload (`POST /api/upload`)
- Accepts multipart form data
- Uploads to Supabase Storage in organized buckets/folders:
  - `events/` — event cover images
  - `portfolio/` — portfolio images
  - `registrations/` — uploaded license/permit files
  - `site/` — logo, hero image
- Returns the public URL of the uploaded file
- Validate file types (images: jpg/png/webp, documents: pdf/jpg/png) and max size (10MB)

### Email Notifications (via Resend)
- On new registration: Send email to NOTIFICATION_EMAIL with registration details and link to admin panel
- On contact form: Send email to NOTIFICATION_EMAIL with the message content

---

## Design & Branding Guidelines

- **Primary Color:** Use a vibrant, energetic color scheme suitable for an events company. Suggest: deep purple (#6B21A8) as primary with coral/orange (#F97316) as accent. These can be adjusted later.
- **Style:** Modern, clean, bold. The website should feel exciting and professional — this is an events company.
- **Typography:** Use Inter or Plus Jakarta Sans from Google Fonts
- **Responsive:** Fully responsive — mobile-first approach. Many users will access from phones.
- **Animations:** Subtle entrance animations on scroll using Framer Motion (optional, not required for MVP)
- **Dark mode:** Not needed for MVP

---

## Implementation Notes

1. **Start with the database** — set up Prisma schema, run migrations, seed with sample data (1-2 events, a few portfolio items, default site settings).

2. **Build API routes first** — all CRUD operations for events, registrations, portfolio, settings, and upload.

3. **Build the admin panel** — this is the core functionality. Make sure all CRUD operations work properly before polishing the public site.

4. **Build the public pages** — use server components where possible for SEO. The homepage, events listing, and portfolio should be server-rendered.

5. **Registration form** — this is critical. Must work reliably with file upload and email notification. Test thoroughly.

6. **Middleware** — create `middleware.ts` at the root to protect `/admin/*` routes. Check for valid NextAuth session; redirect to `/login` if missing.

7. **Image optimization** — use Next.js `<Image>` component throughout. Configure `next.config.js` to allow Supabase Storage domain in `images.remotePatterns`.

8. **Slug generation** — auto-generate URL slugs from event titles. Allow manual editing. Ensure uniqueness.

9. **Seed script** — create `prisma/seed.ts` with default SiteSettings and a couple of sample events so the app works out of the box.

10. **Error handling** — all API routes should have proper try/catch with meaningful error responses. All forms should show validation errors and loading states.

---

## Deployment (Vercel)

- Connect the GitHub repo to Vercel
- Set all environment variables in Vercel dashboard
- Prisma: add `postinstall` script in package.json: `"postinstall": "prisma generate"`
- Supabase Storage: create buckets (`events`, `portfolio`, `registrations`, `site`) and set appropriate public/private access policies
- Set up Resend domain verification for email sending

---

## Seed Data

Create a seed script that inserts:
- Default SiteSettings with company name "Pop Events", placeholder tagline, and empty contact fields
- 2 sample upcoming events (e.g., "Kuwait Coffee Festival 2026", "Food & Art Market 2026")
- 3 sample portfolio items with placeholder descriptions
- This ensures the app has content to display immediately after deployment

---

## Commands Reference

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev --name init
npx prisma db seed

# Run development server
npm run dev

# Build for production
npm run build

# Generate Prisma client
npx prisma generate
```

---

## Priority Order

1. Prisma schema + migrations + seed
2. Auth setup (NextAuth + middleware)
3. API routes (all CRUD + upload + email)
4. Admin layout + sidebar
5. Admin dashboard
6. Admin events CRUD pages
7. Admin registrations management
8. Admin portfolio management
9. Admin site settings
10. Public homepage
11. Public events + registration
12. Public portfolio
13. Public about + contact
14. Polish, responsive fixes, loading states
