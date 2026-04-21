import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin · BazarMart" };

export default async function AdminHomePage() {
  const [products, orders, users, complaints] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.complaint.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Manage catalog and monitor activity (demo admin).
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/products" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-1 text-3xl font-bold">{products}</p>
        </Link>
        <Link href="/admin/orders" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-1 text-3xl font-bold">{orders}</p>
        </Link>
        <Link href="/admin/users" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Users</p>
          <p className="mt-1 text-3xl font-bold">{users}</p>
        </Link>
        <Link href="/admin/complaints" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Pending Complaints</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{complaints}</p>
        </Link>
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
