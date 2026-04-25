"use client";

import { useTransition } from "react";
import { deleteComplaintAction } from "@/lib/actions/admin-complaints";

export function DeleteComplaintButton({ complaintId }: { complaintId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to permanently delete this complaint and all its messages? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteComplaintAction(complaintId);
      if (res && "error" in res && res.error) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors p-1"
      title="Delete Complaint"
    >
      {isPending ? (
        <span className="text-[10px]">...</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}
