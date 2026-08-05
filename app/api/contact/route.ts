import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { validateContactPayload } from "@/lib/form-validation";

// POST /api/contact - Send contact form email (public)
export async function POST(request: NextRequest) {
  try {
    const validation = validateContactPayload(await request.json());
    if ("error" in validation) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    await sendContactEmail(validation.value);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
