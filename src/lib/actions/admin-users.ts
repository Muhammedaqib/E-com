"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

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
    // Attempt with the default (possibly cached) client
    await prisma.user.update({
      where: { id: userId },
      data: { name, email, role, isSuspended },
    });
  } catch (error) {
    // Fallback if the cached client doesn't recognize the new role Enum values
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Invalid value") || errorMessage.includes("Expected Role")) {
      console.log("Prisma cache error detected during user update, retrying with fresh client...");
      const databasePath = path.join(process.cwd(), "dev.db");
      const adapter = new PrismaBetterSqlite3({ url: databasePath });
      const freshClient = new PrismaClient({ adapter });
      
      try {
        await freshClient.user.update({
          where: { id: userId },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { name, email, role: role as any, isSuspended },
        });
        await freshClient.$disconnect();
      } catch (retryError) {
        return { error: "Retry failed: " + (retryError instanceof Error ? retryError.message : "Unknown error") };
      }
    } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: "This email address is already in use." };
    } else {
      return { error: "Failed to update user: " + errorMessage };
    }
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
  } catch {
    return { error: "Could not delete user. They may have active orders." };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/** Form actions must resolve to void for Next.js types; use these wrappers. */
export async function submitDeleteUserAction(userId: string): Promise<void> {
  await deleteUserAction(userId);
}

export async function submitUpdateUserAction(userId: string, formData: FormData): Promise<void> {
  await updateUserAction(userId, formData);
}
