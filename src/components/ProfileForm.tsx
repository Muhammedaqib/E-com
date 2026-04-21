"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/profile";

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await updateProfileAction(formData);
        if (res && res.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          // Clear current password and new password fields
          if (formRef.current) {
            const currentPass = formRef.current.querySelector('input[name="currentPassword"]') as HTMLInputElement;
            const newPass = formRef.current.querySelector('input[name="newPassword"]') as HTMLInputElement;
            if (currentPass) currentPass.value = "";
            if (newPass) newPass.value = "";
          }
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-red-600 font-bold flex items-center gap-2">
            ⚠️ {error}
          </p>
        </div>
      )}
      
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-green-600 font-bold flex items-center gap-2">
            ✅ Profile updated successfully!
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
          <input
            name="name"
            defaultValue={user.name || ""}
            required
            disabled={isPending}
            placeholder="Your full name"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
          <input
            name="email"
            type="email"
            defaultValue={user.email}
            required
            disabled={isPending}
            placeholder="email@example.com"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
          <input
            name="phone"
            defaultValue={user.phone || ""}
            disabled={isPending}
            placeholder="+1 234 567 890"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Address</label>
          <input
            name="address"
            defaultValue={user.address || ""}
            disabled={isPending}
            placeholder="Your shipping address"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Security Settings</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
            <input
              name="newPassword"
              type="password"
              disabled={isPending}
              placeholder="Leave empty to keep current"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-amber-600 uppercase tracking-widest">Verify with Current Password</label>
            <input
              name="currentPassword"
              type="password"
              required
              disabled={isPending}
              placeholder="Enter current password to save"
              className="w-full rounded-xl border-2 border-amber-200 p-3 text-sm dark:border-amber-900/40 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-4 rounded-xl bg-slate-900 text-white py-4 font-bold hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Changes...
          </>
        ) : "Save Profile Changes"}
      </button>
    </form>
  );
}
