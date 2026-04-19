"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getSession() {
  return await getServerSession(authOptions);
}

export async function createTask(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = (formData.get("priority") as string) || "medium";
  const category = (formData.get("category") as string) || "general";

  await prisma.task.create({
    data: {
      userId: session.user.id,
      title,
      description,
      priority,
      category,
    },
  });

  revalidatePath("/");
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const newStatus = currentStatus === "completed" ? "pending" : "completed";
  const completedAt = newStatus === "completed" ? new Date() : null;

  await prisma.task.update({
    where: { id },
    data: {
      status: newStatus,
      completedAt,
    },
  });

  revalidatePath("/");
}

export async function deleteTask(id: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/");
}
