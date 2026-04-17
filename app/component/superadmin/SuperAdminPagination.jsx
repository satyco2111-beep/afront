"use client";

export default function SuperAdminPagination({ page, totalPages, onPageChange, loading }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm">
      <button
        type="button"
        disabled={loading || page <= 1}
        className="rounded border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50"
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-gray-700 tabular-nums">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={loading || page >= totalPages}
        className="rounded border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
