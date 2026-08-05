"use client";

import { useMemo, useState } from "react";
import FileUploader from "@/components/shared/FileUploader";

type ApplyEvent = {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
};

type TabKey = "coffee" | "bigFest";

type FormDataShape = {
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  vendorCategory: string;
  description: string;
  licenseFileUrl: string;
  healthCertUrl: string;
  civilIdUrl: string;
  businessLogoUrl: string;
};

type TabConfig = {
  key: TabKey;
  title: string;
  subtitle: string;
  categories: string[];
};

const TABS: TabConfig[] = [
  {
    key: "coffee",
    title: "Kuwait Coffee Festival",
    subtitle: "Fill out all fields below and submit your application.",
    categories: [
      "Specialty Coffee",
      "Food & Beverages",
      "Merchandise & Apparel",
      "Arts & Crafts",
      "Beauty & Wellness",
      "Other",
    ],
  },
  {
    key: "bigFest",
    title: "The Big Fest",
    subtitle: "Fill out all fields below and submit your application.",
    categories: [
      "Food & Beverages",
      "Merchandise & Apparel",
      "Arts & Crafts",
      "Beauty & Wellness",
      "Entertainment",
      "Other",
    ],
  },
];

const EMPTY_FORM: FormDataShape = {
  companyName: "",
  fullName: "",
  email: "",
  phone: "",
  instagram: "",
  vendorCategory: "",
  description: "",
  licenseFileUrl: "",
  healthCertUrl: "",
  civilIdUrl: "",
  businessLogoUrl: "",
};

interface VendorTabbedApplicationFormProps {
  events: ApplyEvent[];
  initialTab?: TabKey;
}

function findEventForTab(events: ApplyEvent[], tab: TabConfig): ApplyEvent | null {
  const normalize = (value: string) => value.toLowerCase().trim();
  const normalizedTitle = normalize(tab.title);

  const exact = events.find((event) => normalize(event.title) === normalizedTitle);
  if (exact) return exact;

  if (tab.key === "coffee") {
    return events.find((event) => normalize(event.title).includes("coffee")) || null;
  }

  return (
    events.find((event) => {
      const title = normalize(event.title);
      return title.includes("big") && title.includes("fest");
    }) || null
  );
}

export default function VendorTabbedApplicationForm({ events, initialTab = "coffee" }: VendorTabbedApplicationFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [formsByTab, setFormsByTab] = useState<Record<TabKey, FormDataShape>>({
    coffee: { ...EMPTY_FORM },
    bigFest: { ...EMPTY_FORM },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const eventByTab = useMemo(
    () => ({
      coffee: findEventForTab(events, TABS[0]),
      bigFest: findEventForTab(events, TABS[1]),
    }),
    [events]
  );

  const activeConfig = TABS.find((tab) => tab.key === activeTab) || TABS[0];
  const activeForm = formsByTab[activeTab];
  const activeEvent = eventByTab[activeTab];

  const setField = (key: keyof FormDataShape, value: string) => {
    setFormsByTab((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value,
      },
    }));
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!activeEvent) {
      setError("This event is not currently open for applications.");
      return;
    }

    if (
      !activeForm.licenseFileUrl ||
      !activeForm.healthCertUrl ||
      !activeForm.civilIdUrl ||
      !activeForm.businessLogoUrl
    ) {
      setError("Please upload all required documents before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activeForm,
          eventId: activeEvent.id,
          additionalNotes: `Submitted from /apply tab: ${activeConfig.title}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Application failed");
      }

      setSuccess(true);
      setFormsByTab((prev) => ({
        ...prev,
        [activeTab]: { ...EMPTY_FORM },
      }));
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
  const labelClass = "block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-2xl p-3 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-3 rounded-xl text-left transition-all duration-300 border ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/70 border-white/10 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                <p className="text-sm uppercase tracking-wider opacity-70">Event</p>
                <p className="font-semibold text-base leading-tight">{tab.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 glass-card rounded-3xl p-8 md:p-12 border border-white/5">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{activeConfig.title}</h2>
          <p className="text-white/50">{activeConfig.subtitle}</p>
          {!activeEvent && (
            <p className="mt-3 text-amber-300/90 text-sm">
              This event is not currently published in the system. Submission is disabled until it is available.
            </p>
          )}
        </div>

        {error && (
          <div className="glass-glow rounded-xl px-4 py-3 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Business Name *</label>
            <input
              type="text"
              value={activeForm.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Person *</label>
            <input
              type="text"
              value={activeForm.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              value={activeForm.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Phone *</label>
            <input
              type="tel"
              value={activeForm.phone}
              onChange={(e) => setField("phone", e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Instagram Handle</label>
          <input
            type="text"
            value={activeForm.instagram}
            onChange={(e) => setField("instagram", e.target.value)}
            className={inputClass}
            placeholder="@yourbusiness"
          />
        </div>

        <div>
          <label className={labelClass}>Vendor Category *</label>
          <select
            value={activeForm.vendorCategory}
            onChange={(e) => setField("vendorCategory", e.target.value)}
            required
            className={`${inputClass} appearance-none`}
          >
            <option value="" disabled className="bg-neutral-900">
              Select category...
            </option>
            {activeConfig.categories.map((category) => (
              <option key={category} value={category} className="bg-neutral-900">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Brief Description *</label>
          <textarea
            value={activeForm.description}
            onChange={(e) => setField("description", e.target.value)}
            required
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-semibold text-white mb-4">Required Documents</h3>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>📄 Company License</label>
              <FileUploader
                initialFile={activeForm.licenseFileUrl}
                onFileChange={(url) => setField("licenseFileUrl", url)}
                folder="registrations"
                accept="application/pdf,image/jpeg,image/png"
              />
            </div>

            <div>
              <label className={labelClass}>📋 Health Certificate</label>
              <FileUploader
                initialFile={activeForm.healthCertUrl}
                onFileChange={(url) => setField("healthCertUrl", url)}
                folder="registrations"
                accept="application/pdf,image/jpeg,image/png"
              />
            </div>

            <div>
              <label className={labelClass}>📺 Civil ID</label>
              <FileUploader
                initialFile={activeForm.civilIdUrl}
                onFileChange={(url) => setField("civilIdUrl", url)}
                folder="registrations"
                accept="application/pdf,image/jpeg,image/png"
              />
            </div>

            <div>
              <label className={labelClass}>🖼 Business Logo</label>
              <FileUploader
                initialFile={activeForm.businessLogoUrl}
                onFileChange={(url) => setField("businessLogoUrl", url)}
                folder="registrations"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !activeEvent}
          className="w-full px-6 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        <p className="text-sm text-white/30 text-center">
          We will review your application and reach out within 3-5 business days.
        </p>
      </form>
    </div>
  );
}
