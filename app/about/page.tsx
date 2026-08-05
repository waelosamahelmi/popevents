import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await getSiteSettings();

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
              <Info size={14} />
              <span>Who We Are</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 fade-in-up">
              Who <span className="text-gradient">We Are</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              We Make Events Happen in Kuwait
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        {/* Content */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-40 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>

          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-10 fade-in-up border border-white/5">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                We Make Events Happen in Kuwait
              </h2>
              <p className="text-white/70 whitespace-pre-wrap text-lg leading-relaxed">
                {settings.aboutText || "Pop Events was set up to bring new ideas and events to Kuwait that everyone can enjoy as a family. We handle everything behind the scenes - from securing your licenses to setting up power, seating, and full event infrastructure - so you can focus on the experience."}
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 md:p-12 fade-in-up border border-white/5" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Are You a Vendor?
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-white/80 mb-5">
                Join Our Network
              </h3>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Register your business, upload your trade license and documents, and become part of the {settings.companyName} vendor family.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
              >
                Register as a Vendor
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
