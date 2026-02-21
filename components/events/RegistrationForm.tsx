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
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    licenseFileUrl: "",
    additionalNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/events");
      }, 3000);
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
        <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
        <p className="text-white/50">
          Thank you for registering. We&apos;ll be in touch soon with more details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="glass-glow rounded-xl px-4 py-3 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Event Summary */}
      <div className="glass-glow rounded-xl p-4 border border-white/10">
        <h4 className="font-semibold text-white/70 mb-2 text-sm uppercase tracking-wider">You&apos;re registering for:</h4>
        <p className="text-white font-medium">{eventName}</p>
        <p className="text-sm text-white/40">
          {new Date(eventDate).toLocaleDateString()} &bull; {eventLocation}
        </p>
      </div>

      {/* Personal Info */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20"
            placeholder="John Doe"
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
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
            Phone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20"
            placeholder="+965 XXXX XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 hover:border-white/20"
            placeholder="Your company name (optional)"
          />
        </div>
      </div>

      {/* License Upload */}
      <div>
        <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
          License / Permit Document
        </label>
        <p className="text-sm text-white/30 mb-3">
          Upload any relevant business licenses or permits (PDF, JPG, PNG)
        </p>
        <FileUploader
          initialFile={formData.licenseFileUrl}
          onFileChange={(url) => setFormData((prev) => ({ ...prev, licenseFileUrl: url }))}
          folder="registrations"
          accept="application/pdf,image/jpeg,image/png"
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">
          Additional Notes
        </label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-white/30 transition-all duration-300 resize-y hover:border-white/20"
          placeholder="Any additional information or special requirements..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? "Submitting..." : "Complete Registration"}
      </button>

      <p className="text-sm text-white/30 text-center">
        By submitting this form, you agree to our terms and conditions.
      </p>
    </form>
  );
}
