import { db } from "@/lib/db";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import CTASection from "@/components/home/CTASection";

export const dynamic = 'force-dynamic';

async function getHomePageData() {
  const [eventsRes, portfolioRes, settingsRes] = await Promise.all([
    db.from('Event').select('*').eq('isUpcoming', true).eq('isPublished', true).order('date', { ascending: true }).limit(3),
    db.from('PortfolioItem').select('*').eq('isPublished', true).order('sortOrder', { ascending: true }).limit(6),
    db.from('SiteSettings').select('*').eq('id', 'main').single(),
  ]);

  return {
    upcomingEvents: eventsRes.data || [],
    portfolioItems: portfolioRes.data || [],
    settings: settingsRes.data,
  };
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
