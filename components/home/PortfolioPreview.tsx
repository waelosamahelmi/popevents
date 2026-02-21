"use client";

import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PortfolioPreviewProps {
  items: Array<{
    id: string;
    title: string;
    eventName?: string | null;
    images: string[];
  }>;
}

export default function PortfolioPreview({ items }: PortfolioPreviewProps) {
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

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Accent orbs */}
      <div className="absolute top-40 left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] float" style={{ animationDelay: "-2s" }}></div>
      <div className="absolute bottom-20 right-[5%] w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-5s" }}></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-glow text-white/70 text-xs uppercase tracking-[0.2em] mb-6">
            <Camera size={14} />
            <span>Our Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Our <span className="text-gradient">Portfolio</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            A glimpse into our past events and the unforgettable experiences
            we&apos;ve created.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item, index) => {
            return (
              <Link
                key={item.id}
                href="/portfolio"
                className={`
                  group relative rounded-xl overflow-hidden glass-card border border-white/5
                  aspect-[4/3]
                  transition-all duration-700 hover:border-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-[1.02]
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                `}
                style={{ transitionDelay: `${300 + index * 80}ms` }}
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-sm md:text-base font-bold text-white truncate opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.title}
                  </h3>
                  {item.eventName && (
                    <p className="text-white/50 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {item.eventName}
                    </p>
                  )}
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 px-10 py-4 glass-glow rounded-full text-white font-semibold text-lg transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:gap-5 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            View Full Gallery
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>
  );
}
