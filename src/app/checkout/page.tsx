import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { formatMoney } from "@/lib/format";
import { getCartWithItems } from "@/lib/cart-data";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout · BazarMart" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getCartWithItems();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
        <p>Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block font-medium text-amber-700 hover:underline">
          Shop products
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Checkout</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Demo checkout — payment is simulated; your order is saved as paid.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <CheckoutForm subtotal={subtotal} userName={session?.user?.name} />

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((line) => (
              <li key={line.id} className="flex justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  {line.product.name} × {line.quantity}
                </span>
                <span>{formatMoney(line.product.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-semibold dark:border-slate-700">
            <span>Total</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
