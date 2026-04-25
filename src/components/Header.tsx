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
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight group">
          <div className="text-amber-500 transition-transform group-hover:scale-110">
            <HomeIcon />
          </div>
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
                <Link href="/profile" className="flex items-center gap-2 hover:text-amber-400 transition-colors group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-200 group-hover:bg-amber-500 group-hover:text-slate-900 shadow-inner">
                    <UserIcon />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-slate-500">My Account</span>
                    <span className="font-bold text-white">
                      {session.user.name ?? session.user.email?.split("@")[0]}
                    </span>
                  </div>
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link href="/login" className="hover:text-amber-400">
                Sign in
              </Link>
            )}
          </span>
          {(session?.user?.role === "ADMIN" || session?.user?.role === "PRODUCT_MANAGER" || session?.user?.role === "CUSTOMER_CARE") && (
            <Link
              href="/admin"
              className="rounded border border-slate-600 px-2 py-1 hover:border-amber-500 hover:text-amber-400"
            >
              {session.user.role === "CUSTOMER_CARE" ? "CC" : "Admin"}
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

function UserIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
