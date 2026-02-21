import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { uploadFile } from "@/lib/upload";

// POST /api/upload - Upload a file (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedDocTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (folder === "registrations") {
      if (!allowedDocTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only PDF, JPG, and PNG allowed" },
          { status: 400 }
        );
      }
    } else {
      if (!allowedImageTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only images allowed" },
          { status: 400 }
        );
      }
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const url = await uploadFile(file, folder);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
