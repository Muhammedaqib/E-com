"use client";

import { useState, useTransition } from "react";
import { updateUserAction } from "@/lib/actions/admin-users";
import { Role } from "@prisma/client";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isSuspended: boolean;
}

export function EditUserForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateUserAction(user.id, formData);
      if (res && res.error) {
        // Handle field-level errors or generic errors
        if (typeof res.error === 'string') {
          setError(res.error);
        } else {
          const firstError = Object.values(res.error)[0] as string[];
          setError(firstError[0] || "Failed to update user");
        }
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      {error && (
        <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          required
          defaultValue={user.name || ""}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          defaultValue={user.email}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            required
            defaultValue={user.role}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="PRODUCT_MANAGER">PRODUCT MANAGER</option>
            <option value="CUSTOMER_CARE">CUSTOMER CARE</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isSuspended"
              defaultChecked={user.isSuspended}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-red-600">Suspend Account</span>
          </label>
        </div>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-95"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
