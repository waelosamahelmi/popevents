import { db } from "@/lib/db";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Zap, Users, Award, Target, Info } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getSettings() {
  const { data } = await db.from('SiteSettings').select('*').eq('id', 'main').single();
  return data;
}

export default async function AboutPage() {
  const settings = await getSettings();

  const values = [
    {
      icon: Zap,
      title: "Excellence",
      description: "We deliver exceptional events that exceed expectations",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections and bringing people together",
    },
    {
      icon: Award,
      title: "Quality",
      description: "Committed to delivering the highest quality experiences",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Pushing boundaries with creative event concepts",
    },
  ];

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
              <Info size={14} />
              <span>Who We Are</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 fade-in-up">
              About <span className="text-gradient">Us</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              {settings?.tagline || "Your Premier Event Partner in Kuwait"}
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 fade-in" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </section>

        {/* Content */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-40 right-[5%] w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] float"></div>

          <div className="relative max-w-4xl mx-auto">
            {settings?.aboutText ? (
              <div className="glass-card rounded-3xl p-8 md:p-12 mb-24 fade-in-up border border-white/5">
                <p className="text-white/70 whitespace-pre-wrap text-lg leading-relaxed">
                  {settings.aboutText}
                </p>
              </div>
            ) : (
              <div className="text-center py-20 fade-in-up">
                <div className="glass-card rounded-3xl p-16 max-w-lg mx-auto border border-white/5">
                  <Info size={40} className="text-white/15 mx-auto mb-6" />
                  <p className="text-white/50 text-lg">
                    About content coming soon.
                  </p>
                </div>
              </div>
            )}

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="group glass-card rounded-3xl p-8 border border-white/5 transition-all duration-700 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] fade-in-up"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-2xl glass-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Icon size={26} className="text-white/80 group-hover:text-amber-400 transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] float" style={{ animationDelay: "-2s" }}></div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Events", value: "50+" },
                { label: "Attendees", value: "100K+" },
                { label: "Exhibitors", value: "200+" },
                { label: "Years", value: "5+" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center group cursor-default fade-in-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-transform duration-300 group-hover:scale-110">
                    {stat.value.replace("+", "")}<span className="text-amber-400">+</span>
                  </div>
                  <div className="text-white/40 text-sm uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
