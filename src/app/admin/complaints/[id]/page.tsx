import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChatBox } from "@/components/ChatBox";
import { auth } from "@/auth";
import { ResolveComplaintButtons } from "@/components/admin/ResolveComplaintButtons";

export default async function AdminComplaintDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "CUSTOMER_CARE" && role !== "PRODUCT_MANAGER") {
    redirect("/");
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { 
      user: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" }
      }
    },
  });

  if (!complaint) {
    return notFound();
  }

  const hasAdminReplied = complaint.messages.some(m => m.sender.role === "ADMIN" || m.sender.role === "CUSTOMER_CARE" || m.sender.role === "PRODUCT_MANAGER");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/complaints" 
          className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Back to List
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-amber-600">Admin Chat Support</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">User Details</h2>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{complaint.user.name || "N/A"}</p>
              <p className="text-xs text-slate-500">{complaint.user.email}</p>
              <p className="text-xs text-slate-500">{complaint.user.phone || "No phone"}</p>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Ticket Status</h2>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">{complaint.subject}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  complaint.status === 'RESOLVED' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {complaint.status}
                </span>
                <span className="w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Target: {complaint.targetRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <ResolveComplaintButtons 
              complaintId={complaint.id} 
              isUnlocked={hasAdminReplied} 
              currentStatus={complaint.status}
            />
          </section>
        </div>

        {/* Chat Column */}
        <div className="lg:col-span-2">
          <ChatBox 
            complaintId={complaint.id} 
            messages={complaint.messages} 
            currentUserId={session.user.id} 
          />
        </div>
      </div>
    </div>
  );
}
