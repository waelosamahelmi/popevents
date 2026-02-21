import nodemailer from 'nodemailer';

const notificationEmail = process.env.NOTIFICATION_EMAIL || 'admin@popeventskuwait.com';

function getSmtpTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendRegistrationNotification(registration: {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  additionalNotes?: string | null;
  event: {
    title: string;
  };
}) {
  const transport = getSmtpTransport();
  if (!transport) {
    console.warn('SMTP credentials not set, skipping email notification');
    return;
  }

  try {
    await transport.sendMail({
      from: `"Pop Events" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: notificationEmail,
      subject: `New Registration: ${registration.fullName} - ${registration.event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B21A8;">New Event Registration</h2>
          <p><strong>Event:</strong> ${registration.event.title}</p>
          <p><strong>Name:</strong> ${registration.fullName}</p>
          <p><strong>Email:</strong> ${registration.email}</p>
          <p><strong>Phone:</strong> ${registration.phone}</p>
          ${registration.companyName ? `<p><strong>Company:</strong> ${registration.companyName}</p>` : ''}
          ${registration.additionalNotes ? `<p><strong>Notes:</strong> ${registration.additionalNotes}</p>` : ''}
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
  const transport = getSmtpTransport();
  if (!transport) {
    console.warn('SMTP credentials not set, skipping contact email');
    return;
  }

  try {
    await transport.sendMail({
      from: `"Pop Events Contact Form" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: notificationEmail,
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
