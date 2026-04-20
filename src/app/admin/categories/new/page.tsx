import { submitCreateCategoryAction } from "@/lib/actions/admin-categories";

export const metadata = { title: "New Category · Admin" };

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New category</h1>
      <form
        action={submitCreateCategoryAction}
        className="mt-8 max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            placeholder="e.g. Electronics"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">URL slug</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*$"
            placeholder="e.g. electronics"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-slate-900 hover:bg-amber-400"
        >
          Create category
        </button>
      </form>
    </div>
  );
}
