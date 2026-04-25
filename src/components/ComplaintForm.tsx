"use client";

import { useState, useTransition } from "react";
import { submitComplaintAction } from "@/lib/actions/complaints";

export function ComplaintForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await submitComplaintAction(formData);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center dark:bg-green-900/20">
        <h2 className="text-xl font-bold text-green-800 dark:text-green-400">Report Submitted!</h2>
        <p className="mt-2 text-green-700 dark:text-green-500">
          Thank you for your feedback. An admin will review your message soon.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-bold text-green-900 underline dark:text-green-400"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Subject</label>
        <input
          name="subject"
          required
          placeholder="What is this regarding?"
          className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Send To</label>
        <select
          name="targetRole"
          required
          className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER_CARE">Customer Care</option>
          <option value="PRODUCT_MANAGER">Product Management</option>
        </select>
        <p className="mt-1 text-[10px] text-slate-500 uppercase tracking-wider px-1">Choose who should receive this report.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Describe your issue or report in detail..."
          className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-amber-500 py-4 font-bold text-slate-900 hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
      >
        {isPending ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
