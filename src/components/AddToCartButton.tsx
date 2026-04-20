"use client";

import { useTransition, useState, useEffect } from "react";
import { addToCartAction } from "@/lib/actions/cart";

type Props = {
  productId: string;
  disabled?: boolean;
  stock: number;
};

export function AddToCartButton({ productId, disabled, stock }: Props) {
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const out = disabled ?? stock < 1;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAdd = () => {
    setError(null);
    startTransition(async () => {
      const res = await addToCartAction(productId, quantity);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {!out && (
        <div className="flex items-center gap-3">
          <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-950"
            disabled={pending}
          >
            {[...Array(Math.min(10, stock))].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={out || pending}
          onClick={handleAdd}
          className={`w-full rounded-lg px-4 py-3 text-center font-semibold shadow transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px] ${
            success 
              ? "bg-green-500 text-white" 
              : "bg-amber-500 text-slate-900 hover:bg-amber-400"
          }`}
        >
          {out ? "Out of stock" : pending ? "Adding…" : success ? "Added!" : "Add to cart"}
        </button>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
}
