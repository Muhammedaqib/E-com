import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getCartItemCount } from "@/lib/cart-data";
import { prisma } from "@/lib/prisma";
import { HeaderSearch } from "@/components/HeaderSearch";
import { SignOutButton } from "@/components/SignOutButton";

export async function Header() {
  const session = await auth();
  const cartCount = await getCartItemCount();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 12,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#131921] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight">
          <span className="rounded bg-amber-500 px-2 py-0.5 text-slate-900">Bazar</span>
          <span className="hidden font-semibold sm:inline">Mart</span>
        </Link>

        <Suspense
          fallback={
            <div className="mx-auto h-11 w-full max-w-2xl flex-1 animate-pulse rounded-md bg-slate-700" />
          }
        >
          <HeaderSearch />
        </Suspense>

        <nav className="flex flex-wrap items-center justify-end gap-3 text-sm sm:ml-auto sm:gap-4">
          <span className="hidden items-center gap-2 text-slate-400 lg:flex">
            {session?.user ? (
              <>
                <span>
                  Hello,{" "}
                  <span className="font-medium text-white">
                    {session.user.name ?? session.user.email?.split("@")[0]}
                  </span>
                </span>
                <SignOutButton />
              </>
            ) : (
              <Link href="/login" className="hover:text-amber-400">
                Sign in
              </Link>
            )}
          </span>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded border border-slate-600 px-2 py-1 hover:border-amber-500 hover:text-amber-400"
            >
              Admin
            </Link>
          )}
          <Link
            href="/orders"
            className="hover:text-amber-400"
          >
            Orders
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1.5 hover:border-amber-500"
          >
            <CartIcon />
            <span className="font-semibold text-amber-400">{cartCount}</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-slate-800 bg-[#232f3e] px-4 py-2">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link href="/products" className="font-medium hover:text-amber-400">
            All products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="text-slate-200 hover:text-amber-400"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <span className="inline-flex text-lg" aria-hidden>
      🛒
    </span>
  );
}
