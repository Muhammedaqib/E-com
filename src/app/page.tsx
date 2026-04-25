import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import type { Product, Category, SiteSettings } from "@prisma/client";

export default async function HomePage() {
  let featured: (Product & { category: Category })[] = [];
  let categories: Category[] = [];
  let settings: SiteSettings | null = null;

  try {
    const [f, c, s] = await Promise.all([
      prisma.product.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }) as Promise<(Product & { category: Category })[]>,
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
    ]);
    featured = f;
    categories = c;
    settings = s;
  } catch (error) {
    console.error("Home page data fetch failed:", error);
  }

  const s = settings || {
    bannerTitle: "Shop smarter today",
    bannerText: "Fast delivery, secure checkout, and thousands of products — a full storefront demo built with Next.js and Prisma.",
    bannerButton: "Browse all products",
    bannerImage: null,
    categoriesTitle: "Shop by category",
    showCategories: true,
    featuredTitle: "Featured picks",
    showFeatured: true,
  };

  return (
    <div className="space-y-12">
      <section 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 px-6 py-16 text-white shadow-lg sm:px-12"
        style={s.bannerImage ? { backgroundImage: `url(${s.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {s.bannerImage && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{s.bannerTitle}</h1>
          <p className="mt-4 text-lg text-amber-50">
            {s.bannerText}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-orange-700 shadow hover:bg-amber-50"
          >
            {s.bannerButton}
          </Link>
        </div>
      </section>

      {s.showCategories && categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {s.categoriesTitle}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center transition-all hover:border-amber-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white uppercase tracking-tight">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {s.showFeatured && featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {s.featuredTitle}
            </h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-amber-600 hover:text-amber-500"
            >
              View all products &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {!s.showFeatured && !s.showCategories && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-medium text-slate-400">Welcome to BazarMart</h2>
          <p className="mt-2 text-slate-500">Check out our full collection of products below.</p>
          <Link href="/products" className="mt-6 text-amber-600 font-bold hover:underline">
            Browse Products &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
