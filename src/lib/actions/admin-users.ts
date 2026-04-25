"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const userUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN", "PRODUCT_MANAGER", "CUSTOMER_CARE"]),
  isSuspended: z.coerce.boolean(),
});

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateUserAction(userId: string, formData: FormData) {
  await requireAdmin();

  const parsed = userUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    isSuspended: formData.get("isSuspended") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, email, role, isSuspended } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email, role, isSuspended },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: "This email address is already in use." };
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: "Failed to update user: " + errorMessage };
    }
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}/edit`);
  redirect("/admin/users");
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();

  const session = await auth();
  if (session?.user?.id === userId) {
    return { error: "You cannot delete your own account." };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    return { error: "Failed to delete user. They may have existing orders." };
  }

  revalidatePath("/admin/users");
}
