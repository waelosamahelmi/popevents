import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PortfolioForm from "@/components/portfolio/PortfolioForm";

export const dynamic = 'force-dynamic';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.portfolioItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/portfolio"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Portfolio Item</h2>
          <p className="text-gray-600">Update portfolio details</p>
        </div>
      </div>

      <PortfolioForm
        initialData={{
          id: item.id,
          title: item.title,
          description: item.description || undefined,
          eventName: item.eventName || undefined,
          images: item.images,
          sortOrder: item.sortOrder,
          isPublished: item.isPublished,
        }}
        isEditing
      />
    </div>
  );
}
