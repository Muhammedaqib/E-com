import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { submitUpdateUserAction } from "@/lib/actions/admin-users";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit User</h1>
        <form
          action={submitUpdateUserAction.bind(null, id)}
          className="mt-8 max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              defaultValue={user.name || ""}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={user.email}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                required
                defaultValue={user.role}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isSuspended"
                  defaultChecked={user.isSuspended}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600"
                />
                <span className="text-sm font-medium text-red-600">Suspend Account</span>
              </label>
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-slate-900 hover:bg-amber-400"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>

      <section className="max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
          Deleting a user is permanent and cannot be undone.
        </p>
        <DeleteUserButton userId={id} />
      </section>
    </div>
  );
}
