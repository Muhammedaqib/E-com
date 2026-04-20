import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Categories · Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-400"
        >
          Add category
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Products</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.name}</td>
                <td className="px-6 py-4 text-slate-500">{c.slug}</td>
                <td className="px-6 py-4 text-slate-500">{c._count.products}</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <Link
                    href={`/admin/categories/${c.id}/edit`}
                    className="text-amber-600 hover:text-amber-500 dark:text-amber-500"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No categories found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
