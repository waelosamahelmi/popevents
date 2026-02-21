import { prisma } from "@/lib/prisma";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getStats() {
  const [totalEvents, upcomingEvents, totalRegistrations, pendingRegistrations, recentRegistrations] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { isUpcoming: true } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "pending" } }),
      prisma.registration.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          event: {
            select: { title: true },
          },
        },
      }),
    ]);

  return {
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    pendingRegistrations,
    recentRegistrations,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "bg-purple-500",
      href: "/admin/events",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: Clock,
      color: "bg-blue-500",
      href: "/admin/events",
    },
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      icon: Users,
      color: "bg-green-500",
      href: "/admin/registrations",
    },
    {
      title: "Pending Review",
      value: stats.pendingRegistrations,
      icon: CheckCircle,
      color: "bg-orange-500",
      href: "/admin/registrations?status=pending",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/events/new"
            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium"
          >
            Create Event
          </Link>
          <Link
            href="/admin/portfolio/new"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
          >
            Add Portfolio
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent registrations */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          {stats.recentRegistrations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No registrations yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentRegistrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{registration.fullName}</div>
                      <div className="text-sm text-gray-500">{registration.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {registration.event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registration.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : registration.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(registration.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {stats.recentRegistrations.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/admin/registrations"
              className="text-sm text-purple-700 hover:text-purple-900 font-medium"
            >
              View all registrations →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
