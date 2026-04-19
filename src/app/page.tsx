import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTaskStatus, deleteTask } from "@/lib/actions";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-full bg-gray-50 text-black">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">Modern Todo</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">Hi, {session.user?.name}</span>
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Add Task Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
              <form action={createTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-medium transition"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>

          {/* Task List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Your Tasks</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <li className="p-6 text-center text-gray-500">No tasks found. Start by adding one!</li>
                ) : (
                  tasks.map((task) => (
                    <li key={task.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                          <button
                            type="submit"
                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
                              task.status === "completed"
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 text-transparent hover:border-indigo-500"
                            }`}
                          >
                            ✓
                          </button>
                        </form>
                        <div>
                          <p className={`font-medium ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                            {task.title}
                          </p>
                          {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${
                          task.priority === "high" ? "bg-red-100 text-red-700" :
                          task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {task.priority}
                        </span>
                        <form action={deleteTask.bind(null, task.id)}>
                          <button
                            type="submit"
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
