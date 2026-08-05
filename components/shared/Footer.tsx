import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Twitter, Music2 } from "lucide-react";

interface FooterProps {
  settings?: {
    companyName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
  } | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const companyName = settings?.companyName?.trim() || "Pop Events";
  const contactEmail = settings?.email?.trim() || "info@popeventskuwait.com";
  const contactPhone = settings?.phone?.trim() || "+965 9983 9299 / +965 9444 2746";
  const contactAddress = settings?.address?.trim() || "Kuwait City, Kuwait";

  return (
    <footer className="relative border-t border-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/darkmodelogo.png"
                alt="Pop Events"
                width={140}
                height={35}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Bringing fresh ideas and exciting new events to Kuwait, designed
              for everyone to enjoy as a family day out.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/events"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  {contactEmail}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  {contactPhone}
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  {contactAddress}
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings?.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <Music2 size={18} />
                </a>
              )}
              <a
                href="/contact"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Contact"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {currentYear} {companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
