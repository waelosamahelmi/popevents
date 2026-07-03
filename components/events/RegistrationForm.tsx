"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/shared/FileUploader";

interface RegistrationFormProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

const VENDOR_CATEGORIES = [
  "Food & Beverage",
  "Coffee & Specialty Drinks",
  "Retail & Merchandise",
  "Arts & Crafts",
  "Services",
  "Other",
];

export default function RegistrationForm({
  eventId,
  eventName,
  eventDate,
  eventLocation,
}: RegistrationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "", // Business Name
    fullName: "", // Contact Person
    email: "",
    phone: "",
    instagram: "",
    vendorCategory: "",
    description: "", // Brief Description
    licenseFileUrl: "", // Company License
    healthCertUrl: "", // Health Certificate
    civilIdUrl: "", // Civil ID
    businessLogoUrl: "", // Business Logo
  });

  const set = (key: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Application failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/events");
      }, 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-glow rounded-2xl p-8 text-center border border-green-500/20">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-white/50">
          We will review your application and reach out within 3-5 business days.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20";
  const labelClass =
    "block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="glass-glow rounded-xl px-4 py-3 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Event Summary */}
      <div className="glass-glow rounded-xl p-4 border border-white/10">
        <h4 className="font-semibold text-white/70 mb-2 text-sm uppercase tracking-wider">
          You&apos;re applying for:
        </h4>
        <p className="text-white font-medium">{eventName}</p>
        <p className="text-sm text-white/40">
          {new Date(eventDate).toLocaleDateString()} &bull; {eventLocation}
        </p>
      </div>

      <p className="text-white/50 text-sm">
        Fill out all fields below and submit your application.
      </p>

      {/* Business Info */}
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Business Name *</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            required
            className={inputClass}
            placeholder="Your business name"
          />
        </div>

        <div>
          <label className={labelClass}>Contact Person *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            required
            className={inputClass}
            placeholder="Full name"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => set("email", e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => set("phone", e.target.value)}
              required
              className={inputClass}
              placeholder="+965 XXXX XXXX"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Instagram Handle</label>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            className={inputClass}
            placeholder="@yourbusiness"
          />
        </div>

        <div>
          <label className={labelClass}>Vendor Category *</label>
          <select
            value={formData.vendorCategory}
            onChange={(e) => set("vendorCategory", e.target.value)}
            required
            className={`${inputClass} appearance-none`}
          >
            <option value="" disabled className="bg-neutral-900">
              Select a category
            </option>
            {VENDOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-neutral-900">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Brief Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={4}
            className={`${inputClass} resize-y`}
            placeholder="Tell us about your business and what you'll offer at the event..."
          />
        </div>
      </div>

      {/* Required Documents */}
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-white/70 mb-1 uppercase tracking-wider">
          Required Documents
        </h4>
        <p className="text-xs text-white/30 mb-4">
          Upload the documents below (PDF, JPG or PNG). All optional — you can send any missing ones later.
        </p>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>📄 Company License</label>
            <FileUploader
              initialFile={formData.licenseFileUrl}
              onFileChange={(url) => set("licenseFileUrl", url)}
              folder="registrations"
              accept="application/pdf,image/jpeg,image/png"
            />
          </div>

          <div>
            <label className={labelClass}>📋 Health Certificate</label>
            <FileUploader
              initialFile={formData.healthCertUrl}
              onFileChange={(url) => set("healthCertUrl", url)}
              folder="registrations"
              accept="application/pdf,image/jpeg,image/png"
            />
          </div>

          <div>
            <label className={labelClass}>📺 Civil ID</label>
            <FileUploader
              initialFile={formData.civilIdUrl}
              onFileChange={(url) => set("civilIdUrl", url)}
              folder="registrations"
              accept="application/pdf,image/jpeg,image/png"
            />
          </div>

          <div>
            <label className={labelClass}>🖼 Business Logo</label>
            <FileUploader
              initialFile={formData.businessLogoUrl}
              onFileChange={(url) => set("businessLogoUrl", url)}
              folder="registrations"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      <p className="text-sm text-white/30 text-center">
        We will review your application and reach out within 3-5 business days.
      </p>
    </form>
  );
}
