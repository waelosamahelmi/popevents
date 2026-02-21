import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { prisma } from "@/lib/prisma";

// GET /api/portfolio - List all portfolio items (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const where: any = {};
    if (published === "true") {
      where.isPublished = true;
    }

    const items = await prisma.portfolioItem.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 }
    );
  }
}

// POST /api/portfolio - Create a new portfolio item (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, eventName, images, sortOrder, isPublished } = body;

    if (!title || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one image are required" },
        { status: 400 }
      );
    }

    const item = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        eventName,
        images,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
