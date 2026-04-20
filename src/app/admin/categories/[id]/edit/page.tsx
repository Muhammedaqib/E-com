import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { submitUpdateCategoryAction } from "@/lib/actions/admin-categories";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export const metadata = { title: "Edit Category · Admin" };

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit category</h1>
        <form
          action={submitUpdateCategoryAction.bind(null, id)}
          className="mt-8 max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              defaultValue={category.name}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">URL slug</label>
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*$"
              defaultValue={category.slug}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-slate-900 hover:bg-amber-400"
          >
            Save changes
          </button>
        </form>
      </section>

      <section className="max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
          Deleting a category is permanent. It can only be deleted if no products belong to it.
        </p>
        <div className="mt-4">
          <DeleteCategoryButton id={id} />
        </div>
      </section>
    </div>
  );
}
