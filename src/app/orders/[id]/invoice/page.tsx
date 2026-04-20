import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Invoice · BazarMart" };

export default async function UserInvoicePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: numericId },
    include: {
      items: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    return notFound();
  }

  const address = JSON.parse(order.address);

  return (
    <div className="mx-auto max-w-4xl py-10 print:py-0">
      <div className="bg-white p-8 shadow-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-lg min-h-[1000px] flex flex-col">
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 dark:border-slate-800">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Invoice</h1>
            <p className="mt-2 text-slate-500 font-medium">#{order.id}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-amber-600">BazarMart</h2>
            <p className="text-sm text-slate-500">123 Marketplace Ave, Digital City</p>
            <p className="text-sm text-slate-500">contact@bazarmart.com</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Billed To</h3>
            <div className="text-slate-700 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">{address.fullName}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.postalCode}</p>
              <p className="mt-2 text-sm">{address.phone}</p>
              <p className="mt-1 text-sm">{session.user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Details</h3>
            <div className="text-slate-700 dark:text-slate-300 space-y-1">
              <p><span className="text-slate-400">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="text-slate-400">Status:</span> {order.status}</p>
              <p><span className="text-slate-400">Payment:</span> Credit Card</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-900 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white dark:border-white">
                <th className="py-4">Description</th>
                <th className="py-4 text-center">Price</th>
                <th className="py-4 text-center">Qty</th>
                <th className="py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="py-6">
                    <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-1">ID: {item.productId}</p>
                  </td>
                  <td className="py-6 text-center">{formatMoney(item.price)}</td>
                  <td className="py-6 text-center">{item.quantity}</td>
                  <td className="py-6 text-right font-bold text-slate-900 dark:text-white">
                    {formatMoney(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 pt-10 border-t-2 border-slate-900 dark:border-white">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatMoney(order.total)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-slate-200 pt-3 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center text-xs text-slate-400 uppercase tracking-widest">
          Thank you for your business
        </div>
        
        <div className="mt-10 flex gap-4 print:hidden justify-center">
          <button
            onClick="window.print()"
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition dark:bg-white dark:text-slate-900"
          >
            Print Invoice
          </button>
          <Link
            href="/orders"
            className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
