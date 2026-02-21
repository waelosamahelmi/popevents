// Shared TypeScript types and interfaces

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  mapUrl?: string;
  coverImage: string;
  isUpcoming: boolean;
  isPublished: boolean;
  maxCapacity?: number;
  registrations?: Registration[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  eventId: string;
  event?: Event;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  licenseFileUrl?: string;
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  eventName?: string;
  images: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  companyName: string;
  tagline?: string;
  aboutText?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  address?: string;
  mapEmbedUrl?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  slug?: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  mapUrl?: string;
  coverImage: string;
  isUpcoming?: boolean;
  isPublished?: boolean;
  maxCapacity?: number;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

export interface CreateRegistrationInput {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  licenseFile?: File;
  additionalNotes?: string;
}

export interface CreatePortfolioItemInput {
  title: string;
  description?: string;
  eventName?: string;
  images: string[];
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateSiteSettingsInput extends Partial<Omit<SiteSettings, 'id' | 'updatedAt'>> {}
