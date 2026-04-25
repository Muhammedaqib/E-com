"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "PRODUCT_MANAGER") {
    throw new Error("Unauthorized");
  }
}

const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(10000),
  priceDollars: z.coerce.number().min(0),
  compareAtDollars: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  featured: z.coerce.boolean().optional(),
  image1: z.string().url().or(z.literal("")).optional(),
  image2: z.string().url().or(z.literal("")).optional(),
  image3: z.string().url().or(z.literal("")).optional(),
  image4: z.string().url().or(z.literal("")).optional(),
});

function toCents(n: number) {
  return Math.round(n * 100);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    priceDollars: formData.get("priceDollars"),
    compareAtDollars: formData.get("compareAtDollars") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    image1: formData.get("image1"),
    image2: formData.get("image2"),
    image3: formData.get("image3"),
    image4: formData.get("image4"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const p = parsed.data;
  const images = [p.image1, p.image2, p.image3, p.image4].filter(Boolean) as string[];

  try {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: toCents(p.priceDollars),
        compareAt:
          p.compareAtDollars !== undefined && p.compareAtDollars > 0
            ? toCents(p.compareAtDollars)
            : null,
        stock: p.stock,
        categoryId: p.categoryId,
        featured: p.featured ?? false,
        images: JSON.stringify(images),
      },
    });
  } catch {
    return { error: { slug: ["Slug must be unique"] } };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    priceDollars: formData.get("priceDollars"),
    compareAtDollars: formData.get("compareAtDollars") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    image1: formData.get("image1"),
    image2: formData.get("image2"),
    image3: formData.get("image3"),
    image4: formData.get("image4"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const p = parsed.data;
  const images = [p.image1, p.image2, p.image3, p.image4].filter(Boolean) as string[];

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: toCents(p.priceDollars),
        compareAt:
          p.compareAtDollars !== undefined && p.compareAtDollars > 0
            ? toCents(p.compareAtDollars)
            : null,
        stock: p.stock,
        categoryId: p.categoryId,
        featured: p.featured ?? false,
        images: JSON.stringify(images),
      },
    });
  } catch {
    return { error: { slug: ["Slug must be unique"] } };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${p.slug}`);
  redirect("/admin/products");
}

/** Form actions must resolve to void for Next.js types; use these wrappers. */
export async function submitCreateProductAction(
  formData: FormData,
): Promise<void> {
  const result = await createProductAction(formData);
  if (result && "error" in result) {
    return;
  }
}

export async function submitUpdateProductAction(
  productId: string,
  formData: FormData,
): Promise<void> {
  const result = await updateProductAction(productId, formData);
  if (result && "error" in result) {
    return;
  }
}

export async function deleteProductAction(
  productId: string,
) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch {
    return { error: "Cannot delete: product may be referenced by existing orders." };
  }
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function submitDeleteProductAction(
  productId: string,
): Promise<void> {
  const result = await deleteProductAction(productId);
  if (result && "error" in result) {
    return;
  }
}

