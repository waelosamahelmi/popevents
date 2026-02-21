import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PortfolioForm from "@/components/portfolio/PortfolioForm";

export default function NewPortfolioPage() {
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
          <h2 className="text-2xl font-bold text-gray-900">Add Portfolio Item</h2>
          <p className="text-gray-600">Add a new item to your portfolio</p>
        </div>
      </div>

      <PortfolioForm />
    </div>
  );
}
