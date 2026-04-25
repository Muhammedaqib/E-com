import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { EditUserForm } from "@/components/admin/EditUserForm";

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
        <EditUserForm user={user} />
      </section>

      <section className="max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
          Deleting a user is permanent and cannot be undone.
        </p>
        <div className="mt-4">
          <DeleteUserButton userId={id} />
        </div>
      </section>
    </div>
  );
}
