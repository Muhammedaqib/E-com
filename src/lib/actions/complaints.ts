"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitComplaintAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to submit a report." };
  }

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const targetRole = (formData.get("targetRole") as any) || "ADMIN";

  if (!subject || subject.length < 3) return { error: "Subject is too short." };
  if (!message || message.length < 10) return { error: "Message must be at least 10 characters." };

  try {
    await prisma.$transaction(async (tx) => {
      const complaint = await tx.complaint.create({
        data: {
          userId: session.user.id,
          subject,
          targetRole,
          status: "PENDING"
        }
      });

      await tx.complaintMessage.create({
        data: {
          complaintId: complaint.id,
          senderId: session.user.id,
          content: message.trim()
        }
      });
    });

    revalidatePath("/admin/complaints");
    revalidatePath("/profile/support");
    return { success: true };
  } catch (err) {
    console.error("Complaint submission error:", err);
    return { error: "Failed to submit report." };
  }
}
