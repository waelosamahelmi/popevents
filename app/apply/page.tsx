import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const dynamic = "force-dynamic";

// Pick an emoji for an event based on its title (coffee / fest / default).
function eventEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("coffee")) return "☕";
  if (t.includes("fest")) return "🎖";
  return "🎪";
}

async function getEvents() {
  return prisma.event.findMany({
    where: { isPublished: true, isUpcoming: true },
    orderBy: { date: "asc" },
    select: { id: true, title: true, slug: true, date: true, location: true },
  });
}

export default async function ApplyPage() {
  const events = await getEvents();

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
              <span>Vendors</span>
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

          <div className="relative max-w-4xl mx-auto">
            {events.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center border border-white/5">
                <p className="text-white/50">
                  No events are currently accepting vendor applications. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {events.map((event, i) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}/register`}
                    className="group glass-card rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] fade-in-up"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    <div className="text-5xl mb-6">{eventEmoji(event.title)}</div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gradient transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-white/40 mb-6">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      &bull; {event.location}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white/70 font-medium group-hover:gap-3 transition-all">
                      Apply now <ArrowRight size={18} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
