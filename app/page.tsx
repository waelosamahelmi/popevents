import { prisma } from "@/lib/prisma";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import CTASection from "@/components/home/CTASection";

export const dynamic = 'force-dynamic';

async function getHomePageData() {
  const [upcomingEvents, portfolioItems, settings] = await Promise.all([
    prisma.event.findMany({
      where: { isUpcoming: true, isPublished: true },
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.portfolioItem.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" },
    }),
  ]);

  return { upcomingEvents, portfolioItems, settings };
}

export default async function HomePage() {
  const { upcomingEvents, portfolioItems, settings } = await getHomePageData();

  return (
    <>
      <Navbar />

      <main>
        <HeroSection
          companyName={settings?.companyName}
          tagline={settings?.tagline}
        />

        <ServicesSection />

        <UpcomingEvents events={upcomingEvents} />

        <PortfolioPreview items={portfolioItems} />

        <CTASection />
      </main>

      <Footer settings={settings} />
    </>
  );
}
