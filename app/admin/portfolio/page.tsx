export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

async function getPortfolio() {
  const { data } = await db.from('PortfolioItem').select('*').order('sortOrder', { ascending: true });
  return data || [];
}

export default async function AdminPortfolioPage() {
  const items = await getPortfolio();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <p className="text-gray-600">Manage your portfolio gallery</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium"
        >
          <Plus size={20} />
          Add Portfolio Item
        </Link>
      </div>

      {/* Portfolio grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No portfolio items yet</p>
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
          >
            <Plus size={20} />
            Add Portfolio Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100">
                {item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{item.images.length - 1} more
                  </div>
                )}
                {!item.isPublished && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Draft
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                {item.eventName && (
                  <p className="text-sm text-gray-500">{item.eventName}</p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex justify-end gap-2">
                <Link
                  href={`/admin/portfolio/${item.id}/edit`}
                  className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                  title="Edit"
                >
                  <Pencil size={18} />
                </Link>
                <Link
                  href={`/admin/portfolio/${item.id}/delete`}
                  className="p-2 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
