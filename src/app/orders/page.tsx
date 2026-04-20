import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Your orders · BazarMart" };

type Addr = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  phone: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ placed?: string }>;
}) {
  const sp = await searchParams;
  const userId = (await auth())?.user?.id;
  if (!userId) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your orders</h1>
      {sp.placed === "1" && (
        <p className="mt-2 rounded-lg bg-green-50 p-3 text-green-800 dark:bg-green-950/50 dark:text-green-200">
          Thank you! Your order was placed successfully.
        </p>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">You have not placed any orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {orders.map((order) => {
            let addr: Addr | null = null;
            try {
              addr = JSON.parse(order.address) as Addr;
            } catch {
              addr = null;
            }
            return (
              <li
                key={order.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div>
                    <span className="text-sm text-slate-500">Order</span>{" "}
                    <span className="font-mono text-sm font-medium">#{order.id}</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="font-semibold">{formatMoney(order.total)}</div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
                      {order.status}
                    </span>
                    <Link
                      href={`/orders/${order.id}/invoice`}
                      className="rounded bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      Invoice
                    </Link>
                  </div>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>{formatMoney(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                {addr && (
                  <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                    <p className="font-medium text-slate-800 dark:text-slate-200">Ship to</p>
                    <p className="mt-1">
                      {addr.fullName}
                      <br />
                      {addr.line1}
                      {addr.line2 ? (
                        <>
                          <br />
                          {addr.line2}
                        </>
                      ) : null}
                      <br />
                      {addr.city} {addr.postalCode}
                      <br />
                      {addr.phone}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
