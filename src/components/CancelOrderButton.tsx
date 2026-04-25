"use client";

import { useTransition } from "react";
import { cancelOrderAction } from "@/lib/actions/order";

export function CancelOrderButton({ orderId }: { orderId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    startTransition(async () => {
      const res = await cancelOrderAction(orderId);
      if (res && "error" in res) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="rounded bg-red-100 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
    >
      {isPending ? "..." : "Cancel"}
    </button>
  );
}
