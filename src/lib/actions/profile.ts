"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
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
    return { error: "Please fill in all fields correctly. Password must be at least 6 characters." };
  }

  const { name, email: rawEmail, phone, address, newPassword, currentPassword } = parsed.data;
  const email = rawEmail.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return { error: "User not found" };

  const passwordMatch = await compare(currentPassword, user.password);
  if (!passwordMatch) {
    return { error: "Incorrect current password" };
  }

  const updateData: {
    name?: string;
    email?: string;
    phone?: string | null;
    address?: string | null;
    password?: string;
  } = {};
  
  if (name.trim()) updateData.name = name.trim();
  
  // Handle phone and address with explicit nulls if empty
  updateData.phone = phone?.trim() || null;
  updateData.address = address?.trim() || null;
  
  // Only update email if it's actually different
  if (email !== user.email.toLowerCase().trim()) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      return { error: "Email is already in use by another account" };
    }
    updateData.email = email;
  }

  if (newPassword && newPassword.length >= 6) {
    updateData.password = await hash(newPassword, 12);
  }

  try {
    console.log("Saving profile for user:", session.user.id, "Data:", JSON.stringify(updateData));
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    });

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Profile update error detail:", err);
    return { error: `Database error: ${err.message || "Failed to update profile"}` };
  }
}
