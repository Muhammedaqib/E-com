import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Fetch latest role from DB to ensure it's not stale
  const dbUser = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  }) : null;

  const role = dbUser?.role;

  // Basic check: Must be one of the admin roles
  if (!session?.user?.id || !role || (role !== "ADMIN" && role !== "PRODUCT_MANAGER" && role !== "CUSTOMER_CARE")) {
    redirect("/");
  }

  const isFullAdmin = role === "ADMIN";
  const isProductManager = role === "PRODUCT_MANAGER" || isFullAdmin;
  const isCustomerCare = role === "CUSTOMER_CARE" || role === "PRODUCT_MANAGER" || isFullAdmin;

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {role === "CUSTOMER_CARE" ? "Customer Panel" : "Admin Panel"}
        </p>
        <p className="mt-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded w-fit uppercase">
          {role?.replace("_", " ")}
        </p>
        
        <nav className="mt-4 flex flex-col gap-2 text-sm">
          <Link href="/admin" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            Overview
          </Link>

          {isProductManager && (
            <>
              <Link href="/admin/products" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Products
              </Link>
              <Link href="/admin/categories" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Categories
              </Link>
              {role === "PRODUCT_MANAGER" && (
                <>
                  <Link href="/admin/complaints?target=ADMIN" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                    Admin Messages
                  </Link>
                  <Link href="/admin/complaints?target=PRODUCT_MANAGER" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                    Customer Care Messages
                  </Link>
                </>
              )}
            </>
          )}

          {isFullAdmin && (
            <>
              <Link href="/admin/orders" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Orders
              </Link>
              <Link href="/admin/users" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Users
              </Link>
              <Link href="/admin/home" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Edit Home
              </Link>
              <Link href="/admin/complaints" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Complaints
              </Link>
              <Link href="/admin/complaints?view=management" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-amber-600">
                Management
              </Link>
            </>
          )}

          {role === "CUSTOMER_CARE" && (
            <>
              <Link href="/admin/complaints" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Complaints
              </Link>
              <Link href="/admin/complaints?target=ADMIN" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Admin Messages
              </Link>
              <Link href="/admin/complaints?target=PRODUCT_MANAGER" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                Product Messages
              </Link>
            </>
          )}

          <Link href="/" className="mt-4 rounded px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 pt-4">
            ← Storefront
          </Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
