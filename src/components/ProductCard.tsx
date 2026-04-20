import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/generated/prisma";
import { formatMoney } from "@/lib/format";
import { parseProductImages } from "@/lib/product-utils";

type Props = {
  product: Product & { category?: { name: string; slug: string } };
};

export function ProductCard({ product }: Props) {
  const images = parseProductImages(product.images);
  const first = images[0] ?? "https://picsum.photos/seed/placeholder/600/600";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800">
        <Image
          src={first}
          alt={product.name}
          fill
          className="object-contain p-2 transition group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.featured && (
          <span className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-slate-900">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-slate-500">{product.category.name}</p>
        )}
        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-400">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {formatMoney(product.price)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-sm line-through text-slate-500">
              {formatMoney(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
