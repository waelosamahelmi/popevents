import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date;
  location: string;
  coverImage: string;
}

export default function EventCard({
  id,
  title,
  slug,
  description,
  date,
  location,
  coverImage,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${slug}`}
      className="group block"
    >
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-white/20">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Date badge */}
          <div className="absolute top-4 left-4 px-4 py-2 glass rounded-full">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <Calendar size={16} />
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/80 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <MapPin size={16} />
            <span>{location}</span>
          </div>

          <p className="text-white/60 text-sm line-clamp-2 mb-4">
            {description}
          </p>

          <div className="flex items-center text-white text-sm font-medium group-hover:gap-3 transition-all">
            <span>Learn More</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
