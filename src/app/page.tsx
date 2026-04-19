import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTaskStatus, deleteTask } from "@/lib/actions";
import Link from "next/link";
import { HeaderActions } from "@/components/HeaderActions";
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  LayoutDashboard, 
  Calendar, 
  Flag, 
  Tag, 
  LogOut,
  Search,
} from "lucide-react";

export default async function Dashboard(props: { 
  searchParams: Promise<{ filter?: string; category?: string; search?: string }> 
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Fetch fresh user data from DB
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!dbUser) redirect("/login");

  const searchParams = await props.searchParams;
  const { filter, category, search } = searchParams;

  // Build Prisma Query
  const where: any = { userId: dbUser.id };
  
  if (filter === "important") where.priority = "high";
  if (filter === "upcoming") where.dueDate = { gte: new Date() };
  if (category) where.category = category;
  if (search) where.title = { contains: search };

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const pendingCount = tasks.length - completedCount;

  const isActive = (f?: string, c?: string) => {
    if (c) return category === c;
    if (f) return filter === f;
    return !filter && !category;
  };

  const navClass = (active: boolean) => 
    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
    }`;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar - Hidden on mobile, visible on LG+ */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden lg:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">TaskFlow</span>
          </div>

          <nav className="space-y-1">
            <Link href="/" className={navClass(isActive())}>
              <LayoutDashboard size={20} />
              <span>All Tasks</span>
            </Link>
            <Link href="/?filter=upcoming" className={navClass(isActive("upcoming"))}>
              <Calendar size={20} />
              <span>Upcoming</span>
            </Link>
            <Link href="/?filter=important" className={navClass(isActive("important"))}>
              <Flag size={20} />
              <span>Important</span>
            </Link>
          </nav>

          <div className="mt-10">
            <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">My Lists</p>
            <div className="space-y-1">
              {["Personal", "Work", "Ideas"].map(list => (
                <Link 
                  key={list} 
                  href={`/?category=${list}`} 
                  className={navClass(isActive(undefined, list))}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    isActive(undefined, list) ? "bg-indigo-400" : "bg-slate-300 dark:bg-slate-700"
                  }`}></div>
                  <span>{list}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-bold tracking-tight dark:text-white">TaskFlow</span>
          </div>

          <form className="relative flex-1 max-w-md mx-4 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              name="search"
              type="text" 
              placeholder="Search tasks..." 
              defaultValue={search}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none"
            />
          </form>

          <HeaderActions user={{ id: dbUser.id, name: dbUser.username, email: dbUser.email, role: dbUser.role }} />
        </header>

        {/* Dashboard View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  Good morning, {dbUser.username}
                </h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">You have {pendingCount} tasks remaining.</p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <div className="bg-white dark:bg-slate-900 px-3 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1 sm:flex-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{completedCount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Task Section */}
              <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
                {tasks.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 sm:p-12 text-center">
                    <div className="bg-slate-50 dark:bg-slate-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-700">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">No tasks found</p>
                    <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">Clear all filters</Link>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 sm:gap-4 hover:shadow-md dark:hover:shadow-indigo-900/10 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                      <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                        <button
                          type="submit"
                          className={`flex-shrink-0 transition-colors ${
                            task.status === "completed" ? "text-green-500" : "text-slate-300 dark:text-slate-700 hover:text-indigo-400"
                          }`}
                        >
                          {task.status === "completed" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </form>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate ${task.status === "completed" ? "line-through text-slate-400 dark:text-slate-600" : ""}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-3 sm:gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
                            <Tag size={12} />
                            {task.category || "General"}
                          </span>
                          <span className={`flex items-center gap-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            task.priority === "high" ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400" :
                            task.priority === "medium" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400" :
                            "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <form action={deleteTask.bind(null, task.id)} className="lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="submit" className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>

              {/* Action Section */}
              <div className="lg:col-span-4 order-1 lg:order-2">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 sticky top-8">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Plus size={20} />
                    New Task
                  </h2>
                  <form action={createTask} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Title</label>
                      <input name="title" required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">List / Category</label>
                      <select name="category" className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none">
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Ideas">Ideas</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["low", "medium", "high"].map((p) => (
                          <label key={p} className="cursor-pointer">
                            <input type="radio" name="priority" value={p} defaultChecked={p === "medium"} className="sr-only peer" />
                            <div className="text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 peer-checked:bg-white dark:peer-checked:bg-slate-800 peer-checked:border-indigo-600 dark:peer-checked:border-indigo-400 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 transition-all uppercase">
                              {p}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all active:scale-[0.98] mt-4">
                      Create Task
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
