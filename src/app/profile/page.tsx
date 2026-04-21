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
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Profile Settings</h1>

      <div className="space-y-10">
        {/* Personal Info & Security */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            👤 Personal Information
          </h2>
          <ProfileForm user={user} />
        </section>

        {/* Appearance */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            🎨 Appearance
          </h2>
          <p className="text-sm text-slate-500 mb-4">Choose how BazarMart looks for you.</p>
          <ThemeToggle />
        </section>

        {/* Invoice Messages / Recent Orders */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            📄 Invoice Messages
          </h2>
          <p className="text-sm text-slate-500 mb-6">View and download your digital invoices for recent purchases.</p>
          
          <div className="space-y-4">
            {user.orders.length > 0 ? (
              user.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Order #{order.id}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Link 
                    href={`/orders/${order.id}/invoice`}
                    className="text-sm font-bold text-amber-700 hover:text-amber-600 dark:text-amber-500"
                  >
                    View Invoice →
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl dark:border-slate-800">
                <p className="text-slate-500 text-sm">No recent invoices found.</p>
              </div>
            )}
            {user.orders.length > 0 && (
              <div className="pt-4 text-center">
                <Link href="/orders" className="text-sm font-bold text-slate-500 hover:underline">
                  View all orders
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
