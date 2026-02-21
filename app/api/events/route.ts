import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

// GET /api/events - List all events (public) or with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming");
    const published = searchParams.get("published");

    const where: any = {};

    if (upcoming === "true") {
      where.isUpcoming = true;
    }

    if (published === "true") {
      where.isPublished = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      date,
      endDate,
      location,
      mapUrl,
      coverImage,
      isUpcoming,
      isPublished,
      maxCapacity,
    } = body;

    // Generate slug if not provided
    const eventSlug = slug || generateSlug(title);

    const event = await prisma.event.create({
      data: {
        title,
        slug: eventSlug,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location,
        mapUrl,
        coverImage,
        isUpcoming: isUpcoming ?? true,
        isPublished: isPublished ?? true,
        maxCapacity,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "An event with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
