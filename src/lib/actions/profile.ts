"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  newPassword: z.string().min(6).optional().or(z.literal("")),
  currentPassword: z.string().min(1),
});

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    newPassword: formData.get("newPassword"),
    currentPassword: formData.get("currentPassword"),
  });

  if (!parsed.success) {
    return { error: "Invalid data provided. Please check your entries." };
  }

  const { name, email, phone, address, newPassword, currentPassword } = parsed.data;

  // 1. Find user in DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return { error: "User not found" };

  // 2. Verify current password
  const passwordMatch = await compare(currentPassword, user.password);
  if (!passwordMatch) {
    return { error: "Incorrect current password" };
  }

  // 3. Prepare data for update
  const updateData: any = {};
  
  updateData.name = name.trim();
  updateData.phone = phone?.trim() || null;
  updateData.address = address?.trim() || null;
  
  // Only update email if it's different
  if (email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
    const existing = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });
    if (existing) {
      return { error: "Email is already taken by another account" };
    }
    updateData.email = email.toLowerCase().trim();
  }

  if (newPassword && newPassword.length >= 6) {
    updateData.password = await hash(newPassword, 12);
  }

  // 4. Execute update
  try {
    console.log("Saving user profile for ID:", user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Database update error:", err);
    return { error: "Failed to update profile in database. Error: " + err.message };
  }
}
