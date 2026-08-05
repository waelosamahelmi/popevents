import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
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
              <MessageCircle size={14} />
              <span>Reach Out</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 fade-in-up">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Have an event idea or need operational support in Kuwait? We&apos;d love to hear from you.
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        <ContactPageClient settings={settings} />
      </main>

      <Footer settings={settings} />
    </>
  );
}
