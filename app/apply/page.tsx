import { prisma } from "@/lib/prisma";
import { Store } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import VendorTabbedApplicationForm from "@/components/events/VendorTabbedApplicationForm";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

async function getEvents() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.event.findMany({
      where: { isPublished: true, isUpcoming: true },
      orderBy: { date: "asc" },
      select: { id: true, title: true, slug: true, date: true, location: true },
    });
  } catch (error) {
    console.error("Apply page data fetch failed:", error);
    return [];
  }
}

export default async function ApplyPage() {
  const [events, settings] = await Promise.all([getEvents(), getSiteSettings()]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-36 px-4 overflow-hidden">
          <div className="absolute inset-0 gradient-bg"></div>
          <div className="absolute inset-0 grid-pattern opacity-30"></div>
          <div className="absolute inset-0 noise-overlay"></div>
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-purple-500/8 rounded-full blur-[120px] float"></div>
          <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-3s" }}></div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-glow text-white/70 text-xs uppercase tracking-[0.2em] mb-8 fade-in-down">
              <Store size={14} />
              <span>Vendor Registration</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 fade-in-up">
              Apply to Be a <span className="text-gradient">Vendor</span>
            </h1>
            <p className="text-lg text-white/50 fade-in-up" style={{ animationDelay: "0.1s" }}>
              Select your event below and complete the application form.
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        {/* Event picker */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-40 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>

          <div className="relative max-w-4xl mx-auto">
            <VendorTabbedApplicationForm
              events={events.map((event) => ({
                ...event,
                date: event.date.toISOString(),
              }))}
            />
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
