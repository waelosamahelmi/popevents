import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar as CalendarIcon, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const dynamic = 'force-dynamic';

async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  return event;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event || !event.isPublished) {
    notFound();
  }

  const isFull = event.maxCapacity && event._count.registrations >= event.maxCapacity;
  const isPast = new Date(event.date) < new Date();

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        {/* Hero with cover image */}
        <section className="relative h-[450px] md:h-[550px]">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 noise-overlay"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 mb-6 transition-colors duration-300"
              >
                <ArrowLeft size={18} />
                Back to Events
              </Link>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-40 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>
          <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-2s" }}></div>

          <div className="relative max-w-4xl mx-auto">
            {/* Description */}
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 border border-white/5 fade-in-up">
              <div className="text-white/60 whitespace-pre-wrap text-lg leading-relaxed">
                {event.description}
              </div>
            </div>

            {/* Map */}
            {event.mapUrl && (
              <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 fade-in-up" style={{ animationDelay: "0.1s" }}>
                <iframe
                  src={event.mapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}

            {/* CTA */}
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center border border-white/5 fade-in-up" style={{ animationDelay: "0.2s" }}>
              {isPast ? (
                <div>
                  <div className="w-16 h-16 glass-glow rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={28} className="text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    This Event Has Passed
                  </h3>
                  <p className="text-white/40 mb-8 max-w-md mx-auto">
                    Thank you to everyone who attended! Check out our upcoming events.
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                  >
                    View Upcoming Events
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : isFull ? (
                <div>
                  <div className="w-16 h-16 glass-glow rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon size={28} className="text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Event Fully Booked
                  </h3>
                  <p className="text-white/40 mb-8 max-w-md mx-auto">
                    Registration for this event is now closed.
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                  >
                    View Other Events
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : !event.isUpcoming ? (
                <div>
                  <div className="w-16 h-16 glass-glow rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={28} className="text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Registration Not Open
                  </h3>
                  <p className="text-white/40 max-w-md mx-auto">
                    Registration for this event will open soon. Check back later!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Register for This Event
                  </h3>
                  <p className="text-white/40 mb-8 max-w-md mx-auto">
                    Secure your spot by filling out the registration form below.
                  </p>
                  <Link
                    href={`/events/${event.slug}/register`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] text-lg"
                  >
                    Register Now
                    <ArrowRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
