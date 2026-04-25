"use client";

import { useTransition } from "react";
import { deleteOrderAction } from "@/lib/actions/order";

export function RemoveOrderButton({ orderId }: { orderId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!confirm("Are you sure you want to remove this order from your list? This action cannot be undone.")) return;

    startTransition(async () => {
      const res = await deleteOrderAction(orderId);
      if (res && "error" in res) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="rounded bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {isPending ? "..." : "Remove"}
    </button>
  );
}
