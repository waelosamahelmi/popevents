import { db } from "@/lib/db";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import EventCard from "@/components/events/EventCard";
import { Calendar, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getEvents() {
  const [upcomingRes, pastRes] = await Promise.all([
    db.from('Event').select('*').eq('isUpcoming', true).eq('isPublished', true).order('date', { ascending: true }),
    db.from('Event').select('*').eq('isUpcoming', false).eq('isPublished', true).order('date', { ascending: false }),
  ]);

  return { upcomingEvents: upcomingRes.data || [], pastEvents: pastRes.data || [] };
}

export default async function EventsPage() {
  const { upcomingEvents, pastEvents } = await getEvents();

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
              <Calendar size={14} />
              <span>Explore Events</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 fade-in-up">
              Our <span className="text-gradient">Events</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Discover amazing festivals, exhibitions, and community events in Kuwait
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-20 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>

          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-14 fade-in-up">
              <div className="w-12 h-12 rounded-2xl glass-glow flex items-center justify-center">
                <Calendar size={22} className="text-amber-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Upcoming Events
              </h2>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-20 fade-in-up">
                <div className="glass-card rounded-3xl p-16 max-w-lg mx-auto border border-white/5">
                  <Calendar size={40} className="text-white/15 mx-auto mb-6" />
                  <p className="text-white/50 text-lg">
                    No upcoming events at the moment.
                  </p>
                  <p className="text-white/30 text-sm mt-2">Check back soon for exciting new events!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute bottom-20 left-[5%] w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-4s" }}></div>

            <div className="relative max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-14 fade-in-up">
                <div className="w-12 h-12 rounded-2xl glass-glow flex items-center justify-center">
                  <Clock size={22} className="text-white/60" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Past Events
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
