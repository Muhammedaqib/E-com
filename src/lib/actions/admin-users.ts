"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const userUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
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
  } catch (err) {
    return { error: { email: ["Email might already be in use"] } };
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}/edit`);
  redirect("/admin/users");
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();

  const currentSession = await auth();
  if (currentSession?.user?.id === userId) {
    return { error: "You cannot delete your own admin account" };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (err) {
    return { error: "Could not delete user. They may have active orders." };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function submitDeleteUserAction(userId: string, _formData: FormData): Promise<void> {
  const result = await deleteUserAction(userId);
  if (result && "error" in result) {
    alert(result.error);
    return;
  }
}

export async function submitUpdateUserAction(userId: string, formData: FormData): Promise<void> {
  const result = await updateUserAction(userId, formData);
  if (result && "error" in result) {
    return;
  }
}
