"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { removeCartItemAction, updateCartItemAction } from "@/lib/actions/cart";
import { formatMoney } from "@/lib/format";
import type { CartItem, Product } from "@prisma/client";
import { parseProductImages } from "@/lib/product-utils";

type Line = CartItem & { product: Product & { slug: string } };

export function CartLine({ line }: { line: Line }) {
  const [pending, startTransition] = useTransition();
  const images = parseProductImages(line.product.images);
  const thumb = images[0] ?? "https://picsum.photos/seed/cart/200/200";

  return (
    <div className="flex flex-wrap gap-4 border-b border-slate-200 py-6 last:border-0 dark:border-slate-800">
      <Link
        href={`/product/${line.product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800"
      >
        <Image src={thumb} alt={line.product.name} fill className="object-cover" sizes="96px" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/product/${line.product.slug}`} className="font-semibold hover:text-amber-700 dark:hover:text-amber-400">
          {line.product.name}
        </Link>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {formatMoney(line.product.price)} each
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            Qty
            <select
              disabled={pending}
              value={line.quantity}
              onChange={(e) => {
                const q = Number(e.target.value);
                startTransition(async () => {
                  await updateCartItemAction(line.id, q);
                });
              }}
              className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
            >
              {Array.from({ length: Math.min(20, line.product.stock) }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ),
              )}
            </select>
          </label>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await removeCartItemAction(line.id);
              })
            }
            className="text-sm text-red-600 hover:underline dark:text-red-400"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="text-right font-semibold">{formatMoney(line.product.price * line.quantity)}</div>
    </div>
  );
}
