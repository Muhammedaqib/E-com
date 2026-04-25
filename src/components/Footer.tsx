import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function Footer() {
  const session = await auth();
  
  // Fetch user details if logged in to get the phone number
  const user = session?.user?.id 
    ? await prisma.user.findUnique({ 
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true }
      }) 
    : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = prisma as any;
  const settings = client.siteSettings 
    ? await client.siteSettings.findUnique({ where: { id: "default" } })
    : null;
  
  const about = settings || {
    footerAboutTitle: "BazarMart",
    footerAboutText: "Demo marketplace built with Next.js, Prisma, and NextAuth — inspired by modern e-commerce experiences."
  };

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
              {user ? (
                <>
                  <li className="text-slate-600 dark:text-slate-400 font-medium">
                    {user.name || "No name"}
                  </li>
                  <li className="text-slate-500 dark:text-slate-500">
                    {user.email}
                  </li>
                  <li className="text-slate-500 dark:text-slate-500 italic">
                    {user.phone || "No phone number"}
                  </li>
                </>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{about.footerAboutTitle}</p>
            <p className="mt-2">
              {about.footerAboutText}
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {about.footerAboutTitle}. For demonstration only.
        </p>
      </div>
    </footer>
  );
}
