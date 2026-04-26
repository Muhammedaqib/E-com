import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileNav } from "@/components/ProfileNav";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch latest role from DB to ensure it's not stale
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });
  
  const role = dbUser?.role;
  const isStaff = role === "ADMIN" || role === "PRODUCT_MANAGER" || role === "CUSTOMER_CARE";

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      <aside className="h-fit space-y-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0f172a] shadow-sm">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Account Settings</p>
          <ProfileNav isStaff={isStaff} />
        </div>

        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Back to Storefront
        </Link>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
