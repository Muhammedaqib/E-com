import Link from "next/link";
import Image from "next/link"; // Next.js Image would be better, but Link is what's currently used for placeholders
import { formatMoney } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product, Category } from "@prisma/client";

export function ProductCard({ 
  product 
}: { 
  product: Product & { category: Category } 
}) {
  const images = JSON.parse(product.images) as string[];
  const mainImage = images[0] || "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3 transition-all hover:border-amber-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.compareAt && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            SALE
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="mt-3 flex flex-1 flex-col sm:mt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
          {product.category.name}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white sm:text-base">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
              {formatMoney(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatMoney(product.compareAt)}
              </span>
            )}
          </div>
          
          <div className="w-10 sm:w-auto">
             <AddToCartButton productId={product.id} quantity={1} isIconOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
