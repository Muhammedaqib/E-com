"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

export function MobileMenu({ 
  session, 
  categories 
}: { 
  session: any;
  categories: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-800 md:hidden"
        aria-label="Open Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div className={`fixed inset-y-0 left-0 z-[101] w-72 transform bg-white dark:bg-slate-950 p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-amber-600">Navigation</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          {/* User Section */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Account</p>
            {session?.user ? (
              <div className="space-y-4">
                <Link href="/profile" className="flex items-center gap-3 text-slate-900 dark:text-white font-semibold">
                   <UserIcon /> {session.user.name || "My Profile"}
                </Link>
                <Link href="/orders" className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                   My Orders
                </Link>
                <SignOutButton />
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-3 text-amber-600 font-bold">
                Sign in / Register
              </Link>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Shop Section */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Shop</p>
            <div className="flex flex-col gap-4">
              <Link href="/products" className="font-semibold text-slate-900 dark:text-white">All Products</Link>
              <div className="grid grid-cols-1 gap-3 pl-2">
                {categories.map((c) => (
                  <Link key={c.id} href={`/products?category=${c.slug}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Admin Section */}
          {(session?.user?.role === "ADMIN" || session?.user?.role === "PRODUCT_MANAGER" || session?.user?.role === "CUSTOMER_CARE") && (
            <section className="mt-auto pt-6">
              <Link href="/admin" className="flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 p-3 text-sm font-bold text-amber-600 border border-amber-500/20">
                ⚙️ Admin Dashboard
              </Link>
            </section>
          )}
        </nav>
      </div>
    </>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
