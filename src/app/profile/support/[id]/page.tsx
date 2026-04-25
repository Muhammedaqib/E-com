import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChatBox } from "@/components/ChatBox";

export default async function UserChatPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!complaint || complaint.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="space-y-8 pb-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/profile/support" 
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-tight">Support Chat</h1>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-slate-900 dark:text-white">{complaint.subject}</h2>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
            complaint.status === 'RESOLVED' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {complaint.status}
          </span>
        </div>
      </div>

      <ChatBox 
        complaintId={complaint.id} 
        messages={complaint.messages} 
        currentUserId={session.user.id} 
      />
    </div>
  );
}
