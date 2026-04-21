"use client";

import { useState, useTransition } from "react";
import { replyToComplaintAction } from "@/lib/actions/admin-complaints";

export function ReplyForm({ complaintId, currentReply }: { complaintId: string, currentReply: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await replyToComplaintAction(complaintId, formData);
      if (res && res.error) {
        setError(res.error);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Reply</label>
        <textarea
          name="reply"
          required
          defaultValue={currentReply || ""}
          rows={5}
          placeholder="Write your response to the user here..."
          className="mt-1 w-full rounded-xl border border-slate-300 p-4 text-sm dark:border-slate-700 dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>
      
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-amber-500 px-6 py-2 font-bold text-slate-900 hover:bg-amber-400 disabled:opacity-50 shadow-sm transition-all active:scale-95"
      >
        {isPending ? "Sending..." : "Send Reply & Resolve"}
      </button>
    </form>
  );
}
