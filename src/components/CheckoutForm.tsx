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

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await placeOrderAction(formData);
      if (res && res.error) {
        if (typeof res.error === "string") {
          setError(res.error);
        } else {
          setError("Check the form for errors.");
        }
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="font-semibold">Shipping address</h2>
      
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input
          name="fullName"
          required
          disabled={isPending}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
          defaultValue={userName ?? ""}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Address line 1</label>
        <input
          name="line1"
          required
          disabled={isPending}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Address line 2</label>
        <input
          name="line2"
          disabled={isPending}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            name="city"
            required
            disabled={isPending}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Postal code</label>
          <input
            name="postalCode"
            required
            disabled={isPending}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
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
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-amber-500 py-3 font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Placing order..." : `Place order (${formatMoney(subtotal)})`}
      </button>
    </form>
  );
}
