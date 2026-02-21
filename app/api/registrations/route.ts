import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { db, generateId, now } from "@/lib/db";
import { sendRegistrationNotification } from "@/lib/email";

// GET /api/registrations - List all registrations (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");

    let query = db.from('Registration').select('*, event:Event(id, title, date, location)').order('createdAt', { ascending: false });

    if (eventId) query = query.eq('eventId', eventId);
    if (status) query = query.eq('status', status);

    const { data: registrations, error } = await query;
    if (error) throw error;

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

// POST /api/registrations - Create a new registration (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      fullName,
      email,
      phone,
      companyName,
      licenseFileUrl,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!eventId || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if event exists and is published
    const { data: event } = await db.from('Event').select('*').eq('id', eventId).single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.isPublished) {
      return NextResponse.json(
        { error: "This event is not accepting registrations" },
        { status: 400 }
      );
    }

    // Check capacity
    if (event.maxCapacity) {
      const { count } = await db.from('Registration').select('*', { count: 'exact', head: true }).eq('eventId', eventId);
      if ((count || 0) >= event.maxCapacity) {
        return NextResponse.json(
          { error: "This event is fully booked" },
          { status: 400 }
        );
      }
    }

    // Check for duplicate registration
    const { data: existingRegistration } = await db.from('Registration').select('id').eq('eventId', eventId).eq('email', email).limit(1).maybeSingle();

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 409 }
      );
    }

    // Create registration
    const timestamp = now();
    const { data: registration, error: insertError } = await db.from('Registration').insert({
      id: generateId(),
      eventId,
      fullName,
      email,
      phone,
      companyName,
      licenseFileUrl,
      additionalNotes,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    }).select('*, event:Event(*)').single();

    if (insertError) throw insertError;

    // Send notification email
    try {
      await sendRegistrationNotification(registration);
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}
