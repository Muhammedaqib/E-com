import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0f172a] shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Account</p>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          <Link href="/profile" className="rounded px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-all">
            Profile Details
          </Link>
          <Link href="/orders" className="rounded px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-all">
            My Orders
          </Link>
          <Link href="/orders/report" className="rounded px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-all">
            Report Issue
          </Link>
          <Link href="/profile/invoices" className="rounded px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-all">
            Recent Invoices
          </Link>
          <Link href="/profile/appearance" className="rounded px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-all">
            Appearance
          </Link>
          <div className="my-4 border-t border-slate-100 dark:border-slate-800" />
          <Link href="/" className="rounded px-3 py-2 font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Storefront
          </Link>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
