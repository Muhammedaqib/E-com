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

  try {
    // Test database connection with a 5-second timeout behavior
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
  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // Provide user-friendly database error messages
    if (error.message?.includes("protocol")) {
      return { error: "Database URL format is invalid. Check Vercel settings." };
    }
    if (error.code === 'P1001' || error.code === 'P1003') {
      return { error: "Cannot reach database. Check if Supabase is active." };
    }
    if (error.code === 'P1000') {
      return { error: "Database login failed. Check your password in Vercel." };
    }
    
    return { error: "Database connection failed. Please check Vercel Logs." };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
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
  if (!session?.user?.id) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) return { error: "User not found" };

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "Current password is incorrect" };

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to update password" };
  }
}
