import { NextRequest, NextResponse } from "next/server";
import { validateVendorFields, validateVendorFile } from "@/lib/form-validation";
import { sendVendorApplicationNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

// nodemailer + reading uploads into buffers require the Node.js runtime.
// The Edge/Workers runtime caps CPU + memory ("Worker exceeded resource limits").
export const runtime = "nodejs";

const documents = [
  ["companyLicense", "Company License"],
  ["healthCertificate", "Health Certificate"],
  ["civilId", "Civil ID"],
  ["businessLogo", "Business Logo"],
] as const;

function attachmentName(label: string, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  return ext ? `${label}.${ext}` : label;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const validation = validateVendorFields(Object.fromEntries(form.entries()));
    if ("error" in validation) return NextResponse.json({ error: validation.error }, { status: 400 });

    const files = documents.map(([name]) => form.get(name));
    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Upload all required documents." }, { status: 400 });
      const fileError = validateVendorFile(file);
      if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });
    }

    // Read each document into a buffer and send it as a real email attachment —
    // no Supabase Storage round-trip, so the request stays light and fast.
    const attachments = await Promise.all(
      documents.map(async ([, label], index) => {
        const file = files[index] as File;
        return {
          filename: attachmentName(label, file),
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
        };
      }),
    );

    await sendVendorApplicationNotification({
      event: validation.value.event,
      businessName: validation.value.businessName,
      contactPerson: validation.value.contactPerson,
      email: validation.value.email,
      phone: validation.value.phone,
      category: validation.value.category,
      description: validation.value.description,
      instagram: validation.value.instagram,
      attachments,
    });

    // Best-effort: record the application for the admin panel. The notification
    // email (with attachments) is the guaranteed delivery path, so a DB hiccup
    // here must never fail the submission.
    try {
      const event = await prisma.event.findFirst({
        where: { title: { startsWith: validation.value.event }, isUpcoming: true, isPublished: true },
      });
      if (event) {
        await prisma.registration.create({
          data: {
            eventId: event.id,
            fullName: validation.value.contactPerson,
            email: validation.value.email,
            phone: validation.value.phone,
            companyName: validation.value.businessName,
            instagram: validation.value.instagram || null,
            vendorCategory: validation.value.category,
            description: validation.value.description,
          },
        });
      }
    } catch (error) {
      console.error("Vendor application record could not be saved:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vendor application failed:", error);
    return NextResponse.json({ error: "Application could not be submitted. Please try again." }, { status: 500 });
  }
}
