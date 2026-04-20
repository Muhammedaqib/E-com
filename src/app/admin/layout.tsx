import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
        <nav className="mt-4 flex flex-col gap-2 text-sm">
          <Link href="/admin" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            Overview
          </Link>
          <Link href="/admin/products" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            Products
          </Link>
          <Link href="/admin/categories" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            Categories
          </Link>
          <Link href="/admin/orders" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            Orders
          </Link>
          <Link href="/admin/users" className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            Users
          </Link>
          <Link href="/" className="mt-4 rounded px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            ← Storefront
          </Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
