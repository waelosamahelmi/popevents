"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/shared/ImageUploader";

interface EventFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    date?: string;
    endDate?: string;
    location?: string;
    mapUrl?: string;
    coverImage?: string;
    isUpcoming?: boolean;
    isPublished?: boolean;
    maxCapacity?: number;
  };
  isEditing?: boolean;
}

export default function EventForm({ initialData, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    date: initialData?.date ? initialData.date.slice(0, 16) : "",
    endDate: initialData?.endDate ? initialData.endDate.slice(0, 16) : "",
    location: initialData?.location || "",
    mapUrl: initialData?.mapUrl || "",
    coverImage: initialData?.coverImage || "",
    isUpcoming: initialData?.isUpcoming ?? true,
    isPublished: initialData?.isPublished ?? true,
    maxCapacity: initialData?.maxCapacity || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        maxCapacity: formData.maxCapacity ? parseInt(String(formData.maxCapacity)) : null,
      };

      const url = isEditing && initialData?.id
        ? `/api/events/${initialData.id}`
        : "/api/events";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save event");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Kuwait Coffee Festival 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="kuwait-coffee-festival-2026"
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to auto-generate from title
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            required
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-y"
            placeholder="Describe your event... You can use Markdown formatting."
          />
          <p className="mt-1 text-sm text-gray-500">
            Markdown formatting supported
          </p>
        </div>
      </div>

      {/* Date & Location */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Date & Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Kuwait International Fairgrounds, Mishref"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map Embed URL
          </label>
          <input
            type="url"
            value={formData.mapUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, mapUrl: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="https://maps.google.com/..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Google Maps embed URL for the event location
          </p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Cover Image</h3>
        <ImageUploader
          initialImage={formData.coverImage}
          onImageChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
          folder="events"
        />
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Capacity
          </label>
          <input
            type="number"
            value={formData.maxCapacity}
            onChange={(e) => setFormData((prev) => ({ ...prev, maxCapacity: e.target.value }))}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Leave empty for unlimited"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isUpcoming}
              onChange={(e) => setFormData((prev) => ({ ...prev, isUpcoming: e.target.checked }))}
              className="w-4 h-4 text-purple-700 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Show as upcoming</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="w-4 h-4 text-purple-700 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
