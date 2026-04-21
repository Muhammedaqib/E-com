import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ReplyForm } from "@/components/admin/ReplyForm";

export default async function AdminComplaintDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!complaint) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/complaints" 
          className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Complaint Details</h1>
      </div>

      <div className="grid gap-6">
        {/* User Message */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-lg text-slate-900 dark:text-white">{complaint.user.name || "N/A"}</p>
              <p className="text-sm text-slate-500">{complaint.user.email}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              complaint.status === 'RESOLVED' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {complaint.status}
            </span>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-2">Subject</h3>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-6">{complaint.subject}</p>
            
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-2">Message</h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {complaint.message}
            </p>
          </div>
        </div>

        {/* Reply Section */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 shadow-inner">
          <h2 className="text-lg font-bold mb-6">Admin Response</h2>
          <ReplyForm complaintId={complaint.id} currentReply={complaint.reply} />
        </div>
      </div>
    </div>
  );
}
