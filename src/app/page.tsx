import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let featured = [];
  let categories = [];
  let settings = null;

  try {
    const [f, c, s] = await Promise.all([
      prisma.product.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
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

      {s.showCategories && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{s.categoriesTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center font-medium shadow-sm transition hover:border-amber-400 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-500"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {s.showFeatured && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{s.featuredTitle}</h2>
            <Link href="/products" className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400">
              See all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
