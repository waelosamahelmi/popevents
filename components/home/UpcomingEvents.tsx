"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { useEffect, useRef, useState } from "react";

interface UpcomingEventsProps {
  events: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    date: Date;
    location: string;
    coverImage: string;
  }>;
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Floating accent orbs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>
      <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-4s" }}></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-glow text-white/70 text-xs uppercase tracking-[0.2em] mb-6">
            <Calendar size={14} />
            <span>Don&apos;t Miss Out</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Upcoming <span className="text-gradient">Events</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover and join our upcoming events. Experience the best festivals,
            exhibitions, and community gatherings in Kuwait.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className={`text-center py-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="glass-card rounded-3xl p-16 max-w-lg mx-auto border border-white/5">
              <Sparkles size={40} className="text-white/20 mx-auto mb-6" />
              <p className="text-white/50 text-lg">
                No upcoming events at the moment.
              </p>
              <p className="text-white/30 text-sm mt-2">Check back soon for exciting new events!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {events.length > 0 && (
          <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/events"
              className="group inline-flex items-center gap-3 px-10 py-4 glass-glow rounded-full text-white font-semibold text-lg transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:gap-5 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              View All Events
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>
  );
}
