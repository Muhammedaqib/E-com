"use client";

import { useTransition } from "react";
import { addToCartAction } from "@/lib/actions/cart";

export function AddToCartButton({ 
  productId, 
  quantity = 1,
  isIconOnly = false
}: { 
  productId: string, 
  quantity?: number,
  isIconOnly?: boolean
}) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await addToCartAction(productId, quantity);
    });
  }

  if (isIconOnly) {
    return (
      <button
        onClick={onClick}
        disabled={isPending}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-sm"
        title="Add to cart"
      >
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        ) : (
          <span className="text-xl">+</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-95 shadow-md"
    >
      {isPending ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          <span className="text-xl">🛒</span>
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
