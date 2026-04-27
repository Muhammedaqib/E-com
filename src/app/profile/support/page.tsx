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

  // Fetch complaints and messages separately to bypass potential 'include' sync issues
  const complaints = await prisma.complaint.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const complaintsWithLastMessage = await Promise.all(complaints.map(async (c) => {
    let lastMessage = null;
    let unreadCount = 0;
    try {
      lastMessage = await prisma.complaintMessage.findFirst({
        where: { complaintId: c.id },
        orderBy: { createdAt: "desc" },
      });
      unreadCount = await prisma.complaintMessage.count({
        where: {
          complaintId: c.id,
          senderId: { not: session.user.id },
          isRead: false
        }
      });
    } catch (e) {
      console.error(`Error fetching messages for complaint ${c.id}:`, e);
    }
    return { ...c, lastMessage, unreadCount };
  }));

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
        {complaintsWithLastMessage.length > 0 ? (
          complaintsWithLastMessage.map((c) => (
            <Link 
              key={c.id} 
              href={`/profile/support/${c.id}`}
              className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm transition-all block"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg group-hover:text-amber-600 transition-colors">{c.subject}</h3>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-black text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  c.status === 'RESOLVED' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-1 mb-4">
                {c.lastMessage?.content || "Click to open conversation."}
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
