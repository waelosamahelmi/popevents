import Image from "next/image";
import Link from "next/link";
import ContactForm from "./ContactForm";
import SiteHeader from "./SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="pop-hero" id="hero">
          <div className="glow glow-one" /><div className="glow glow-two" />
          <div className="hero-inner">
            <Image className="hero-logo" src="/reference/pop-events-logo.png" width={280} height={107} alt="Pop Events Logo" priority />
            <p className="hero-tagline">Bringing fresh ideas and exciting new events to Kuwait — designed for everyone to enjoy as a family day out.</p>
            <div className="hero-pills" aria-label="Services">
              <span className="pill">📋 Event Licensing</span><span className="pill">⚡ Power &amp; Electricity</span>
              <span className="pill">🪑 Seating &amp; Setup</span><span className="pill">🇰🇼 Based in Kuwait</span>
            </div>
          </div>
        </section>
        <div className="pop-band" />
        <section id="about" className="pop-light about-section">
          <div className="pop-inner narrow"><span className="pop-kicker">Who We Are</span>
            <h2 className="pop-title">We Make Events Happen in Kuwait</h2>
            <p className="pop-copy">Pop Events was set up to bring new ideas and events to Kuwait that everyone can enjoy as a family. We handle everything behind the scenes — from securing your licenses to setting up power, seating, and full event infrastructure — so you can focus on the experience.</p>
          </div>
        </section>
        <section className="pop-light vendor-cta-section">
          <div className="vendor-box"><h2>Are You a Vendor?<br />Join Our Network</h2>
            <p>Register your business, upload your trade license and documents, and become part of the Pop Events vendor family.</p>
            <Link className="yellow-button" href="/register">Register as a Vendor →</Link>
          </div>
        </section>
        <hr className="pop-divider" />
        <section id="contact" className="pop-light-two contact-section">
          <div className="pop-inner contact-grid"><div><span className="pop-kicker">Contact</span><h2 className="pop-title">Get in Touch</h2>
            <p className="pop-copy contact-copy">Have an event idea or need operational support in Kuwait? We&apos;d love to hear from you.</p>
            <div className="contact-items"><div className="contact-item"><span className="contact-icon">📧</span><a href="mailto:info@popeventskw.com">info@popeventskw.com</a></div>
              <div className="contact-item"><span className="contact-icon">📍</span><span>Kuwait City, Kuwait</span></div>
              <div className="contact-item"><span className="contact-icon">📱</span><span>+965 9983 9299 / +965 9444 2746</span></div></div>
          </div><ContactForm /></div>
        </section>
      </main>
      <footer className="pop-footer"><strong>POP EVENTS</strong><p>© 2026 Pop Events Kuwait</p><a href="mailto:info@popeventskw.com">info@popeventskw.com</a></footer>
    </>
  );
}
