// Auth is handled by Supabase Auth - this route is kept for backwards compatibility
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Auth is handled by Supabase" });
}

export async function POST() {
  return NextResponse.json({ message: "Auth is handled by Supabase" });
}
