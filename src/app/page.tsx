import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTaskStatus, deleteTask } from "@/lib/actions";
import Link from "next/link";
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
  Settings,
  User as UserIcon
} from "lucide-react";

export default async function Dashboard(props: { 
  searchParams: Promise<{ filter?: string; category?: string; search?: string }> 
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const searchParams = await props.searchParams;
  const { filter, category, search } = searchParams;

  // Build Prisma Query
  const where: any = { userId: (session.user as any).id };
  
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
      active ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
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
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">My Lists</p>
            <div className="space-y-1">
              {["Personal", "Work", "Ideas"].map(list => (
                <Link 
                  key={list} 
                  href={`/?category=${list}`} 
                  className={navClass(isActive(undefined, list))}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    isActive(undefined, list) ? "bg-indigo-400" : "bg-slate-300"
                  }`}></div>
                  <span>{list}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <form className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              name="search"
              type="text" 
              placeholder="Search tasks..." 
              defaultValue={search}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </form>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {category ? `${category} Tasks` : filter === "important" ? "Important Tasks" : filter === "upcoming" ? "Upcoming Tasks" : "All Tasks"}
                </h1>
                <p className="text-slate-500 font-medium">You have {pendingCount} tasks remaining.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed</span>
                  <span className="text-xl font-bold text-slate-900">{completedCount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Task Section */}
              <div className="lg:col-span-8 space-y-4">
                {tasks.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-500 font-medium mb-1">No tasks found</p>
                    <Link href="/" className="text-sm text-indigo-600 font-bold">Clear all filters</Link>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="group bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-indigo-100 transition-all">
                      <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                        <button
                          type="submit"
                          className={`flex-shrink-0 transition-colors ${
                            task.status === "completed" ? "text-green-500" : "text-slate-300 hover:text-indigo-400"
                          }`}
                        >
                          {task.status === "completed" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </form>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-slate-800 truncate ${task.status === "completed" ? "line-through text-slate-400" : ""}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Tag size={12} />
                            {task.category || "General"}
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            task.priority === "high" ? "bg-red-50 text-red-600" :
                            task.priority === "medium" ? "bg-amber-50 text-amber-600" :
                            "bg-sky-50 text-sky-600"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <form action={deleteTask.bind(null, task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="submit" className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>

              {/* Action Section */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-8">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                    <Plus size={20} />
                    New Task
                  </h2>
                  <form action={createTask} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                      <input name="title" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">List / Category</label>
                      <select name="category" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none">
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Ideas">Ideas</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["low", "medium", "high"].map((p) => (
                          <label key={p} className="cursor-pointer">
                            <input type="radio" name="priority" value={p} defaultChecked={p === "medium"} className="sr-only peer" />
                            <div className="text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100 bg-slate-50 text-slate-400 peer-checked:bg-white peer-checked:border-indigo-600 peer-checked:text-indigo-600 transition-all uppercase">
                              {p}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-4">
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
