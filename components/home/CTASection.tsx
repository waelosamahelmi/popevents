"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star, Zap, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CTASection() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Large animated orbs */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px] float"></div>
      <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[120px] float" style={{ animationDelay: "-3s" }}></div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-[15%] text-white/5 float" style={{ animationDelay: "-1s" }}>
        <Star size={60} />
      </div>
      <div className="absolute bottom-32 right-[12%] text-white/5 float" style={{ animationDelay: "-4s" }}>
        <Zap size={50} />
      </div>
      <div className="absolute top-1/2 left-[8%] text-white/5 float" style={{ animationDelay: "-2s" }}>
        <Heart size={40} />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Sparkle Icon */}
        <div className={`mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl glass-glow pulse-glow-slow">
            <Sparkles size={40} className="text-amber-400" />
          </div>
        </div>

        {/* Heading */}
        <h2 className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          Ready to be part of something{" "}
          <span className="text-gradient">amazing</span>?
        </h2>

        {/* Description */}
        <p className={`text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Join thousands of attendees and exhibitors at Kuwait&apos;s premier events.
          Whether you&apos;re looking to participate or showcase your brand, we have
          the perfect platform for you.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-5 justify-center items-center transition-all duration-1000 delay-[600ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/events"
            className="group relative px-10 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-100 via-white to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10 flex items-center gap-2">
              Register for Events
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </Link>

          <Link
            href="/contact"
            className="group px-10 py-4 glass-glow text-white rounded-full font-semibold text-lg transition-all duration-500 hover:bg-white/15 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Get in Touch
          </Link>
        </div>

        {/* Trust indicators */}
        <div className={`mt-20 pt-12 border-t border-white/5 transition-all duration-1000 delay-[800ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-8">Trusted by leading brands</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-30 hover:opacity-50 transition-opacity duration-700">
            <div className="text-white/60 font-bold text-lg tracking-widest">STARBUCKS</div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-white/60 font-bold text-lg tracking-widest">APPLE</div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-white/60 font-bold text-lg tracking-widest">NIKE</div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-white/60 font-bold text-lg tracking-widest">SONY</div>
          </div>
        </div>
      </div>
    </section>
  );
}
