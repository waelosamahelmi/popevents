import { NextRequest, NextResponse } from "next/server";
import { validateVendorFields, validateVendorFile } from "@/lib/form-validation";
import { sendRegistrationNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { uploadRegistrationFile } from "@/lib/upload";

const fileNames = ["companyLicense", "healthCertificate", "civilId", "businessLogo"] as const;

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const validation = validateVendorFields(Object.fromEntries(form.entries()));
    if ("error" in validation) return NextResponse.json({ error: validation.error }, { status: 400 });
    const files = Object.fromEntries(fileNames.map((name) => [name, form.get(name)])) as Record<(typeof fileNames)[number], FormDataEntryValue | null>;
    for (const name of fileNames) {
      const file = files[name];
      if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Upload all required documents." }, { status: 400 });
      const fileError = validateVendorFile(file);
      if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });
    }

    const event = await prisma.event.findFirst({
      where: { title: { startsWith: validation.value.event }, isUpcoming: true, isPublished: true },
    });
    if (!event) return NextResponse.json({ error: "The selected event is no longer accepting applications." }, { status: 400 });

    const [licenseFileUrl, healthCertUrl, civilIdUrl, businessLogoUrl] = await Promise.all(
      fileNames.map((name) => uploadRegistrationFile(files[name] as File)),
    );
    const registration = await prisma.registration.create({
      data: {
        eventId: event.id,
        fullName: validation.value.contactPerson,
        email: validation.value.email,
        phone: validation.value.phone,
        companyName: validation.value.businessName,
        instagram: validation.value.instagram || null,
        vendorCategory: validation.value.category,
        description: validation.value.description,
        licenseFileUrl,
        healthCertUrl,
        civilIdUrl,
        businessLogoUrl,
      },
      include: { event: { select: { title: true } } },
    });

    try {
      await sendRegistrationNotification(registration);
    } catch (error) {
      console.error("Vendor application notification failed:", error);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vendor application failed:", error);
    return NextResponse.json({ error: "Application could not be submitted. Please try again." }, { status: 500 });
  }
}
