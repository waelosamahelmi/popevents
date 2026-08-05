import { NextRequest, NextResponse } from "next/server";
import { validateVendorFields, validateVendorFile } from "@/lib/form-validation";
import { sendVendorApplicationNotification } from "@/lib/email";

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
    const attachments = await Promise.all(fileNames.map(async (name) => {
      const file = files[name] as File;
      return { filename: file.name, content: Buffer.from(await file.arrayBuffer()), contentType: file.type };
    }));
    await sendVendorApplicationNotification({ ...validation.value, attachments });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vendor application failed:", error);
    return NextResponse.json({ error: "Application could not be submitted. Please try again." }, { status: 500 });
  }
}
