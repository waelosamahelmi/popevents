import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { prisma } from "@/lib/prisma";
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

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

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
    if (event.maxCapacity && event._count.registrations >= event.maxCapacity) {
      return NextResponse.json(
        { error: "This event is fully booked" },
        { status: 400 }
      );
    }

    // Check for duplicate registration
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        email,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 409 }
      );
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        fullName,
        email,
        phone,
        companyName,
        licenseFileUrl,
        additionalNotes,
        status: "pending",
      },
      include: {
        event: true,
      },
    });

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
