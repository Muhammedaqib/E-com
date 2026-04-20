"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, slug } = parsed.data;

  try {
    await prisma.category.create({
      data: { name, slug },
    });
  } catch (err) {
    return { error: { slug: ["Slug must be unique"] } };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, slug } = parsed.data;

  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug },
    });
  } catch (err) {
    return { error: { slug: ["Slug must be unique"] } };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();

  try {
    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return { error: "Cannot delete category with existing products." };
    }

    await prisma.category.delete({ where: { id } });
  } catch (err) {
    return { error: "Could not delete category." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function submitCreateCategoryAction(formData: FormData): Promise<void> {
  const res = await createCategoryAction(formData);
  if (res && "error" in res) return;
}

export async function submitUpdateCategoryAction(id: string, formData: FormData): Promise<void> {
  const res = await updateCategoryAction(id, formData);
  if (res && "error" in res) return;
}
