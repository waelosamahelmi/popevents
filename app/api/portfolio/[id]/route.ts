import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { db, now } from "@/lib/db";

// GET /api/portfolio/[id] - Get a single portfolio item (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: item, error } = await db.from('PortfolioItem').select('*').eq('id', id).single();

    if (error || !item) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio item" },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio/[id] - Update a portfolio item (admin only)
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
    const { title, description, eventName, images, sortOrder, isPublished } = body;

    const updateData: any = { updatedAt: now() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (eventName !== undefined) updateData.eventName = eventName;
    if (images) updateData.images = images;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const { data: item, error } = await db.from('PortfolioItem').update(updateData).eq('id', id).select().single();

    if (error) throw error;

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[id] - Delete a portfolio item (admin only)
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
    await db.from('PortfolioItem').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  }
}
