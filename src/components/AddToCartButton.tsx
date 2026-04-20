"use client";

import { useTransition } from "react";
import { addToCartAction } from "@/lib/actions/cart";

type Props = {
  productId: string;
  disabled?: boolean;
  stock: number;
};

export function AddToCartButton({ productId, disabled, stock }: Props) {
  const [pending, startTransition] = useTransition();
  const out = disabled ?? stock < 1;

  return (
    <button
      type="button"
      disabled={out || pending}
      onClick={() =>
        startTransition(async () => {
          await addToCartAction(productId, 1);
        })
      }
      className="w-full rounded-lg bg-amber-500 px-4 py-3 text-center font-semibold text-slate-900 shadow transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
    >
      {out ? "Out of stock" : pending ? "Adding…" : "Add to cart"}
    </button>
  );
}
