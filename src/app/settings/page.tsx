import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/SettingsClient";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Fetch fresh user data directly from DB to avoid stale session data
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans p-8 transition-colors duration-300">
      <SettingsClient user={{
        id: dbUser.id,
        name: dbUser.username,
        email: dbUser.email,
        role: dbUser.role
      }} />
    </div>
  );
}
