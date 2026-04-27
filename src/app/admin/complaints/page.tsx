import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteComplaintButton } from "@/components/admin/DeleteComplaintButton";

export const metadata = { title: "Complaints · Admin" };

export default async function AdminComplaintsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ target?: string; view?: string }> 
}) {
  const { target, view } = await searchParams;
  
  // Validate target to ensure it's a valid role or undefined
  const validRoles = ["ADMIN", "PRODUCT_MANAGER", "CUSTOMER_CARE"];
  const targetRole = target && validRoles.includes(target) ? (target as any) : undefined;

  // Logic for separation and visibility:
  // 1. If view=management -> Show reports created BY staff (Oversight)
  // 2. If targetRole is set -> Show everything targeted AT that role (Discussions & Inbox)
  // 3. Default -> Show reports created BY regular users (General Support)
  const complaints = await prisma.complaint.findMany({
    where: view === "management" 
      ? { user: { role: { in: ["PRODUCT_MANAGER", "CUSTOMER_CARE"] } } }
      : targetRole
      ? { targetRole } 
      : { user: { role: "USER" } },
    include: { 
      user: true,
      _count: {
        select: {
          messages: {
            where: { isRead: false }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const title = view === "management"
    ? "Staff Discussions & Management"
    : target === "ADMIN" 
    ? "Admin Internal Messages" 
    : target === "PRODUCT_MANAGER" 
    ? "Product Management Messages" 
    : "User Complaints & Reports";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <Link 
          href="/orders/report"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400 shadow-sm transition-all"
        >
          + New Message
        </Link>
      </div>
      
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Subject</th>
              <th className="px-6 py-3 font-medium">Target</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">{c.user.name || "N/A"}</p>
                  <p className="text-xs text-slate-500">{c.user.email}</p>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    {c.subject}
                    {c._count.messages > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-black text-white">
                        {c._count.messages}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {c.targetRole.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    c.status === 'RESOLVED' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="text-amber-600 hover:text-amber-500 font-bold"
                  >
                    View & Reply
                  </Link>
                  <DeleteComplaintButton complaintId={c.id} />
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No complaints or reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
