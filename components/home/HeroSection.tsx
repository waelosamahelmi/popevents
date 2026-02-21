"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  companyName?: string | null;
  tagline?: string | null;
}

export default function HeroSection({ companyName, tagline }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for low opacity effect */}
        <div className="absolute inset-0 bg-black/70"></div>
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>
      </div>

      {/* Animated grain / noise overlay */}
      <div className="absolute inset-0 noise-overlay z-[1]"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-[16%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] float"></div>
      <div className="absolute bottom-1/4 right-[16%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] float" style={{ animationDelay: "-3s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pulse-glow-slow"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className={`mt-10 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="inline-block hero-logo-glow">
            <Image
              src="/darkmodelogo.png"
              alt={companyName || "Pop Events"}
              width={500}
              height={125}
              className="h-20 md:h-32 w-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Hidden heading for SEO */}
        <h1 className="sr-only">
          {companyName || "POP EVENTS"}
        </h1>

        {/* Tagline */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl sm:text-2xl md:text-4xl text-white/70 mb-4 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            {tagline || "Your Premier Event Partner in Kuwait"}
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-6 mb-6"></div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-5 justify-center items-center transition-all duration-1000 delay-[900ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/events"
            className="group relative px-10 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white via-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10 flex items-center gap-2">
              View Upcoming Events
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </Link>

          <Link
            href="/portfolio"
            className="group px-10 py-4 glass-glow text-white rounded-full font-semibold text-lg transition-all duration-500 hover:bg-white/15 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Play size={18} className="group-hover:scale-110 transition-transform duration-300" />
              View Portfolio
            </span>
          </Link>
        </div>

        {/* Stats with animated counters */}
        <div className={`mt-10 transition-all duration-1000 delay-[1100ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-transform duration-300 group-hover:scale-110">
                50<span className="text-amber-400">+</span>
              </div>
              <div className="text-white/40 text-sm uppercase tracking-widest">Events</div>
            </div>
            <div className="text-center group cursor-default relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-transform duration-300 group-hover:scale-110">
                100K<span className="text-amber-400">+</span>
              </div>
              <div className="text-white/40 text-sm uppercase tracking-widest">Attendees</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-transform duration-300 group-hover:scale-110">
                200<span className="text-amber-400">+</span>
              </div>
              <div className="text-white/40 text-sm uppercase tracking-widest">Exhibitors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-[1300ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/30 text-xs uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(0,0%,3%)] to-transparent z-[2]"></div>
    </section>
  );
}
