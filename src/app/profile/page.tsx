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
      </div>
    </div>
  );
}
