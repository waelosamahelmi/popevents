"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, Building, FileText, Image as ImageIcon, FileCheck } from "lucide-react";

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  companyLicenseUrl?: string;
  signatureUrl?: string;
  civilIdUrl?: string;
  healthLicenseUrl?: string;
  logoUrl?: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
  };
}

interface DocumentItem {
  label: string;
  url?: string;
  icon: React.ReactNode;
  folder: string;
}

export default function RegistrationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRegistration();
  }, [params.id]);

  const fetchRegistration = async () => {
    try {
      const response = await fetch(`/api/registrations/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRegistration(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/registrations/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update");
      const data = await response.json();
      setRegistration(data);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!registration) {
    return <div className="text-center py-12">Registration not found</div>;
  }

  const documents: DocumentItem[] = [
    {
      label: "Company License",
      url: registration.companyLicenseUrl,
      icon: <FileCheck size={20} className="text-purple-700" />,
      folder: "licenses",
    },
    {
      label: "Authorized Signature",
      url: registration.signatureUrl,
      icon: <FileText size={20} className="text-blue-700" />,
      folder: "signatures",
    },
    {
      label: "Civil ID",
      url: registration.civilIdUrl,
      icon: <FileText size={20} className="text-green-700" />,
      folder: "civil-ids",
    },
    {
      label: "Health License",
      url: registration.healthLicenseUrl,
      icon: <FileCheck size={20} className="text-red-700" />,
      folder: "health-licenses",
    },
    {
      label: "Company Logo",
      url: registration.logoUrl,
      icon: <ImageIcon size={20} className="text-orange-700" />,
      folder: "logos",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/registrations"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
          <p className="text-gray-600">{registration.event.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registrant info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="space-y-4">
              {registration.companyName && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-gray-900 font-medium">{registration.companyName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail size={20} className="text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${registration.email}`}
                    className="text-gray-900 hover:text-purple-700"
                  >
                    {registration.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone size={20} className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${registration.phone}`}
                    className="text-gray-900 hover:text-purple-700"
                  >
                    {registration.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                doc.url ? (
                  <div key={doc.folder} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        doc.folder === 'licenses' ? 'bg-purple-100' :
                        doc.folder === 'signatures' ? 'bg-blue-100' :
                        doc.folder === 'civil-ids' ? 'bg-green-100' :
                        doc.folder === 'health-licenses' ? 'bg-red-100' :
                        'bg-orange-100'
                      }`}>
                        {doc.icon}
                      </div>
                      <p className="font-medium text-gray-900">{doc.label}</p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      <Download size={16} />
                      View
                    </a>
                  </div>
                ) : (
                  <div key={doc.folder} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="p-2 bg-gray-200 rounded-lg opacity-50">
                      {doc.icon}
                    </div>
                    <p className="text-gray-500">{doc.label} - Not uploaded</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Additional notes */}
          {registration.additionalNotes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{registration.additionalNotes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus("approved")}
                disabled={updating}
                className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                  registration.status === "approved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100"
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus("rejected")}
                disabled={updating}
                className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                  registration.status === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-100"
                }`}
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus("pending")}
                disabled={updating}
                className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                  registration.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-100"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Event info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Event:</span>{" "}
                {registration.event.title}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Date:</span>{" "}
                {new Date(registration.event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Location:</span>{" "}
                {registration.event.location}
              </p>
            </div>
            <Link
              href={`/admin/events/${registration.event.id}/edit`}
              className="mt-4 inline-block text-sm text-purple-700 hover:text-purple-900"
            >
              View Event →
            </Link>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <p className="text-sm text-gray-600">
              Registered on{" "}
              {new Date(registration.createdAt).toLocaleDateString()} at{" "}
              {new Date(registration.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
