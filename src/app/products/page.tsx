import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sort?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const categorySlug = sp.category?.trim();
  const sort = sp.sort === "price_asc" || sp.sort === "price_desc" ? sp.sort : "newest";

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  if (categorySlug && !category) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        Unknown category.{" "}
        <Link href="/products" className="font-medium underline">
          View all products
        </Link>
      </div>
    );
  }

  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {},
      category ? { categoryId: category.id } : {},
    ],
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
    take: 48,
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const queryBase = new URLSearchParams();
  if (q) queryBase.set("q", q);
  if (categorySlug) queryBase.set("category", categorySlug);

  const sortLink = (value: string) => {
    const p = new URLSearchParams(queryBase);
    p.set("sort", value);
    return `/products?${p.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All products</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {category ? `Category: ${category.name}` : "Browse the full catalog"}
          {q ? ` · Search: “${q}”` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-600 dark:text-slate-400">Category:</span>
        <Link
          href={q ? `/products?q=${encodeURIComponent(q)}` : "/products"}
          className={`rounded-full px-3 py-1 text-sm ${!categorySlug ? "bg-amber-500 text-slate-900" : "bg-slate-200 dark:bg-slate-800"}`}
        >
          All
        </Link>
        {categories.map((c) => {
          const p = new URLSearchParams();
          if (q) p.set("q", q);
          p.set("category", c.slug);
          return (
            <Link
              key={c.id}
              href={`/products?${p.toString()}`}
              className={`rounded-full px-3 py-1 text-sm ${
                categorySlug === c.slug
                  ? "bg-amber-500 text-slate-900"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">Sort:</span>
        <Link href={sortLink("newest")} className={sort === "newest" ? "font-semibold text-amber-700 dark:text-amber-400" : ""}>
          Newest
        </Link>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <Link href={sortLink("price_asc")} className={sort === "price_asc" ? "font-semibold text-amber-700 dark:text-amber-400" : ""}>
          Price: Low to High
        </Link>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <Link href={sortLink("price_desc")} className={sort === "price_desc" ? "font-semibold text-amber-700 dark:text-amber-400" : ""}>
          Price: High to Low
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No products match your filters.{" "}
          <Link href="/products" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
            Clear filters
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
