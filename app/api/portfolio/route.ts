import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { db, generateId, now } from "@/lib/db";

// GET /api/portfolio - List all portfolio items (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    let query = db.from('PortfolioItem').select('*').order('sortOrder', { ascending: true });

    if (published === "true") {
      query = query.eq('isPublished', true);
    }

    const { data: items, error } = await query;
    if (error) throw error;

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

    const timestamp = now();
    const { data: item, error } = await db.from('PortfolioItem').insert({
      id: generateId(),
      title,
      description,
      eventName,
      images,
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).select().single();

    if (error) throw error;

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
