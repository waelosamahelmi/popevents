"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              <MessageCircle size={14} />
              <span>Reach Out</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 fade-in-up">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Have a question or want to work together? We&apos;d love to hear from you.
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        {/* Content */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-40 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>
          <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-2s" }}></div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="glass-card rounded-3xl p-8 md:p-12 fade-in-up border border-white/5">
                <h2 className="text-3xl font-bold text-white mb-8">Send us a message</h2>

                {success && (
                  <div className="mb-6 glass-glow rounded-xl p-4 text-green-400 border border-green-500/20">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}

                {error && (
                  <div className="mb-6 glass-glow rounded-xl p-4 text-red-400 border border-red-500/20">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 resize-y hover:border-white/20"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? "Sending..." : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-8 border border-white/5 fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>

                  <div className="space-y-4">
                    <a
                      href="mailto:info@popeventskuwait.com"
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 glass-glow rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Mail size={22} className="text-white/80 group-hover:text-amber-400 transition-colors duration-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Email</p>
                        <p className="text-white/40 group-hover:text-white/70 transition-colors duration-300">
                          info@popeventskuwait.com
                        </p>
                      </div>
                    </a>

                    <a
                      href="tel:+96512345678"
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 glass-glow rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Phone size={22} className="text-white/80 group-hover:text-amber-400 transition-colors duration-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Phone</p>
                        <p className="text-white/40 group-hover:text-white/70 transition-colors duration-300">
                          +965 1234 5678
                        </p>
                      </div>
                    </a>

                    <div className="flex items-start gap-4 p-4 rounded-2xl">
                      <div className="w-12 h-12 glass-glow rounded-xl flex items-center justify-center">
                        <MapPin size={22} className="text-white/80" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Address</p>
                        <p className="text-white/40">
                          Kuwait City, Kuwait
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="glass-card rounded-3xl p-8 border border-white/5 fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <h2 className="text-xl font-bold text-white mb-3">Follow Us</h2>
                  <p className="text-white/40 mb-6">
                    Stay updated with our latest events and announcements
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/popevents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 glass-glow rounded-xl font-medium text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                      <Instagram size={20} />
                      Instagram
                    </a>
                    <a
                      href="https://twitter.com/popevents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 glass-glow rounded-xl font-medium text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                      <Twitter size={20} />
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
