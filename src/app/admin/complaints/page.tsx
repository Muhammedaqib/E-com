import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Complaints · Admin" };

export default async function AdminComplaintsPage() {
  const complaints = await prisma.complaint.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Complaints & Reports</h1>
      
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Subject</th>
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
                  {c.subject}
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
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="text-amber-600 hover:text-amber-500 font-bold"
                  >
                    View & Reply
                  </Link>
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
