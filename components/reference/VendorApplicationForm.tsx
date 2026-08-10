"use client";

import { FormEvent, useState } from "react";
import { VENDOR_CATEGORIES, VENDOR_EVENTS } from "@/lib/form-validation";
import { compressImageFile, submitForm } from "@/lib/utils";

// Stay under Vercel's ~4.5 MB serverless request-body limit, leaving headroom
// for the text fields and multipart overhead.
const MAX_TOTAL_UPLOAD = 4.2 * 1024 * 1024;

const documents = [
  ["companyLicense", "📄 Company License"],
  ["healthCertificate", "📋 Health Certificate"],
  ["civilId", "🪪 Civil ID"],
  ["businessLogo", "🖼 Business Logo"],
] as const;

export default function VendorApplicationForm() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof VENDOR_EVENTS)[number]>(VENDOR_EVENTS[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending"); setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("event", selectedEvent);
    try {
      // Compress image documents (phone photos) before upload, then make sure
      // the combined size fits the serverless request-body limit.
      let total = 0;
      for (const [name] of documents) {
        const file = data.get(name);
        if (file instanceof File && file.size > 0) {
          const prepared = await compressImageFile(file);
          data.set(name, prepared);
          total += prepared.size;
        }
      }
      if (total > MAX_TOTAL_UPLOAD) {
        setStatus("error");
        setNotice("Your documents are too large to submit together (about 4 MB max). Please upload smaller files or clearer, lighter photos.");
        return;
      }
      await submitForm("/api/vendor-applications", { method: "POST", body: data }, "Application could not be submitted.");
      form.reset(); setStatus("sent"); setNotice("Application submitted. We’ll contact you within 3–5 business days.");
    } catch (error) {
      setStatus("error"); setNotice(error instanceof Error ? error.message : "Application could not be submitted.");
    }
  }

  return <div className="registration-shell">
    <div className="event-tabs" role="group" aria-label="Select an event">
      {VENDOR_EVENTS.map((name, index) => <button key={name} type="button" className={`event-tab ${selectedEvent === name ? "active" : ""}`} onClick={() => setSelectedEvent(name)}>{index === 0 ? "☕" : "🎖"} &nbsp; {name}</button>)}
    </div>
    <form className="application-card" onSubmit={submit}>
      <input type="hidden" name="event" value={selectedEvent} />
      <h2>{selectedEvent}</h2><p className="application-intro">Fill out all fields below and submit your application.</p>
      <div className="form-grid">
        <Field name="businessName" label="Business Name" required /><Field name="contactPerson" label="Contact Person" required />
        <Field name="email" label="Email" type="email" required /><Field name="phone" label="Phone" type="tel" required />
        <Field name="instagram" label="Instagram Handle" placeholder="@yourbrand" />
        <label className="form-field"><span>Vendor Category <b className="required">*</b></span><select name="category" defaultValue="" required><option value="" disabled>Select category...</option>{VENDOR_CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></label>
        <label className="form-field full"><span>Brief Description <b className="required">*</b></span><textarea name="description" placeholder="Tell us about your business..." required maxLength={2000} /></label>
      </div>
      <div className="documents"><h3 className="documents-title">Required Documents</h3>{documents.map(([name,label]) => <label className="form-field file-field" key={name}><span>{label}</span><input type="file" name={name} accept=".pdf,.jpg,.jpeg,.png,.webp" required /></label>)}</div>
      <div className="application-actions"><button className="submit-application" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting..." : "Submit Application"}</button>
        {notice ? <p className={`form-status ${status}`} role="status">{notice}</p> : <p className="review-note">We will review your application and reach out within 3-5 business days.</p>}</div>
    </form>
  </div>;
}

function Field({ name, label, type = "text", required = false, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="form-field"><span>{label} {required && <b className="required">*</b>}</span><input name={name} type={type} required={required} placeholder={placeholder} maxLength={160} /></label>;
}
