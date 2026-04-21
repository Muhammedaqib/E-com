import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Support Messages · BazarMart" };

export default async function SupportPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile/support");
  }

  const complaints = await prisma.complaint.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      }
    }
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Support Messages</h1>
        <Link 
          href="/orders/report"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400 shadow-sm transition-all"
        >
          New Report
        </Link>
      </div>

      <div className="grid gap-4">
        {complaints.length > 0 ? (
          complaints.map((c) => (
            <Link 
              key={c.id} 
              href={`/profile/support/${c.id}`}
              className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm transition-all block"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg group-hover:text-amber-600 transition-colors">{c.subject}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  c.status === 'RESOLVED' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-1 mb-4">
                {c.messages[0]?.content || "No messages yet."}
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
                <span>Last updated: {new Date(c.updatedAt).toLocaleDateString()}</span>
                <span className="font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">Open Chat →</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 font-medium">No support conversations yet.</p>
            <Link href="/orders/report" className="mt-4 inline-block text-amber-600 font-bold hover:underline">
              Submit your first report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
