import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { db, generateId, now } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

// GET /api/events - List all events (public) or with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming");
    const published = searchParams.get("published");

    let query = db.from('Event').select('*').order('date', { ascending: true });

    if (upcoming === "true") {
      query = query.eq('isUpcoming', true);
    }

    if (published === "true") {
      query = query.eq('isPublished', true);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    // Get registration counts for each event
    const eventsWithCounts = await Promise.all(
      (events || []).map(async (event: any) => {
        const { count } = await db.from('Registration').select('*', { count: 'exact', head: true }).eq('eventId', event.id);
        return { ...event, _count: { registrations: count || 0 } };
      })
    );

    return NextResponse.json(eventsWithCounts);
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

    const eventSlug = slug || generateSlug(title);
    const timestamp = now();

    const { data: event, error } = await db.from('Event').insert({
      id: generateId(),
      title,
      slug: eventSlug,
      description,
      date: new Date(date).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : null,
      location,
      mapUrl,
      coverImage,
      isUpcoming: isUpcoming ?? true,
      isPublished: isPublished ?? true,
      maxCapacity,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).select().single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: "An event with this slug already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
