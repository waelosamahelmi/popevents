import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/events/EventForm";

export const dynamic = 'force-dynamic';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let event = null;

  if (process.env.DATABASE_URL) {
    try {
      event = await prisma.event.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("Admin event fetch failed:", error);
    }
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/events"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
            <p className="text-gray-600">Unable to load event details right now.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/events"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
          <p className="text-gray-600">Update event details</p>
        </div>
      </div>

      <EventForm
        initialData={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description,
          date: event.date.toISOString(),
          endDate: event.endDate?.toISOString(),
          location: event.location,
          mapUrl: event.mapUrl || undefined,
          coverImage: event.coverImage,
          isUpcoming: event.isUpcoming,
          isPublished: event.isPublished,
          maxCapacity: event.maxCapacity || undefined,
        }}
        isEditing
      />
    </div>
  );
}
