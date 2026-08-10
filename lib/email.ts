import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Resolve SMTP config: admin settings (DB) take precedence, then env vars.
async function getSmtpConfig() {
  let s: {
    smtpHost?: string | null;
    smtpPort?: number | null;
    smtpSecure?: boolean | null;
    smtpUser?: string | null;
    smtpPass?: string | null;
    smtpFrom?: string | null;
    notificationEmail?: string | null;
  } | null = null;

  try {
    s = await prisma.siteSettings.findUnique({
      where: { id: 'main' },
      select: {
        smtpHost: true, smtpPort: true, smtpSecure: true,
        smtpUser: true, smtpPass: true, smtpFrom: true, notificationEmail: true,
      },
    });
  } catch {
    // DB unavailable — fall back to env below.
  }

  const host = s?.smtpHost || process.env.SMTP_HOST || '';
  const user = s?.smtpUser || process.env.SMTP_USER || '';
  const pass = s?.smtpPass || process.env.SMTP_PASS || '';
  const port = s?.smtpPort ?? parseInt(process.env.SMTP_PORT || '465', 10);
  const configuredSecure = s?.smtpSecure ?? (process.env.SMTP_SECURE === 'true');
  // Port and TLS mode must agree or the handshake fails instantly (a mismatched
  // secure flag is the most common SMTP misconfig). 465 is implicit TLS;
  // 587/25 use STARTTLS. Derive it from the port so the flag can't contradict it.
  const secure = port === 465 ? true : port === 587 || port === 25 ? false : configuredSecure;
  const from = s?.smtpFrom || process.env.SMTP_FROM || user;
  const notificationEmail =
    s?.notificationEmail || process.env.NOTIFICATION_EMAIL || 'admin@popeventskuwait.com';

  return { host, user, pass, port, secure, from, notificationEmail };
}

async function getSmtpTransport() {
  const cfg = await getSmtpConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) {
    return null;
  }
  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure, // true for 465, false for other ports (STARTTLS)
    auth: { user: cfg.user, pass: cfg.pass },
    // Fail fast instead of hanging until the serverless function is killed,
    // which would return a non-JSON platform error page to the browser.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return { transport, cfg };
}

export async function sendRegistrationNotification(registration: {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  instagram?: string | null;
  vendorCategory?: string | null;
  description?: string | null;
  licenseFileUrl?: string | null;
  healthCertUrl?: string | null;
  civilIdUrl?: string | null;
  businessLogoUrl?: string | null;
  additionalNotes?: string | null;
  event: {
    title: string;
  };
}) {
  const smtp = await getSmtpTransport();
  if (!smtp) {
    console.warn('SMTP credentials not set, skipping email notification');
    return;
  }
  const { transport, cfg } = smtp;

  const docLink = (label: string, url?: string | null) =>
    url
      ? `<li><a href="${url}" style="color: #6B21A8;">${label}</a></li>`
      : `<li style="color: #999;">${label} — not provided</li>`;

  const businessName = registration.companyName || registration.fullName;

  try {
    await transport.sendMail({
      from: `"Pop Events" <${cfg.from}>`,
      to: cfg.notificationEmail,
      subject: `New Vendor Application: ${businessName} - ${registration.event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B21A8;">New Vendor Application</h2>
          <p><strong>Event:</strong> ${registration.event.title}</p>
          <p><strong>Business Name:</strong> ${businessName}</p>
          <p><strong>Contact Person:</strong> ${registration.fullName}</p>
          <p><strong>Email:</strong> ${registration.email}</p>
          <p><strong>Phone:</strong> ${registration.phone}</p>
          ${registration.instagram ? `<p><strong>Instagram:</strong> ${registration.instagram}</p>` : ''}
          ${registration.vendorCategory ? `<p><strong>Category:</strong> ${registration.vendorCategory}</p>` : ''}
          ${registration.description ? `<p><strong>Description:</strong> ${registration.description}</p>` : ''}
          ${registration.additionalNotes ? `<p><strong>Notes:</strong> ${registration.additionalNotes}</p>` : ''}
          <p><strong>Documents:</strong></p>
          <ul>
            ${docLink('📄 Company License', registration.licenseFileUrl)}
            ${docLink('📋 Health Certificate', registration.healthCertUrl)}
            ${docLink('📺 Civil ID', registration.civilIdUrl)}
            ${docLink('🖼 Business Logo', registration.businessLogoUrl)}
          </ul>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/registrations" style="color: #6B21A8;">View in Admin Panel</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw new Error('Failed to send notification email');
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const smtp = await getSmtpTransport();
  if (!smtp) {
    console.warn('SMTP credentials not set, skipping contact email');
    return;
  }
  const { transport, cfg } = smtp;

  try {
    await transport.sendMail({
      from: `"Pop Events Contact Form" <${cfg.from}>`,
      to: cfg.notificationEmail,
      replyTo: data.email || undefined,
      envelope: { from: cfg.user, to: cfg.notificationEmail },
      subject: `Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B21A8;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    throw new Error('Failed to send contact email');
  }
}

export async function sendVendorApplicationNotification(application: {
  event: string; businessName: string; contactPerson: string; email: string; phone: string;
  category: string; description: string; instagram: string;
  attachments: Array<{ filename: string; content: Buffer; contentType: string }>;
}) {
  const smtp = await getSmtpTransport();
  if (!smtp) { console.warn('SMTP credentials not set, skipping vendor notification'); return; }
  const { transport, cfg } = smtp;
  await transport.sendMail({
    from: `"Pop Events" <${cfg.from}>`, to: cfg.notificationEmail,
    replyTo: application.email || undefined,
    // MAIL FROM must be the authenticated mailbox or Hostinger rejects the send.
    envelope: { from: cfg.user, to: cfg.notificationEmail },
    subject: `New Vendor Application: ${application.businessName} - ${application.event}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h2>New Vendor Application</h2><p><b>Event:</b> ${application.event}</p><p><b>Business:</b> ${application.businessName}</p><p><b>Contact:</b> ${application.contactPerson}</p><p><b>Email:</b> ${application.email}</p><p><b>Phone:</b> ${application.phone}</p><p><b>Instagram:</b> ${application.instagram || '—'}</p><p><b>Category:</b> ${application.category}</p><p><b>Description:</b> ${application.description}</p><p>The company license, health certificate, Civil ID, and business logo are attached to this email.</p></div>`,
    attachments: application.attachments,
  });
}
