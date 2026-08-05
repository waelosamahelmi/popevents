"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-900">
        Admin page failed to load
      </h2>
      <p className="mt-2 text-sm text-red-700">
        Please try again. If the issue continues, check server logs for this
        digest: {error.digest || "N/A"}
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        Try again
      </button>
    </div>
  );
}
