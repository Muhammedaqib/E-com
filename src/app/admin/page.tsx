import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const metadata = { title: "Admin · BazarMart" };

export default async function AdminHomePage() {
  const session = await auth();
  
  let role = session?.user?.role;

  // Ensure we have the latest role if possible
  if (session?.user?.id) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      });
      if (dbUser) role = dbUser.role;
    } catch (e) {
      console.error("Role fetch failed:", e);
    }
  }

  const [products, orders, users, complaints, myComplaints] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.complaint.count({ where: { status: "PENDING" } }),
    role ? prisma.complaint.count({ 
      where: { 
        status: "PENDING",
        targetRole: role as any
      }
    }) : Promise.resolve(0),
  ]);

  const isFullAdmin = role === "ADMIN";
  const isProductManager = role === "PRODUCT_MANAGER" || isFullAdmin;
  const isCustomerCare = role === "CUSTOMER_CARE" || role === "PRODUCT_MANAGER" || isFullAdmin;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Welcome back. You are logged in as <span className="font-bold text-amber-600">{role?.replace("_", " ")}</span>.
      </p>
      
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isProductManager && (
          <Link href="/admin/products" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Products</p>
            <p className="mt-1 text-3xl font-bold">{products}</p>
          </Link>
        )}

        {isCustomerCare && (
          <Link href={`/admin/complaints?target=${role}`} className="rounded-xl border border-amber-200 bg-amber-50/30 p-6 hover:border-amber-500 dark:border-amber-900/30 dark:bg-amber-900/10">
            <p className="text-sm text-amber-600 font-bold uppercase tracking-widest text-[10px]">Assigned to Me</p>
            <p className="mt-1 text-3xl font-bold text-amber-700">{myComplaints}</p>
          </Link>
        )}

        {isFullAdmin && (
          <>
            <Link href="/admin/orders" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Orders</p>
              <p className="mt-1 text-3xl font-bold">{orders}</p>
            </Link>
            <Link href="/admin/users" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Registered Users</p>
              <p className="mt-1 text-3xl font-bold">{users}</p>
            </Link>
          </>
        )}

        <Link href="/admin/complaints" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">All Pending Reports</p>
          <p className="mt-1 text-3xl font-bold">{complaints}</p>
        </Link>

        {isFullAdmin && (
          <Link href="/admin/home" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-amber-500 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-center items-center text-amber-600">
            <p className="font-bold">Edit Home</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Banner & Footer</p>
          </Link>
        )}
      </div>
    </div>
  );
}
