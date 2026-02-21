"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Expand, Layers } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  eventName?: string | null;
  images: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

export default function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{ itemIndex: number; imageIndex: number } | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  // Get unique event names for filtering
  const eventNames = Array.from(new Set(items.map((item) => item.eventName).filter(Boolean))) as string[];

  const filteredItems = filter === "all" ? items : items.filter((item) => item.eventName === filter);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const cards = gridRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredItems]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightbox) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  const navigateLightbox = useCallback((direction: number) => {
    if (!lightbox) return;
    const currentItem = filteredItems[lightbox.itemIndex];
    const newImageIndex = lightbox.imageIndex + direction;

    if (newImageIndex >= 0 && newImageIndex < currentItem.images.length) {
      setLightbox({ ...lightbox, imageIndex: newImageIndex });
    } else if (direction > 0 && newImageIndex >= currentItem.images.length) {
      // Move to next item
      const nextItem = lightbox.itemIndex + 1;
      if (nextItem < filteredItems.length) {
        setLightbox({ itemIndex: nextItem, imageIndex: 0 });
      }
    } else if (direction < 0 && newImageIndex < 0) {
      // Move to previous item
      const prevItem = lightbox.itemIndex - 1;
      if (prevItem >= 0) {
        setLightbox({ itemIndex: prevItem, imageIndex: filteredItems[prevItem].images.length - 1 });
      }
    }
  }, [lightbox, filteredItems]);



  return (
    <>
      {/* Filter Bar + Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-white/[0.01]"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Filter Pills */}
          {eventNames.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
                  filter === "all"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "glass-glow text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                All Projects
              </button>
              {eventNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setFilter(name)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
                    filter === name
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "glass-glow text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-24">
              <div className="glass-card rounded-3xl p-16 max-w-lg mx-auto border border-white/5">
                <Layers size={48} className="text-white/15 mx-auto mb-6" />
                <p className="text-white/50 text-lg">No portfolio items yet.</p>
                <p className="text-white/30 text-sm mt-2">Check back soon for our latest work!</p>
              </div>
            </div>
          ) : (
            /* Masonry Grid */
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  data-index={index}
                  className={`
                    group relative rounded-xl overflow-hidden glass-card border border-white/5 cursor-pointer
                    aspect-[4/3]
                    transition-all duration-700 hover:border-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
                    ${visibleItems.has(index) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}
                  `}
                  style={{ transitionDelay: `${(index % 8) * 60}ms` }}
                  onClick={() => setLightbox({ itemIndex: index, imageIndex: 0 })}
                >
                  {/* Image */}
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Permanent subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                  {/* Content - always visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-sm md:text-base font-bold text-white mb-0.5 truncate">
                      {item.title}
                    </h3>
                    {item.eventName && (
                      <p className="text-white/50 text-xs truncate">{item.eventName}</p>
                    )}
                  </div>

                  {/* Image count badge */}
                  {item.images.length > 1 && (
                    <div className="absolute top-4 right-4 glass-glow flex items-center gap-1.5 text-white text-xs px-3 py-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      <ImageIcon size={12} />
                      <span>{item.images.length}</span>
                    </div>
                  )}

                  {/* Expand icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full glass-glow flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                    <Expand size={16} className="text-white" />
                  </div>

                  {/* Shine sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && filteredItems[lightbox.itemIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fade-in"></div>

          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full glass-glow flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <X size={24} />
          </button>

          {/* Image info */}
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-white font-bold text-lg">{filteredItems[lightbox.itemIndex].title}</h3>
            {filteredItems[lightbox.itemIndex].eventName && (
              <p className="text-white/50 text-sm">{filteredItems[lightbox.itemIndex].eventName}</p>
            )}
            <p className="text-white/30 text-xs mt-1">
              {lightbox.imageIndex + 1} / {filteredItems[lightbox.itemIndex].images.length}
            </p>
          </div>

          {/* Main image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightbox.itemIndex].images[lightbox.imageIndex]}
              alt={filteredItems[lightbox.itemIndex].title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in"
            />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full glass-glow flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full glass-glow flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnail strip */}
          {filteredItems[lightbox.itemIndex].images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-3 glass-glow rounded-2xl max-w-[90vw] overflow-x-auto">
              {filteredItems[lightbox.itemIndex].images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox({ ...lightbox, imageIndex: i });
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    i === lightbox.imageIndex
                      ? "ring-2 ring-white scale-110"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
