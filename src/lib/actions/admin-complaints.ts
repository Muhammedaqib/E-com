"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function resolveComplaintAction(complaintId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "CUSTOMER_CARE" && session.user.role !== "PRODUCT_MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { status: "RESOLVED" }
    });

    revalidatePath("/admin/complaints");
    revalidatePath(`/admin/complaints/${complaintId}`);
    revalidatePath("/profile/support");
    return { success: true };
  } catch {
    return { error: "Failed to resolve complaint." };
  }
}

export async function replyToComplaintAction(complaintId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "CUSTOMER_CARE" && session.user.role !== "PRODUCT_MANAGER")) {
    return { error: "Unauthorized" };
  }

  const reply = formData.get("reply") as string;
  if (!reply || reply.trim().length < 5) {
    return { error: "Reply must be at least 5 characters long." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.complaintMessage.create({
        data: {
          complaintId,
          senderId: session.user.id,
          content: reply.trim()
        }
      });
    });

    revalidatePath("/admin/complaints");
    revalidatePath(`/admin/complaints/${complaintId}`);
    revalidatePath("/profile/support");
    return { success: true };
  } catch {
    return { error: "Failed to send reply." };
  }
}

export async function deleteComplaintAction(complaintId: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "CUSTOMER_CARE" && session.user.role !== "PRODUCT_MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.complaint.delete({
      where: { id: complaintId }
    });

    revalidatePath("/admin/complaints");
    return { success: true };
  } catch {
    return { error: "Failed to delete complaint." };
  }
}
