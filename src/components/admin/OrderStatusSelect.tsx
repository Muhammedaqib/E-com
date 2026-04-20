"use client";

import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import { OrderStatus } from "@/generated/prisma";
import { useState } from "react";

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      await updateOrderStatusAction(orderId, newStatus);
    } catch (err) {
      alert("Failed to update status");
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-950"
      >
        <option value="PENDING">PENDING</option>
        <option value="PAID">PAID</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      {isUpdating && <span className="text-xs text-slate-500 animate-pulse">Updating...</span>}
    </div>
  );
}
