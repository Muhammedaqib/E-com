"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/lib/actions/profile";

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateProfileAction(formData);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        // The page will revalidate and show updated data because currentPassword will be empty
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <p className="text-sm text-red-600 font-bold bg-red-50 p-3 rounded-lg dark:bg-red-900/20">{error}</p>}
      {success && <p className="text-sm text-green-600 font-bold bg-green-50 p-3 rounded-lg dark:bg-green-900/20">Profile updated successfully!</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            name="name"
            defaultValue={user.name || ""}
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={user.email}
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Phone</label>
          <input
            name="phone"
            defaultValue={user.phone || ""}
            placeholder="e.g. +1 234 567 890"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Address</label>
          <input
            name="address"
            defaultValue={user.address || ""}
            placeholder="e.g. 123 Main St, New York"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold mb-4">Security</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-2">New Password (leave empty to keep current)</label>
            <input
              name="newPassword"
              type="password"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-amber-700">Confirm with Current Password</label>
            <input
              name="currentPassword"
              type="password"
              required
              className="w-full rounded-xl border-2 border-amber-200 p-3 text-sm dark:border-amber-900/50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-slate-900 text-white py-4 font-bold hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        {isPending ? "Updating Profile..." : "Save Profile Changes"}
      </button>
    </form>
  );
}
