import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600 dark:text-slate-400">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Shop</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/products" className="hover:text-amber-600">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-amber-600">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Account</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/login" className="hover:text-amber-600">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-600">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-amber-600">
                  Your orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">BazarMart</p>
            <p className="mt-2">
              Demo marketplace built with Next.js, Prisma, and NextAuth — inspired by modern
              e‑commerce experiences.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} BazarMart. For demonstration only.
        </p>
      </div>
    </footer>
  );
}
