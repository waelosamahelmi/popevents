"use client";

import { Palette, Users, Mic, Camera, Globe, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const services = [
  {
    icon: Palette,
    title: "Event Design",
    description: "Bespoke event concepts that bring your vision to life with stunning aesthetics.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Seamless registration, check-in, and attendee engagement solutions.",
  },
  {
    icon: Mic,
    title: "Entertainment",
    description: "Top-tier performers, DJs, and entertainment acts for every occasion.",
  },
  {
    icon: Camera,
    title: "Coverage",
    description: "Professional photography and videography to capture every moment.",
  },
  {
    icon: Globe,
    title: "Exhibitions",
    description: "Large-scale exhibitions and trade shows with global reach.",
  },
  {
    icon: Gift,
    title: "Brand Activations",
    description: "Creative brand experiences that leave lasting impressions.",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const updateScrollState = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    setCanScrollLeft(slider.scrollLeft > 10);
    setCanScrollRight(slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10);

    // Determine active index based on scroll position
    const cardWidth = slider.firstElementChild ? (slider.firstElementChild as HTMLElement).offsetWidth + 16 : 1;
    const index = Math.round(slider.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, services.length - 1));
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => slider.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = slider.firstElementChild ? (slider.firstElementChild as HTMLElement).offsetWidth + 16 : 300;
    slider.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  // Auto-scroll
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-glow text-white/70 text-xs uppercase tracking-[0.2em] mb-6">
            <Palette size={14} />
            <span>What We Do</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            From concept to execution, we deliver world-class event experiences.
          </p>
        </div>

        {/* Slider */}
        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            className={`absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-glow flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-glow flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={22} />
          </button>

          {/* Slider track */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group relative flex-shrink-0 w-[280px] sm:w-[320px] p-8 rounded-3xl glass-card border border-white/5 snap-start transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl glass-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon size={26} className="text-white/80 group-hover:text-amber-400 transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm group-hover:text-white/60 transition-colors duration-500">
                    {service.description}
                  </p>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const slider = sliderRef.current;
                  if (!slider || !slider.firstElementChild) return;
                  const cardWidth = (slider.firstElementChild as HTMLElement).offsetWidth + 16;
                  slider.scrollTo({ left: cardWidth * index, behavior: "smooth" });
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "w-8 bg-white/80"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>
  );
}
