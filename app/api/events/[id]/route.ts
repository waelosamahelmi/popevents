import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { db, now } from "@/lib/db";

// GET /api/events/[id] - Get a single event (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: event, error } = await db.from('Event').select('*').eq('id', id).single();

    if (error || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get registration count
    const { count } = await db.from('Registration').select('*', { count: 'exact', head: true }).eq('eventId', id);

    return NextResponse.json({ ...event, _count: { registrations: count || 0 } });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const updateData: any = { updatedAt: now() };
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date).toISOString();
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate).toISOString() : null;
    if (location) updateData.location = location;
    if (mapUrl !== undefined) updateData.mapUrl = mapUrl;
    if (coverImage) updateData.coverImage = coverImage;
    if (isUpcoming !== undefined) updateData.isUpcoming = isUpcoming;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;

    const { data: event, error } = await db.from('Event').update(updateData).eq('id', id).select().single();

    if (error) throw error;

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // Delete registrations first (cascade)
    await db.from('Registration').delete().eq('eventId', id);
    await db.from('Event').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
