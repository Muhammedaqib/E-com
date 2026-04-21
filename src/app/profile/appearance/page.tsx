import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = { title: "Appearance · BazarMart" };

export default async function AppearancePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile/appearance");
  }

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Appearance</h1>

      <section className="bg-white p-6 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          🎨 Theme Settings
        </h2>
        <p className="text-sm text-slate-500 mb-6">Customize how your dashboard looks. Switch between light and dark modes.</p>
        <ThemeToggle />
      </section>
    </div>
  );
}
