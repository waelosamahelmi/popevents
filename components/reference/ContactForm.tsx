"use client";

import { FormEvent, useState } from "react";
import { submitForm } from "@/lib/utils";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      await submitForm("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }, "Message could not be sent.");
      form.reset();
      setStatus("sent");
      setMessage("Message sent. We’ll be in touch soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="contact-name">Your Name</label>
      <input id="contact-name" name="name" placeholder="Your Name" required maxLength={100} />
      <label className="sr-only" htmlFor="contact-email">Your Email</label>
      <input id="contact-email" type="email" name="email" placeholder="Your Email" required />
      <label className="sr-only" htmlFor="contact-subject">Event / Subject</label>
      <input id="contact-subject" name="subject" placeholder="Event / Subject" required maxLength={160} />
      <label className="sr-only" htmlFor="contact-message">Tell us how we can help</label>
      <textarea id="contact-message" name="message" placeholder="Tell us how we can help..." required maxLength={3000} />
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send Message"}</button>
      {message && <p className={`form-status ${status}`} role="status">{message}</p>}
    </form>
  );
}
