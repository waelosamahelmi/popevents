import SiteHeader from "@/components/reference/SiteHeader";
import VendorApplicationForm from "@/components/reference/VendorApplicationForm";

export const metadata = { title: "Vendor Registration | Pop Events Kuwait" };

export default function RegisterPage() {
  return <div className="register-page"><SiteHeader compact /><main><section className="register-hero"><span className="register-kicker">Vendor Registration</span><h1>Apply to Be a Vendor</h1><p>Select your event below and complete the application form.</p></section><section className="register-main"><VendorApplicationForm /></section></main><footer className="pop-footer register-footer"><strong>POP EVENTS</strong><p>© 2026 Pop Events Kuwait</p></footer></div>;
}
