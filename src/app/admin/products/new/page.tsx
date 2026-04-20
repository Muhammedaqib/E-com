import { submitCreateProductAction } from "@/lib/actions/admin-products";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "New product · Admin" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New product</h1>
      <form
        action={submitCreateProductAction}
        className="mt-8 max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950" />
        </div>
        <div>
          <label className="block text-sm font-medium">URL slug</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="e.g. wireless-earbuds"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Price (USD)</label>
            <input
              name="priceDollars"
              type="number"
              step="0.01"
              min="0"
              required
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Compare-at price (optional)</label>
            <input
              name="compareAtDollars"
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={0}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="categoryId"
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" id="featured" className="h-4 w-4 rounded" />
          <label htmlFor="featured" className="text-sm">
            Featured on homepage
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Images (JSON array of URLs)</label>
          <textarea
            name="imagesJson"
            required
            rows={3}
            defaultValue={'["https://picsum.photos/seed/new1/800/800"]'}
            className="mt-1 w-full font-mono text-sm rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-slate-900 hover:bg-amber-400"
        >
          Create product
        </button>
      </form>
    </div>
  );
}
