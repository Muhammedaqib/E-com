"use client";

import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import { OrderStatus } from "@/generated/prisma";
import { useState, useTransition } from "react";

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(currentStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    const oldStatus = localStatus;
    setLocalStatus(newStatus);
    
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result && "error" in result) {
        alert(result.error || "Failed to update status");
        setLocalStatus(oldStatus);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={localStatus}
        onChange={handleChange}
        disabled={isPending}
        className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-950 disabled:opacity-50"
      >
        <option value="PENDING">PENDING</option>
        <option value="PAID">PAID</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      {isPending && <span className="text-xs text-slate-500 animate-pulse">Saving...</span>}
    </div>
  );
}
