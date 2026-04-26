import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getCartItemCount } from "@/lib/cart-data";
import { prisma } from "@/lib/prisma";
import { HeaderSearch } from "@/components/HeaderSearch";
import { SignOutButton } from "@/components/SignOutButton";
import type { Category } from "@prisma/client";

export async function Header() {
  const session = await auth();
  const cartCount = await getCartItemCount();
  
  let categories: Category[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 12,
    });
  } catch (error) {
    console.error("Header category fetch failed:", error);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#131921] text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Top Row: Logo, Search (desktop), and Nav */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight group">
            <div className="text-amber-500 transition-transform group-hover:scale-110">
              <HomeIcon />
            </div>
            <span className="rounded bg-amber-500 px-2 py-0.5 text-slate-900">Bazar</span>
            <span className="hidden font-semibold xs:inline">Mart</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-2xl md:block">
            <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-md bg-slate-700" />}>
              <HeaderSearch />
            </Suspense>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            {session?.user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:text-amber-400 transition-colors group">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-200 group-hover:bg-amber-500 group-hover:text-slate-900 shadow-inner">
                  <UserIcon />
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[10px] text-slate-500">Account</span>
                  <span className="font-bold text-white text-xs">
                    {session.user.name?.split(" ")[0] ?? "User"}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-amber-400">
                Sign in
              </Link>
            )}

            <Link href="/cart" className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 hover:bg-slate-700 border border-slate-700">
              <CartIcon />
              <span className="font-bold text-amber-400 text-sm">{cartCount}</span>
            </Link>

            {session?.user && (
              <div className="hidden sm:block">
                <SignOutButton />
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Search Row */}
        <div className="mt-3 md:hidden">
          <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-md bg-slate-700" />}>
            <HeaderSearch />
          </Suspense>
        </div>
      </div>

      {/* Categories Bar: Horizontal scroll on mobile */}
      <div className="border-t border-slate-800 bg-[#232f3e] overflow-x-auto no-scrollbar">
        <div className="mx-auto flex max-w-7xl items-center gap-x-5 px-4 py-2 text-xs font-medium whitespace-nowrap">
          <Link href="/products" className="hover:text-amber-400 border-r border-slate-700 pr-4">
            All Products
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
  return <span className="text-lg">🛒</span>;
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
