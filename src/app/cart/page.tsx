import Link from "next/link";
import { CartLine } from "@/components/CartLine";
import { auth } from "@/auth";
import { getCartWithItems } from "@/lib/cart-data";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Shopping cart · BazarMart" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await auth();
  const cart = await getCartWithItems();

  const subtotal =
    cart?.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shopping cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            {cart.items.map((line) => (
              <CartLine key={line.id} line={line} />
            ))}
          </div>
          <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-4 flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900 dark:text-white">{formatMoney(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Taxes and shipping calculated at checkout (demo).</p>
            {session ? (
              <Link
                href="/checkout"
                className="mt-6 flex w-full justify-center rounded-lg bg-amber-500 py-3 font-semibold text-slate-900 hover:bg-amber-400"
              >
                Proceed to checkout
              </Link>
            ) : (
              <Link
                href="/login?callbackUrl=/checkout"
                className="mt-6 flex w-full justify-center rounded-lg bg-amber-500 py-3 font-semibold text-slate-900 hover:bg-amber-400"
              >
                Sign in to checkout
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
