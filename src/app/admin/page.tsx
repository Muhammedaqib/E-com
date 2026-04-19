import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toggleUserStatus, deleteUser, updateUserRole } from "@/lib/admin-actions";
import Link from "next/link";
import { 
  Users, 
  History, 
  ShieldAlert, 
  ChevronLeft, 
  UserMinus, 
  UserCog, 
  CircleCheck, 
  CircleX,
  Clock
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  const allUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: { tasks: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const recentActivity = await prisma.activityLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" size={24} />
              <h1 className="text-xl font-bold tracking-tight">Admin Control Panel</h1>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-500">
            System Admin: <span className="text-slate-900 dark:text-white font-bold">{session.user.name}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Management Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users size={20} className="text-indigo-600" />
                  User Management
                </h2>
                <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full uppercase">
                  {allUsers.length} Total Users
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Tasks</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{user.username}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                              <CircleCheck size={14} /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                              <CircleX size={14} /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium">{user._count.tasks} tasks</span>
                        </td>
                        <td className="px-6 py-4">
                          <form action={updateUserRole.bind(null, user.id, user.role === "admin" ? "user" : "admin")}>
                            <button type="submit" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${
                              user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}>
                              {user.role}
                            </button>
                          </form>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <form action={toggleUserStatus.bind(null, user.id, user.isActive)}>
                              <button type="submit" title={user.isActive ? "Suspend User" : "Activate User"} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                                <UserCog size={18} />
                              </button>
                            </form>
                            <form action={deleteUser.bind(null, user.id)}>
                              <button type="submit" title="Delete User" className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                <UserMinus size={18} />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Log Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <History size={20} className="text-indigo-600" />
                  System Activity
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-4">No recent activity logs.</p>
                ) : (
                  recentActivity.map((log) => (
                    <div key={log.id} className="relative pl-6 pb-6 border-l border-slate-100 dark:border-slate-800 last:pb-0">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded uppercase">
                              {log.user?.username || "System"}
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 text-center">
                <button className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">View Full Audit Log</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
