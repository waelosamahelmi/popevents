import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, ClipboardList } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RegistrationForm from "@/components/events/RegistrationForm";

export const dynamic = 'force-dynamic';

async function getEvent(slug: string) {
  const { data } = await db.from('Event').select('*').eq('slug', slug).single();
  return data;
}

export default async function EventRegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event || !event.isPublished) {
    notFound();
  }

  const isPast = new Date(event.date) < new Date();
  const { count } = await db.from('Registration').select('*', { count: 'exact', head: true }).eq('eventId', event.id);
  const isFull = event.maxCapacity && (count || 0) >= event.maxCapacity;

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
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 mb-6 transition-colors duration-300 fade-in-down"
            >
              <ArrowLeft size={18} />
              Back to Event
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-glow text-white/70 text-xs uppercase tracking-[0.2em] mb-8 fade-in-down block">
              <ClipboardList size={14} />
              <span>Registration</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 fade-in-up">
              Register for <span className="text-gradient">{event.title}</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
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
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        {/* Form */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-40 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>

          <div className="relative max-w-2xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 fade-in-up">
              {isPast ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 glass-glow rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon size={28} className="text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    This Event Has Passed
                  </h3>
                  <p className="text-white/40 mb-8">
                    Registration is closed for this event.
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02]"
                  >
                    View Upcoming Events
                  </Link>
                </div>
              ) : isFull ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 glass-glow rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList size={28} className="text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Event Fully Booked
                  </h3>
                  <p className="text-white/40 mb-8">
                    This event has reached maximum capacity.
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02]"
                  >
                    View Other Events
                  </Link>
                </div>
              ) : (
                <RegistrationForm
                  eventId={event.id}
                  eventName={event.title}
                  eventDate={event.date}
                  eventLocation={event.location}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
