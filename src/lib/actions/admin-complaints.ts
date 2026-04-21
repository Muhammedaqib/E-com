"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function replyToComplaintAction(complaintId: string, formData: FormData) {
  await requireAdmin();

  const reply = formData.get("reply") as string;
  if (!reply || reply.length < 5) {
    return { error: "Reply must be at least 5 characters long." };
  }

  try {
    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        reply,
        status: "RESOLVED"
      }
    });

    revalidatePath("/admin/complaints");
    revalidatePath(`/admin/complaints/${complaintId}`);
    return { success: true };
  } catch (err) {
    return { error: "Failed to send reply." };
  }
}
