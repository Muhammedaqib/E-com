"use client";

import { useState, useTransition } from "react";
import { placeOrderAction } from "@/lib/actions/order";
import { formatMoney } from "@/lib/format";

type Props = {
  subtotal: number;
  userName?: string | null;
};

export function CheckoutForm({ subtotal, userName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const res = await placeOrderAction(formData);
        if (res && res.error) {
          setError(typeof res.error === "string" ? res.error : "Check the form for errors.");
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="font-semibold text-lg">Shipping address</h2>
      
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            name="fullName"
            required
            disabled={isPending}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50 transition-opacity"
            defaultValue={userName ?? ""}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address line 1</label>
          <input
            name="line1"
            required
            disabled={isPending}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50 transition-opacity"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address line 2 (optional)</label>
          <input
            name="line2"
            disabled={isPending}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50 transition-opacity"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              name="city"
              required
              disabled={isPending}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50 transition-opacity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Postal code</label>
            <input
              name="postalCode"
              required
              disabled={isPending}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50 transition-opacity"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            name="phone"
            required
            type="tel"
            disabled={isPending}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50 transition-opacity"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 rounded-lg bg-amber-500 py-3 font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Placing order...
          </span>
        ) : (
          `Place order (${formatMoney(subtotal)})`
        )}
      </button>
    </form>
  );
}
