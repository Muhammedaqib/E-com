import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Orders · Admin" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
      </div>
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 font-medium">Order #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">#{order.id}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">{order.user.name}</p>
                  <p className="text-slate-500">{order.user.email}</p>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {formatMoney(order.total)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-amber-600 hover:text-amber-500 dark:text-amber-500"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
