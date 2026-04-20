import { notFound } from "next/navigation";
import { submitUpdateProductAction } from "@/lib/actions/admin-products";
import { parseProductImages } from "@/lib/product-utils";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  return { title: product ? `Edit ${product.name}` : "Edit product" };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const images = parseProductImages(product.images);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit product</h1>
      <form
        action={submitUpdateProductAction.bind(null, id)}
        className="mt-8 max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            defaultValue={product.name}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">URL slug</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={product.slug}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description}
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
              defaultValue={(product.price / 100).toFixed(2)}
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
              defaultValue={product.compareAt ? (product.compareAt / 100).toFixed(2) : ""}
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
            defaultValue={product.stock}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="categoryId"
            required
            defaultValue={product.categoryId}
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
          <input
            type="checkbox"
            name="featured"
            id="featured"
            defaultChecked={product.featured}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="featured" className="text-sm">
            Featured on homepage
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Product Images (up to 4 URLs)</label>
          <div className="mt-2 space-y-2">
            <input
              name="image1"
              placeholder="Primary image URL"
              defaultValue={images[0] || ""}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
            <input
              name="image2"
              placeholder="Additional image URL (optional)"
              defaultValue={images[1] || ""}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
            <input
              name="image3"
              placeholder="Additional image URL (optional)"
              defaultValue={images[2] || ""}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
            <input
              name="image4"
              placeholder="Additional image URL (optional)"
              defaultValue={images[3] || ""}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-slate-900 hover:bg-amber-400"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
