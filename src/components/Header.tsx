import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getCartItemCount } from "@/lib/cart-data";
import { prisma } from "@/lib/prisma";
import { HeaderSearch } from "@/components/HeaderSearch";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileMenu } from "@/components/MobileMenu";
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
      {/* Top Row: Menu, Logo, Cart */}
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <MobileMenu session={session} categories={categories} />
            <Link href="/" className="flex items-center gap-1.5 group">
              <div className="text-amber-500 transition-transform group-hover:scale-110">
                <HomeIcon />
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-black tracking-tighter text-white">BAZAR</span>
                <span className="text-lg font-medium tracking-tighter text-amber-500">MART</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
             {/* Desktop Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium mr-4">
              <Link href="/products" className="hover:text-amber-400">Products</Link>
              <Link href="/orders" className="hover:text-amber-400">Orders</Link>
              {session?.user && (
                <Link href="/profile" className="hover:text-amber-400">Account</Link>
              )}
            </nav>

            {/* Cart Icon (Always visible) */}
            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-900 shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Row: Full width on mobile, max-width on desktop */}
        <div className="mt-2 pb-1">
          <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-slate-800" />}>
            <HeaderSearch />
          </Suspense>
        </div>
      </div>

      {/* Bottom Row: Categories (Horizontally Scrollable) */}
      <div className="border-t border-slate-800 bg-[#232f3e]">
        <div className="mx-auto max-w-7xl overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-x-6 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            <Link href="/products" className="text-amber-500 hover:text-amber-400">
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="text-slate-200 hover:text-amber-400 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
