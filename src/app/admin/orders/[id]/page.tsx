import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return notFound();
  }

  const address = JSON.parse(order.address);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Order #{order.orderNumber}
        </h1>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Customer & Shipping Info */}
        <div className="lg:col-span-1 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Customer</h2>
            <div className="mt-4">
              <p className="font-medium text-slate-900 dark:text-white">{order.user.name}</p>
              <p className="text-slate-500">{order.user.email}</p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Shipping Address</h2>
            <div className="mt-4 text-slate-600 dark:text-slate-400">
              <p className="font-medium text-slate-900 dark:text-white">{address.fullName}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.postalCode}</p>
              <p className="mt-2 text-sm">Phone: {address.phone}</p>
            </div>
          </section>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <h2 className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200 dark:border-slate-800">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Quantity</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500">ID: {item.productId}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatMoney(item.price)}</td>
                      <td className="px-6 py-4 text-slate-500">x {item.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                        {formatMoney(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-950 font-bold border-t border-slate-200 dark:border-slate-800">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right">Grand Total</td>
                    <td className="px-6 py-4 text-right text-lg text-amber-600 dark:text-amber-500">
                      {formatMoney(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
