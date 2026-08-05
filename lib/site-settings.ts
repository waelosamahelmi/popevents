import { prisma } from "@/lib/prisma";

export type PublicSiteSettings = {
  id: string;
  companyName: string;
  tagline?: string | null;
  aboutText?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  address?: string | null;
  mapEmbedUrl?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
};

export const defaultSiteSettings: PublicSiteSettings = {
  id: "main",
  companyName: "Pop Events",
  tagline:
    "Bringing fresh ideas and exciting new events to Kuwait - designed for everyone to enjoy as a family day out.",
  aboutText:
    "Pop Events was set up to bring new ideas and events to Kuwait that everyone can enjoy as a family.",
  email: "info@popeventskuwait.com",
  phone: "+965 9983 9299 / +965 9444 2746",
  whatsapp: "",
  instagram: "",
  tiktok: "",
  twitter: "",
  address: "Kuwait City, Kuwait",
  mapEmbedUrl: "",
  logoUrl: "",
  heroImageUrl: "",
};

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  if (!process.env.DATABASE_URL) {
    return defaultSiteSettings;
  }

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
      select: {
        id: true,
        companyName: true,
        tagline: true,
        aboutText: true,
        email: true,
        phone: true,
        whatsapp: true,
        instagram: true,
        tiktok: true,
        twitter: true,
        address: true,
        mapEmbedUrl: true,
        logoUrl: true,
        heroImageUrl: true,
      },
    });

    if (!settings) {
      return defaultSiteSettings;
    }

    return {
      ...defaultSiteSettings,
      ...settings,
    };
  } catch (error) {
    console.error("Site settings fetch failed:", error);
    return defaultSiteSettings;
  }
}
