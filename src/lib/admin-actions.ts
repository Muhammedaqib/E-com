"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function logActivity(userId: string | null, action: string, details: string) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      details,
    },
  });
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  await ensureAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !currentStatus },
  });
  
  await logActivity((await getServerSession(authOptions))?.user?.id as any, "Toggle User Status", `Changed user ${userId} status to ${!currentStatus}`);
  revalidatePath("/admin");
}

export async function deleteUser(userId: string) {
  await ensureAdmin();
  await prisma.user.delete({
    where: { id: userId },
  });

  await logActivity((await getServerSession(authOptions))?.user?.id as any, "Delete User", `Deleted user ${userId}`);
  revalidatePath("/admin");
}

export async function updateUserRole(userId: string, newRole: string) {
  await ensureAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  await logActivity((await getServerSession(authOptions))?.user?.id as any, "Update User Role", `Changed user ${userId} role to ${newRole}`);
  revalidatePath("/admin");
}
