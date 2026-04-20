"use client";

import { deleteCategoryAction } from "@/lib/actions/admin-categories";

export function DeleteCategoryButton({ id }: { id: string }) {
  return (
    <form
      action={() => {
        if (confirm("Are you sure you want to delete this category?")) {
          deleteCategoryAction(id).then(res => {
            if (res && res.error) alert(res.error);
          });
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Delete Category
      </button>
    </form>
  );
}
