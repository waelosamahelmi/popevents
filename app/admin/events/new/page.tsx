import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/events/EventForm";

export default function NewEventPage() {
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
          <h2 className="text-2xl font-bold text-gray-900">Create Event</h2>
          <p className="text-gray-600">Add a new event to your calendar</p>
        </div>
      </div>

      <EventForm />
    </div>
  );
}
