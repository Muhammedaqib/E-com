import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export const metadata = { title: "Your Profile · BazarMart" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      }
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Profile Settings</h1>

      <div className="space-y-8">
        {/* Personal Info & Security */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            👤 Personal Information
          </h2>
          <ProfileForm user={user} />
        </section>

        {/* Appearance */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            🎨 Appearance
          </h2>
          <ThemeToggle />
        </section>

        {/* Invoice Messages */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            📄 Recent Invoices
          </h2>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {user.orders.length > 0 ? (
              user.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Invoice #{order.id}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Link 
                    href={`/orders/${order.id}/invoice`}
                    className="text-xs font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-4 text-slate-500 text-sm italic">No recent invoices.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
