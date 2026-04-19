"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { error: "All fields are required" };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    return { error: "Username or email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  try {
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { username, email },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "Username or email already taken" };
    return { error: "Something went wrong" };
  }
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user || !user.password) return { error: "User not found" };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Current password is incorrect" };

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
