import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { prisma } from "@/lib/prisma";

// GET /api/settings - Get site settings (public)
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        id: "main",
        companyName: "Pop Events",
        tagline: "Your Premier Event Partner in Kuwait",
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: body,
      create: {
        id: "main",
        ...body,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
