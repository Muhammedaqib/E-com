import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin · BazarMart" };

export default async function AdminHomePage() {
  const [products, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Manage catalog and monitor activity (demo admin).
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-1 text-3xl font-bold">{products}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-1 text-3xl font-bold">{orders}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Users</p>
          <p className="mt-1 text-3xl font-bold">{users}</p>
        </div>
      </div>
      <Link
        href="/admin/products"
        className="mt-8 inline-flex rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-400"
      >
        Manage products
      </Link>
    </div>
  );
}
